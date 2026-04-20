import { Locale } from "@/lib/i18n";

export type DocType = "base" | "intermediate" | "advanced";
export type CsCategory = "data-structures" | "algorithms" | "operating-systems" | "networks";
export type KnowledgeSection = "cs" | "tools";

export type SiteDocSummary = {
  lang: string;
  type: DocType;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  headings: string[];
  isFallback: boolean;
};

export type SiteCsSummary = {
  category: CsCategory;
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  headings: string[];
  isFallback: boolean;
};

export type SiteToolSummary = {
  tool: string;
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  headings: string[];
  isFallback: boolean;
};

export type SiteDocRecord = SiteDocSummary & {
  content: string;
};

export type SiteCsRecord = SiteCsSummary & {
  content: string;
};

export type SiteToolRecord = SiteToolSummary & {
  content: string;
};

export type SiteData = {
  languages: string[];
  docTypes: DocType[];
  docs: SiteDocSummary[];
  csCategories: CsCategory[];
  csDocs: SiteCsSummary[];
  tools: string[];
  toolDocs: SiteToolSummary[];
};

export type TopicSummary = {
  slug: string;
  title: string;
  headings: string[];
  availableLocales: Locale[];
};

export function isDocType(value: string | null | undefined): value is DocType {
  return value === "base" || value === "intermediate" || value === "advanced";
}

export function isCsCategory(value: string | null | undefined): value is CsCategory {
  return value === "data-structures" || value === "algorithms" || value === "operating-systems" || value === "networks";
}

export function isKnowledgeSection(value: string | null | undefined): value is KnowledgeSection {
  return value === "cs" || value === "tools";
}

export function getDocExcerpt(doc: Pick<SiteDocRecord, "content"> | Pick<SiteCsRecord, "content"> | Pick<SiteToolRecord, "content">, query?: string) {
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

export function readDocFromSiteData(siteData: SiteData, lang: string, type: DocType, locale: Locale) {
  return siteData.docs.find((doc) => doc.lang === lang && doc.type === type && doc.locale === locale) ?? null;
}

export function readCsDocFromSiteData(siteData: SiteData, category: CsCategory, slug: string, locale: Locale) {
  return siteData.csDocs.find((doc) => doc.category === category && doc.slug === slug && doc.locale === locale) ?? null;
}

export function readToolDocFromSiteData(siteData: SiteData, tool: string, slug: string, locale: Locale) {
  return siteData.toolDocs.find((doc) => doc.tool === tool && doc.slug === slug && doc.locale === locale) ?? null;
}

export function listCsTopicsFromSiteData(siteData: SiteData, category: CsCategory, locale: Locale): TopicSummary[] {
  return siteData.csDocs
    .filter((doc) => doc.category === category && doc.locale === locale)
    .map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      headings: doc.headings,
      availableLocales: doc.availableLocales
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function listToolDocsFromSiteData(siteData: SiteData, tool: string, locale: Locale): TopicSummary[] {
  return siteData.toolDocs
    .filter((doc) => doc.tool === tool && doc.locale === locale)
    .map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      headings: doc.headings,
      availableLocales: doc.availableLocales
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function listKnowledgeSectionsFromSiteData(siteData: SiteData, locale: Locale) {
  const sections: KnowledgeSection[] = [];

  if (siteData.csCategories.some((category) => listCsTopicsFromSiteData(siteData, category, locale).length > 0)) {
    sections.push("cs");
  }

  if (siteData.tools.some((tool) => listToolDocsFromSiteData(siteData, tool, locale).length > 0)) {
    sections.push("tools");
  }

  return sections;
}

export function pickCompareLanguagesFromSiteData(siteData: SiteData, left?: string | null, right?: string | null) {
  const { languages } = siteData;

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

export function pickCsDocFromSiteData(siteData: SiteData, category: string | null | undefined, slug: string | null | undefined, locale: Locale) {
  const categories = siteData.csCategories.filter((item) => listCsTopicsFromSiteData(siteData, item, locale).length > 0);

  if (categories.length === 0) {
    return {
      categories,
      category: "" as CsCategory | "",
      topics: [] as TopicSummary[],
      slug: ""
    };
  }

  const safeCategory = isCsCategory(category) && categories.includes(category) ? category : categories[0];
  const topics = listCsTopicsFromSiteData(siteData, safeCategory, locale);
  const safeSlug = slug && topics.some((topic) => topic.slug === slug) ? slug : topics[0]?.slug ?? "";

  return {
    categories,
    category: safeCategory,
    topics,
    slug: safeSlug
  };
}

export function pickKnowledgeDocFromSiteData(
  siteData: SiteData,
  section: string | null | undefined,
  category: string | null | undefined,
  slug: string | null | undefined,
  locale: Locale
) {
  const sections = listKnowledgeSectionsFromSiteData(siteData, locale);

  if (sections.length === 0) {
    return {
      sections,
      section: "" as KnowledgeSection | "",
      categories: [] as string[],
      category: "",
      topics: [] as TopicSummary[],
      slug: ""
    };
  }

  const safeSection = isKnowledgeSection(section) && sections.includes(section) ? section : sections[0];

  if (safeSection === "tools") {
    const categories = siteData.tools.filter((tool) => listToolDocsFromSiteData(siteData, tool, locale).length > 0);
    const safeCategory = category && categories.includes(category) ? category : categories[0] ?? "";
    const topics = safeCategory ? listToolDocsFromSiteData(siteData, safeCategory, locale) : [];
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

  const categories = siteData.csCategories.filter((item) => listCsTopicsFromSiteData(siteData, item, locale).length > 0);
  const safeCategory = isCsCategory(category) && categories.includes(category) ? category : categories[0] ?? "";
  const topics = safeCategory ? listCsTopicsFromSiteData(siteData, safeCategory, locale) : [];
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
