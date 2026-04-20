"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CsShell } from "@/components/cs-shell";
import { useSiteData } from "@/components/content-data-provider";
import { MarkdownPane } from "@/components/markdown-pane";
import { useCsDocResource, useToolDocResource } from "@/lib/doc-client";
import { formatCategoryLabel, formatKnowledgeSectionLabel, hrefWithLocale, resolveLocale, t } from "@/lib/i18n";
import { useLocalSearchParams } from "@/lib/local-search-params";
import {
  isCsCategory,
  isKnowledgeSection,
  pickKnowledgeDocFromSiteData,
  readCsDocFromSiteData,
  readToolDocFromSiteData
} from "@/lib/site-data";
import { formatDisplayName } from "@/lib/text";

export default function CsPage() {
  const siteData = useSiteData();
  const initialSearchParams = useSearchParams();
  const { searchParams, updateParams } = useLocalSearchParams(initialSearchParams.toString());
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);
  const requestedSection = isKnowledgeSection(searchParams.get("section")) ? searchParams.get("section") : undefined;
  const { sections, section, categories, category, topics, slug } = pickKnowledgeDocFromSiteData(
    siteData,
    requestedSection,
    searchParams.get("category"),
    searchParams.get("slug"),
    locale
  );

  if (!sections.length || !section || !category || !slug) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-8 shadow-panel">
          <h1 className="font-serif text-4xl">{copy.noCsDocsTitle}</h1>
          <p className="mt-4 text-moss/80">{copy.noCsDocsBody}</p>
        </div>
      </main>
    );
  }

  const docSummary =
    section === "tools" ? readToolDocFromSiteData(siteData, category, slug, locale) : isCsCategory(category) ? readCsDocFromSiteData(siteData, category, slug, locale) : null;
  const query = searchParams.get("q")?.trim() ?? "";

  const toolDocState = useToolDocResource(docSummary && section === "tools" ? { kind: "tool", locale, tool: category, slug } : null);
  const csDocState = useCsDocResource(docSummary && section === "cs" && isCsCategory(category) ? { kind: "cs", locale, category, slug } : null);
  const docState = section === "tools" ? toolDocState : csDocState;

  if (!docSummary) {
    return null;
  }

  const sectionOptions = sections.map((item) => ({
    value: item,
    label: formatKnowledgeSectionLabel(item, locale)
  }));
  const categoryOptions = categories.map((item) => ({
    value: item,
    label: section === "tools" ? formatDisplayName(item) : formatCategoryLabel(item, locale)
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,114,66,0.18),_transparent_30%),linear-gradient(180deg,_#f6f2e8_0%,_#efe6d4_100%)] bg-grid bg-[size:28px_28px] px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-moss/80">
          <Link className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 transition hover:border-leaf hover:text-leaf" href={hrefWithLocale("/", locale)}>
            {copy.home}
          </Link>
          <Link className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 transition hover:border-leaf hover:text-leaf" href={hrefWithLocale("/compare", locale)}>
            {copy.languageCompare}
          </Link>
        </div>
        <CsShell
          locale={locale}
          sections={sectionOptions}
          currentSection={section}
          currentSectionLabel={formatKnowledgeSectionLabel(section, locale)}
          categories={categoryOptions}
          currentCategory={category}
          topics={topics}
          currentSlug={slug}
          query={query}
          headings={docSummary.headings}
          paneTitle={docSummary.title}
          pane={
            docState.doc ? (
              <MarkdownPane doc={docState.doc} side="left" anchorPrefix="cs" query={query} />
            ) : docState.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{docState.error}</div>
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-mist/70 px-4 py-3 text-sm text-moss/80">{copy.loading}</div>
            )
          }
          onParamsChange={updateParams}
        />
      </div>
    </main>
  );
}
