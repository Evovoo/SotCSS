import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "public", "docs-data");
const LANG_CONTENT_ROOT = path.join(ROOT, "langs");
const CS_CONTENT_ROOT = path.join(ROOT, "cs");
const TOOLS_CONTENT_ROOT = path.join(ROOT, "tools");
const DOC_TYPES = ["base", "intermediate", "advanced"];
const CS_CATEGORIES = ["data-structures", "algorithms", "operating-systems", "networks"];
const LOCALES = ["en", "zh"];

function isDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function resetOutputDir(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
  ensureDir(targetPath);
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLocalizedMarkdownPath(filePath, locale) {
  if (locale === "en") {
    return filePath;
  }

  const localizedPath = filePath.replace(/\.md$/i, `.${locale}.md`);
  return fs.existsSync(localizedPath) ? localizedPath : filePath;
}

function getAvailableLocales(filePath) {
  const locales = ["en"];
  const localizedPath = filePath.replace(/\.md$/i, ".zh.md");
  if (fs.existsSync(localizedPath)) {
    locales.push("zh");
  }
  return locales;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { data: {}, content: raw };
  }

  const endIndex = raw.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {}, content: raw };
  }

  const frontmatter = raw.slice(4, endIndex);
  const content = raw.slice(endIndex + 5);
  const data = {};

  for (const line of frontmatter.split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key) {
      data[key] = value;
    }
  }

  return { data, content };
}

function readMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(raw);
  const headings = Array.from(parsed.content.matchAll(/^##\s+(.+)$/gm), (match) => match[1].trim());
  return { parsed, headings };
}

function writeJson(relativePath, payload) {
  const outputPath = path.join(OUTPUT_ROOT, relativePath);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, `${JSON.stringify(payload)}\n`, "utf8");
}

function listLanguages() {
  if (!isDirectory(LANG_CONTENT_ROOT)) {
    return [];
  }

  return fs
    .readdirSync(LANG_CONTENT_ROOT)
    .filter((entry) => isDirectory(path.join(LANG_CONTENT_ROOT, entry)))
    .filter((entry) => DOC_TYPES.every((docType) => fs.existsSync(path.join(LANG_CONTENT_ROOT, entry, `${docType}.md`))))
    .sort();
}

function listTools() {
  if (!isDirectory(TOOLS_CONTENT_ROOT)) {
    return [];
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

function listCategorySlugs(contentRoot) {
  if (!isDirectory(contentRoot)) {
    return [];
  }

  return fs
    .readdirSync(contentRoot)
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => !entry.endsWith(".zh.md"))
    .map((entry) => entry.replace(/\.md$/i, ""))
    .sort();
}

function buildLanguageDoc(lang, type, locale) {
  const filePath = path.join(LANG_CONTENT_ROOT, lang, `${type}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = `${toTitleCase(lang)} ${toTitleCase(type)}`;
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;

  return {
    lang,
    type,
    locale,
    availableLocales: getAvailableLocales(filePath),
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

function buildCsDoc(category, slug, locale) {
  const filePath = path.join(CS_CONTENT_ROOT, category, `${slug}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = toTitleCase(slug);
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;

  return {
    category,
    slug,
    locale,
    availableLocales: getAvailableLocales(filePath),
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

function buildToolDoc(tool, slug, locale) {
  const filePath = path.join(TOOLS_CONTENT_ROOT, tool, `${slug}.md`);
  const resolvedPath = getLocalizedMarkdownPath(filePath, locale);
  const { parsed, headings } = readMarkdownFile(resolvedPath);
  const fallbackTitle = `${toTitleCase(tool)} ${toTitleCase(slug)}`;
  const title = typeof parsed.data.title === "string" ? parsed.data.title : fallbackTitle;

  return {
    tool,
    slug,
    locale,
    availableLocales: getAvailableLocales(filePath),
    title,
    content: parsed.content,
    headings,
    isFallback: locale !== "en" && resolvedPath === filePath
  };
}

function generateLanguageAssets() {
  for (const locale of LOCALES) {
    for (const lang of listLanguages()) {
      for (const type of DOC_TYPES) {
        writeJson(path.join("language", locale, lang, `${type}.json`), buildLanguageDoc(lang, type, locale));
      }
    }
  }
}

function generateCsAssets() {
  for (const locale of LOCALES) {
    for (const category of CS_CATEGORIES) {
      for (const slug of listCategorySlugs(path.join(CS_CONTENT_ROOT, category))) {
        writeJson(path.join("cs", locale, category, `${slug}.json`), buildCsDoc(category, slug, locale));
      }
    }
  }
}

function generateToolAssets() {
  for (const locale of LOCALES) {
    for (const tool of listTools()) {
      for (const slug of listCategorySlugs(path.join(TOOLS_CONTENT_ROOT, tool))) {
        writeJson(path.join("tool", locale, tool, `${slug}.json`), buildToolDoc(tool, slug, locale));
      }
    }
  }
}

resetOutputDir(OUTPUT_ROOT);
generateLanguageAssets();
generateCsAssets();
generateToolAssets();
