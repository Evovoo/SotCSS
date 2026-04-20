import { listCsCategories, listCsTopics, listDocTypes, listLanguages, listToolDocs, listTools, readCsDocSummary, readDocSummary, readToolDocSummary } from "@/lib/mdx";
import { Locale } from "@/lib/i18n";
import { SiteData } from "@/lib/site-data";

export function getSiteData(): SiteData {
  const locales: Locale[] = ["en", "zh"];
  const languages = listLanguages();
  const docTypes = listDocTypes();
  const csCategories = listCsCategories();
  const tools = listTools();

  return {
    languages,
    docTypes,
    docs: locales.flatMap((locale) =>
      languages.flatMap((lang) => docTypes.map((type) => readDocSummary(lang, type, locale)))
    ),
    csCategories,
    csDocs: locales.flatMap((locale) =>
      csCategories.flatMap((category) => listCsTopics(category, locale).map((topic) => readCsDocSummary(category, topic.slug, locale)))
    ),
    tools,
    toolDocs: locales.flatMap((locale) =>
      tools.flatMap((tool) => listToolDocs(tool, locale).map((topic) => readToolDocSummary(tool, topic.slug, locale)))
    )
  };
}
