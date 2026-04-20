"use client";

import Link from "next/link";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RichMarkdownPreview } from "@/components/rich-markdown-preview";
import { useCsDocResource } from "@/lib/doc-client";
import { hrefWithLocale, resolveLocale, t } from "@/lib/i18n";
import { isCsCategory } from "@/lib/site-data";
import { slugify } from "@/lib/text";

type ConceptDrawerContextValue = {
  openConcept: (href: string) => void;
};

const ConceptDrawerContext = createContext<ConceptDrawerContextValue | null>(null);

export function ConceptDrawerProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);
  const [href, setHref] = useState("");

  const conceptUrl = useMemo(() => (href ? new URL(href, "http://localhost") : null), [href]);
  const requestedCategory = conceptUrl?.searchParams.get("category");
  const requestedSlug = conceptUrl?.searchParams.get("slug");
  const docRequest =
    requestedCategory && isCsCategory(requestedCategory) && requestedSlug
      ? {
          kind: "cs" as const,
          locale,
          category: requestedCategory,
          slug: requestedSlug
        }
      : null;
  const { doc, loading, error: fetchError } = useCsDocResource(docRequest);
  const fullBridgeHref = conceptUrl ? hrefWithLocale(`${conceptUrl.pathname}${conceptUrl.search}`, locale) : hrefWithLocale("/cs", locale);
  const error = href && !docRequest ? copy.invalidConceptLink : fetchError ? copy.failedConceptPreview : "";

  return (
    <ConceptDrawerContext.Provider value={{ openConcept: setHref }}>
      {children}
      {href ? <button aria-label={copy.close} className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[1px]" onClick={() => setHref("")} type="button" /> : null}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-ink/10 bg-[linear-gradient(180deg,_rgba(246,242,232,0.98)_0%,_rgba(255,255,255,0.98)_100%)] shadow-[0_24px_80px_rgba(17,34,24,0.18)] transition-transform duration-200 ${
          href ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.csPreview}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{doc?.title ?? copy.loading}</h2>
              {doc ? <p className="mt-1 text-sm text-moss/75">{doc.category}</p> : null}
            </div>
            <button
              className="rounded-full border border-ink/10 px-3 py-2 text-sm text-moss/75 transition hover:border-leaf hover:text-leaf"
              onClick={() => setHref("")}
              type="button"
            >
              {copy.close}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {loading ? <p className="text-sm text-moss/75">{copy.loadingPreview}</p> : null}
            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            {!loading && !error && doc ? (
              <div className="space-y-6">
                <section className="rounded-[1.5rem] border border-ink/10 bg-white/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-moss/60">{copy.preview}</p>
                  <div className="mt-3">
                    <RichMarkdownPreview anchorPrefix="drawer" source={doc.content} />
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-ink/10 bg-white/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-moss/60">{copy.sectionIndex}</p>
                  <div className="mt-3 space-y-2">
                    {doc.headings.map((heading) => (
                      <Link
                        key={heading}
                        className="block rounded-xl bg-mist/80 px-3 py-2 text-sm text-moss/85 transition hover:bg-ember/10 hover:text-ember"
                        href={`${fullBridgeHref}#cs-${slugify(heading)}`}
                      >
                        {heading}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          <div className="border-t border-ink/10 px-5 py-4">
            <Link className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-sand transition hover:bg-moss" href={fullBridgeHref}>
              {copy.openFullBridge}
            </Link>
          </div>
        </div>
      </aside>
    </ConceptDrawerContext.Provider>
  );
}

export function useConceptDrawer() {
  const context = useContext(ConceptDrawerContext);
  if (!context) {
    throw new Error("useConceptDrawer must be used within ConceptDrawerProvider.");
  }
  return context;
}
