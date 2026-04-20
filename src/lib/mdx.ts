import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Locale } from "@/lib/i18n";
import { slugify } from "@/lib/text";

export type DocType = "base" | "intermediate" | "advanced";

export type DocRecord = {
  lang: string;
  type: DocType;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  content: string;
  headings: string[];
  isFallback: boolean;
};

export type DocSummary = Omit<DocRecord, "content">;

export type CsCategory = "data-structures" | "algorithms" | "operating-systems" | "networks";

export type CsRecord = {
  category: CsCategory;
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  content: string;
  headings: string[];
  isFallback: boolean;
};

export type CsSummary = Omit<CsRecord, "content">;

export type CsTopicSummary = {
  slug: string;
  title: string;
  headings: string[];
  availableLocales: Locale[];
};

export type ToolRecord = {
  tool: string;
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  content: string;
  headings: string[];
  isFallback: boolean;
};

export type ToolSummary = Omit<ToolRecord, "content">;

export type ToolDocSummary = {
  slug: string;
  title: string;
  headings: string[];
  availableLocales: Locale[];
};

export type KnowledgeSection = "cs" | "tools";

const LANG_CONTENT_ROOT = path.join(process.cwd(), "langs");
const CS_CONTENT_ROOT = path.join(process.cwd(), "cs");
const TOOLS_CONTENT_ROOT = path.join(process.cwd(), "tools");
const DOC_TYPES: DocType[] = ["base", "intermediate", "advanced"];
const CS_CATEGORIES: CsCategory[] = ["data-structures", "algorithms", "operating-systems", "networks"];

function isDirectory(targetPath: string) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readMarkdownFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing document: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const headings = Array.from(parsed.content.matchAll(/^##\s+(.+)$/gm), (match) => match[1].trim());

  return { parsed, headings };
}

function getLocalizedMarkdownPath(filePath: string, locale: Locale) {
  if (locale === "en") {
    return filePath;
  }

  const localizedPath = filePath.replace(/\.md$/i, `.${locale}.md`);
  return fs.existsSync(localizedPath) ? localizedPath : filePath;
}

function getAvailableLocales(filePath: string): Locale[] {
  const locales: Locale[] = ["en"];
  const localizedPath = filePath.replace(/\.md$/i, ".zh.md");
  if (fs.existsSync(localizedPath)) {
    locales.push("zh");
  }
  return locales;
}

export function listLanguages() {
  if (!isDirectory(LANG_CONTENT_ROOT)) {
    return [] as string[];
  }

  return fs
    .readdirSync(LANG_CONTENT_ROOT)
    .filter((entry) => isDirectory(path.join(LANG_CONTENT_ROOT, entry)))
    .filter((entry) => DOC_TYPES.every((docType) => fs.existsSync(path.join(LANG_CONTENT_ROOT, entry, `${docType}.md`))))
    .sort();
}

export function listDocTypes() {
  return DOC_TYPES;
}

export function isDocType(value: string | null | undefined): value is DocType {
  return typeof value === "string" && DOC_TYPES.includes(value as DocType);
}

export function readDoc(lang: string, type: DocType, locale: Locale = "en"): DocRecord {
  const filePath = path.join(LANG_CONTENT_ROOT, lang, `${type}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = `${toTitleCase(lang)} ${toTitleCase(type)}`;
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;
  const availableLocales = getAvailableLocales(filePath);

  return {
    lang,
    type,
    locale,
    availableLocales,
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

export function readDocSummary(lang: string, type: DocType, locale: Locale = "en"): DocSummary {
  const { content: _content, ...summary } = readDoc(lang, type, locale);
  return summary;
}

export function pickCompareLanguages(left?: string, right?: string) {
  const languages = listLanguages();

  if (languages.length === 0) {
    return { languages, left: "", right: "" };
  }

  const safeLeft = left && languages.includes(left) ? left : languages[0];
  const safeRightCandidate = right && languages.includes(right) ? right : languages[1] ?? languages[0];
  const safeRight = safeRightCandidate === safeLeft && languages.length > 1 ? languages.find((item) => item !== safeLeft) ?? safeRightCandidate : safeRightCandidate;

  return {
    languages,
    left: safeLeft,
    right: safeRight
  };
}

export function listCsCategories() {
  return CS_CATEGORIES;
}

export function isCsCategory(value: string | null | undefined): value is CsCategory {
  return typeof value === "string" && CS_CATEGORIES.includes(value as CsCategory);
}

export function listCsTopics(category: CsCategory, locale: Locale = "en"): CsTopicSummary[] {
  const categoryPath = path.join(CS_CONTENT_ROOT, category);
  if (!isDirectory(categoryPath)) {
    return [];
  }

  return fs
    .readdirSync(categoryPath)
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => !entry.endsWith(".zh.md"))
    .map((entry) => {
      const slug = entry.replace(/\.md$/i, "");
      const filePath = path.join(categoryPath, entry);
      const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
      const { parsed, headings } = readMarkdownFile(resolvedPath);
      const fallbackTitle = toTitleCase(slug);
      const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;
      const availableLocales = getAvailableLocales(filePath);

      return { slug, title, headings, availableLocales };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function readCsDoc(category: CsCategory, slug: string, locale: Locale = "en"): CsRecord {
  const filePath = path.join(CS_CONTENT_ROOT, category, `${slug}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = toTitleCase(slug);
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;
  const availableLocales = getAvailableLocales(filePath);

  return {
    category,
    slug,
    locale,
    availableLocales,
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

export function readCsDocSummary(category: CsCategory, slug: string, locale: Locale = "en"): CsSummary {
  const { content: _content, ...summary } = readCsDoc(category, slug, locale);
  return summary;
}

export function listTools() {
  if (!isDirectory(TOOLS_CONTENT_ROOT)) {
    return [] as string[];
  }

  return fs
    .readdirSync(TOOLS_CONTENT_ROOT)
    .filter((entry) => isDirectory(path.join(TOOLS_CONTENT_ROOT, entry)))
    .filter((entry) =>
      fs
        .readdirSync(path.join(TOOLS_CONTENT_ROOT, entry))
        .some((fileName) => fileName.endsWith(".md") && !fileName.endsWith(".zh.md"))
    )
    .sort();
}

export function listToolDocs(tool: string, locale: Locale = "en"): ToolDocSummary[] {
  const toolPath = path.join(TOOLS_CONTENT_ROOT, tool);
  if (!isDirectory(toolPath)) {
    return [];
  }

  return fs
    .readdirSync(toolPath)
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => !entry.endsWith(".zh.md"))
    .map((entry) => {
      const slug = entry.replace(/\.md$/i, "");
      const filePath = path.join(toolPath, entry);
      const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
      const { parsed, headings } = readMarkdownFile(resolvedPath);
      const fallbackTitle = `${toTitleCase(tool)} ${toTitleCase(slug)}`;
      const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;
      const availableLocales = getAvailableLocales(filePath);

      return { slug, title, headings, availableLocales };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function readToolDoc(tool: string, slug: string, locale: Locale = "en"): ToolRecord {
  const filePath = path.join(TOOLS_CONTENT_ROOT, tool, `${slug}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = `${toTitleCase(tool)} ${toTitleCase(slug)}`;
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;
  const availableLocales = getAvailableLocales(filePath);

  return {
    tool,
    slug,
    locale,
    availableLocales,
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

export function readToolDocSummary(tool: string, slug: string, locale: Locale = "en"): ToolSummary {
  const { content: _content, ...summary } = readToolDoc(tool, slug, locale);
  return summary;
}

export function isKnowledgeSection(value: string | null | undefined): value is KnowledgeSection {
  return value === "cs" || value === "tools";
}

export function listKnowledgeSections(locale: Locale = "en") {
  const sections: KnowledgeSection[] = [];

  if (listCsCategories().some((category) => listCsTopics(category, locale).length > 0)) {
    sections.push("cs");
  }

  if (listTools().some((tool) => listToolDocs(tool, locale).length > 0)) {
    sections.push("tools");
  }

  return sections;
}

export function pickKnowledgeDoc(section?: string, category?: string, slug?: string, locale: Locale = "en") {
  const sections = listKnowledgeSections(locale);

  if (sections.length === 0) {
    return {
      sections,
      section: "" as KnowledgeSection | "",
      categories: [] as string[],
      category: "",
      topics: [] as Array<CsTopicSummary | ToolDocSummary>,
      slug: ""
    };
  }

  const safeSection = isKnowledgeSection(section) && sections.includes(section) ? section : sections[0];

  if (safeSection === "tools") {
    const categories = listTools().filter((tool) => listToolDocs(tool, locale).length > 0);
    const safeCategory = category && categories.includes(category) ? category : categories[0] ?? "";
    const topics = safeCategory ? listToolDocs(safeCategory, locale) : [];
    const safeSlug = slug && topics.some((topic) => topic.slug === slug) ? slug : topics[0]?.slug ?? "";

    return {
      sections,
      section: safeSection,
      categories,
      category: safeCategory,
      topics,
      slug: safeSlug
    };
  }

  const categories = listCsCategories().filter((item) => listCsTopics(item, locale).length > 0);
  const safeCategory = isCsCategory(category) && categories.includes(category) ? category : categories[0] ?? "";
  const topics = safeCategory ? listCsTopics(safeCategory, locale) : [];
  const safeSlug = slug && topics.some((topic) => topic.slug === slug) ? slug : topics[0]?.slug ?? "";

  return {
    sections,
    section: safeSection,
    categories,
    category: safeCategory,
    topics,
    slug: safeSlug
  };
}

export function pickCsDoc(category?: string, slug?: string, locale: Locale = "en") {
  const categories = listCsCategories().filter((item) => listCsTopics(item, locale).length > 0);

  if (categories.length === 0) {
    return {
      categories,
      category: "" as CsCategory | "",
      topics: [] as CsTopicSummary[],
      slug: ""
    };
  }

  const safeCategory = isCsCategory(category) && categories.includes(category) ? category : categories[0];
  const topics = listCsTopics(safeCategory, locale);
  const safeSlug = slug && topics.some((topic) => topic.slug === slug) ? slug : topics[0]?.slug ?? "";

  return {
    categories,
    category: safeCategory,
    topics,
    slug: safeSlug
  };
}

export function getDocExcerpt(doc: Pick<DocRecord, "content"> | Pick<CsRecord, "content"> | Pick<ToolRecord, "content">, query?: string) {
  if (!query) {
    return doc.content;
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return doc.content;
  }

  const sections = doc.content.split(/(?=^##\s+)/gm);
  const matchedSections = sections.filter((section) => section.toLowerCase().includes(normalized));
  return matchedSections.length > 0 ? matchedSections.join("\n\n") : doc.content;
}
