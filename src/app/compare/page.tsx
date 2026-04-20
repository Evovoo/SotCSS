"use client";

import { useSearchParams } from "next/navigation";
import { CompareShell } from "@/components/compare-shell";
import { useSiteData } from "@/components/content-data-provider";
import { MarkdownPane } from "@/components/markdown-pane";
import { useLanguageDocResource } from "@/lib/doc-client";
import { getRelatedCsLinks } from "@/lib/cs-links";
import { resolveLocale, t } from "@/lib/i18n";
import { useLocalSearchParams } from "@/lib/local-search-params";
import { isDocType, pickCompareLanguagesFromSiteData, readDocFromSiteData } from "@/lib/site-data";

export default function ComparePage() {
  const siteData = useSiteData();
  const initialSearchParams = useSearchParams();
  const { searchParams, updateParams } = useLocalSearchParams(initialSearchParams.toString());
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);
  const typeParam = searchParams.get("type");
  const docType = isDocType(typeParam) ? typeParam : "base";
  const { languages, left, right } = pickCompareLanguagesFromSiteData(siteData, searchParams.get("left"), searchParams.get("right"));

  if (languages.length === 0 || !left || !right) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-ink/10 bg-white p-8 shadow-panel">
          <h1 className="font-serif text-4xl">{copy.noLanguageDocsTitle}</h1>
          <p className="mt-4 text-moss/80">{copy.noLanguageDocsBody}</p>
        </div>
      </main>
    );
  }

  const leftDocSummary = readDocFromSiteData(siteData, left, docType, locale);
  const rightDocSummary = readDocFromSiteData(siteData, right, docType, locale);
  const query = searchParams.get("q")?.trim() ?? "";

  const leftDocState = useLanguageDocResource(leftDocSummary ? { kind: "language", locale, lang: left, type: docType } : null);
  const rightDocState = useLanguageDocResource(rightDocSummary ? { kind: "language", locale, lang: right, type: docType } : null);

  if (!leftDocSummary || !rightDocSummary) {
    return null;
  }

  const leftRelatedConcepts = leftDocState.doc ? getRelatedCsLinks(leftDocState.doc, docType, query) : [];
  const rightRelatedConcepts = rightDocState.doc ? getRelatedCsLinks(rightDocState.doc, docType, query) : [];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,114,66,0.18),_transparent_30%),linear-gradient(180deg,_#f6f2e8_0%,_#efe6d4_100%)] bg-grid bg-[size:28px_28px] px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1600px]">
        <CompareShell
          languages={languages}
          locale={locale}
          currentLeft={left}
          currentRight={right}
          currentType={docType}
          query={query}
          leftHeadings={leftDocSummary.headings}
          rightHeadings={rightDocSummary.headings}
          leftRelatedConcepts={leftRelatedConcepts}
          rightRelatedConcepts={rightRelatedConcepts}
          leftPane={
            leftDocState.doc ? (
              <MarkdownPane doc={leftDocState.doc} side="left" query={query} />
            ) : leftDocState.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{leftDocState.error}</div>
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-mist/70 px-4 py-3 text-sm text-moss/80">{copy.loading}</div>
            )
          }
          rightPane={
            rightDocState.doc ? (
              <MarkdownPane doc={rightDocState.doc} side="right" query={query} />
            ) : rightDocState.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{rightDocState.error}</div>
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
