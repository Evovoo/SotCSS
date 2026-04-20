"use client";

import { useSearchParams } from "next/navigation";
import { ConceptBridgeShell } from "@/components/concept-bridge-shell";
import { useSiteData } from "@/components/content-data-provider";
import { MarkdownPane } from "@/components/markdown-pane";
import { useCsDocResource, useLanguageDocResource } from "@/lib/doc-client";
import { resolveLocale, t } from "@/lib/i18n";
import { useLocalSearchParams } from "@/lib/local-search-params";
import { isDocType, listCsTopicsFromSiteData, readCsDocFromSiteData, readDocFromSiteData } from "@/lib/site-data";

export default function ConceptsPage() {
  const siteData = useSiteData();
  const initialSearchParams = useSearchParams();
  const { searchParams, updateParams } = useLocalSearchParams(initialSearchParams.toString());
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);
  const language = searchParams.get("lang") && siteData.languages.includes(searchParams.get("lang") as string) ? (searchParams.get("lang") as string) : siteData.languages[0] ?? "";
  const typeParam = searchParams.get("type");
  const type = isDocType(typeParam) ? typeParam : "base";
  const categories = siteData.csCategories.filter((item) => listCsTopicsFromSiteData(siteData, item, locale).length > 0);
  const categoryParam = searchParams.get("category");
  const category = categoryParam && categories.includes(categoryParam as (typeof categories)[number]) ? (categoryParam as (typeof categories)[number]) : categories[0];
  const topics = category ? listCsTopicsFromSiteData(siteData, category, locale) : [];
  const slugParam = searchParams.get("slug");
  const slug = slugParam && topics.some((topic) => topic.slug === slugParam) ? slugParam : topics[0]?.slug ?? "";
  const query = searchParams.get("q")?.trim() ?? "";

  if (!language || !category || !slug) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-8 shadow-panel">
          <h1 className="font-serif text-4xl">{copy.noBridgeTitle}</h1>
          <p className="mt-4 text-moss/80">{copy.noBridgeBody}</p>
        </div>
      </main>
    );
  }

  const languageDocSummary = readDocFromSiteData(siteData, language, type, locale);
  const csDocSummary = readCsDocFromSiteData(siteData, category, slug, locale);

  const languageDocState = useLanguageDocResource(languageDocSummary ? { kind: "language", locale, lang: language, type } : null);
  const csDocState = useCsDocResource(csDocSummary ? { kind: "cs", locale, category, slug } : null);

  if (!languageDocSummary || !csDocSummary) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,114,66,0.18),_transparent_30%),linear-gradient(180deg,_#f6f2e8_0%,_#efe6d4_100%)] bg-grid bg-[size:28px_28px] px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1600px]">
        <ConceptBridgeShell
          locale={locale}
          languages={siteData.languages}
          currentLanguage={language}
          currentType={type}
          categories={categories}
          currentCategory={category}
          topics={topics}
          currentSlug={slug}
          query={query}
          leftHeadings={languageDocSummary.headings}
          rightHeadings={csDocSummary.headings}
          rightTitle={csDocSummary.title}
          leftPane={
            languageDocState.doc ? (
              <MarkdownPane doc={languageDocState.doc} side="left" query={query} />
            ) : languageDocState.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{languageDocState.error}</div>
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-mist/70 px-4 py-3 text-sm text-moss/80">{copy.loading}</div>
            )
          }
          rightPane={
            csDocState.doc ? (
              <MarkdownPane doc={csDocState.doc} side="right" query={query} anchorPrefix="cs" />
            ) : csDocState.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{csDocState.error}</div>
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
