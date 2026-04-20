"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import type { RelatedCsLink } from "@/lib/cs-links";
import { formatDocTypeLabel, hrefWithLocale, Locale, t } from "@/lib/i18n";
import type { DocType } from "@/lib/site-data";
import { formatDisplayName } from "@/lib/text";

type CompareShellProps = {
  languages: string[];
  locale: Locale;
  currentLeft: string;
  currentRight: string;
  currentType: DocType;
  query: string;
  leftHeadings: string[];
  rightHeadings: string[];
  leftRelatedConcepts: RelatedCsLink[];
  rightRelatedConcepts: RelatedCsLink[];
  leftPane: ReactNode;
  rightPane: ReactNode;
  onParamsChange: (next: Record<string, string>) => void;
};

function toAnchorId(side: "left" | "right", heading: string) {
  return `${side}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export function CompareShell({
  languages,
  locale,
  currentLeft,
  currentRight,
  currentType,
  query,
  leftHeadings,
  rightHeadings,
  leftRelatedConcepts,
  rightRelatedConcepts,
  leftPane,
  rightPane,
  onParamsChange
}: CompareShellProps) {
  const copy = t(locale);
  const [localQuery, setLocalQuery] = useState(query);
  const syncingRef = useRef<"left" | "right" | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  function syncScroll(source: "left" | "right") {
    const from = source === "left" ? leftRef.current : rightRef.current;
    const to = source === "left" ? rightRef.current : leftRef.current;

    if (!from || !to || syncingRef.current === source) {
      return;
    }

    const maxScrollTop = from.scrollHeight - from.clientHeight;
    const ratio = maxScrollTop > 0 ? from.scrollTop / maxScrollTop : 0;
    syncingRef.current = source;
    to.scrollTop = ratio * Math.max(to.scrollHeight - to.clientHeight, 0);
    requestAnimationFrame(() => {
      syncingRef.current = null;
    });
  }

  const normalizedQuery = localQuery.toLowerCase();
  const filteredLeftHeadings = leftHeadings.filter((heading) => heading.toLowerCase().includes(normalizedQuery));
  const filteredRightHeadings = rightHeadings.filter((heading) => heading.toLowerCase().includes(normalizedQuery));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-ink/10 bg-mist/90 p-5 shadow-panel backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{copy.contentAsData}</p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">{copy.compareTitle}</h1>
            <p className="max-w-2xl text-sm leading-6 text-moss/80 md:text-base">{copy.compareSubtitle}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-moss/80">
            {copy.languagesDiscovered(languages.length)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_220px_220px_160px]">
          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.leftLanguage}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentLeft}
              onChange={(event) => onParamsChange({ left: event.target.value, locale })}
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {formatDisplayName(language)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.rightLanguage}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentRight}
              onChange={(event) => onParamsChange({ right: event.target.value, locale })}
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {formatDisplayName(language)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.document}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentType}
              onChange={(event) => onParamsChange({ type: event.target.value, locale })}
            >
              <option value="base">{formatDocTypeLabel("base", locale)}</option>
              <option value="intermediate">{formatDocTypeLabel("intermediate", locale)}</option>
              <option value="advanced">{formatDocTypeLabel("advanced", locale)}</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.headingSearch}</span>
            <input
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={localQuery}
              onChange={(event) => setLocalQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onParamsChange({ q: localQuery.trim(), locale });
                }
              }}
              placeholder={copy.headingSearchPlaceholderCompare}
            />
          </label>

          <button
            className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-sand transition hover:bg-moss"
            onClick={() => onParamsChange({ q: localQuery.trim(), locale })}
            type="button"
          >
            {copy.applyFilter}
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <RelatedConceptCard language={currentLeft} docType={currentType} concepts={leftRelatedConcepts} tone="leaf" locale={locale} />
        <RelatedConceptCard language={currentRight} docType={currentType} concepts={rightRelatedConcepts} tone="ember" locale={locale} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{copy.quickLocate}</p>
          <div className="mt-5 space-y-6 text-sm">
            <div>
              <p className="mb-2 font-medium text-ink">{formatDisplayName(currentLeft)}</p>
              <div className="space-y-2">
                {filteredLeftHeadings.map((heading) => (
                  <a key={`left-${heading}`} className="block text-moss/80 transition hover:text-ember" href={`#${toAnchorId("left", heading)}`}>
                    {heading}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink">{formatDisplayName(currentRight)}</p>
              <div className="space-y-2">
                {filteredRightHeadings.map((heading) => (
                  <a key={`right-${heading}`} className="block text-moss/80 transition hover:text-ember" href={`#${toAnchorId("right", heading)}`}>
                    {heading}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="grid gap-4 xl:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-panel">
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{copy.leftPane}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{formatDisplayName(currentLeft)}</h2>
            </div>
            <div ref={leftRef} className="prose prose-stone max-h-[70vh] max-w-none overflow-y-auto px-5 py-6 prose-headings:font-serif prose-p:text-moss prose-li:text-moss prose-strong:text-ink" onScroll={() => syncScroll("left")}>
              {leftPane}
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-panel">
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.rightPane}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{formatDisplayName(currentRight)}</h2>
            </div>
            <div ref={rightRef} className="prose prose-stone max-h-[70vh] max-w-none overflow-y-auto px-5 py-6 prose-headings:font-serif prose-p:text-moss prose-li:text-moss prose-strong:text-ink" onScroll={() => syncScroll("right")}>
              {rightPane}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function RelatedConceptCard({
  language,
  docType,
  concepts,
  tone,
  locale
}: {
  language: string;
  docType: DocType;
  concepts: RelatedCsLink[];
  tone: "leaf" | "ember";
  locale: Locale;
}) {
  const copy = t(locale);
  const toneClass = tone === "leaf" ? "text-leaf" : "text-ember";

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white/85 p-5 shadow-panel">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${toneClass}`}>{copy.relatedCsConcepts}</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">{formatDisplayName(language)}</h2>
        </div>
        <Link className="rounded-full border border-ink/10 px-4 py-2 text-sm text-moss/75 transition hover:border-leaf hover:text-leaf" href={hrefWithLocale("/cs", locale)}>
          {copy.browseAll}
        </Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {concepts.map((concept) => (
          <Link
            key={`${concept.category}-${concept.slug}`}
            className="rounded-[1.25rem] border border-ink/10 bg-mist/60 p-4 transition hover:-translate-y-0.5 hover:border-leaf/35 hover:bg-white"
            href={hrefWithLocale(`/concepts?lang=${language}&type=${docType}&category=${concept.category}&slug=${concept.slug}&q=${encodeURIComponent(concept.focusQuery)}`, locale)}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss/60">{concept.category}</p>
            <h3 className="mt-2 font-serif text-xl text-ink">{concept.title}</h3>
            <p className="mt-2 text-sm leading-6 text-moss/80">{concept.reason}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
