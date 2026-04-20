"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatCategoryLabel, formatDocTypeLabel, hrefWithLocale, Locale, t } from "@/lib/i18n";
import type { CsCategory, DocType, TopicSummary } from "@/lib/site-data";
import { slugify } from "@/lib/text";
import { formatDisplayName } from "@/lib/text";

type ConceptBridgeShellProps = {
  locale: Locale;
  languages: string[];
  currentLanguage: string;
  currentType: DocType;
  categories: CsCategory[];
  currentCategory: CsCategory;
  topics: TopicSummary[];
  currentSlug: string;
  query: string;
  leftHeadings: string[];
  rightHeadings: string[];
  leftPane: ReactNode;
  rightPane: ReactNode;
  rightTitle: string;
  onParamsChange: (next: Record<string, string>) => void;
};

export function ConceptBridgeShell({
  locale,
  languages,
  currentLanguage,
  currentType,
  categories,
  currentCategory,
  topics,
  currentSlug,
  query,
  leftHeadings,
  rightHeadings,
  leftPane,
  rightPane,
  rightTitle,
  onParamsChange
}: ConceptBridgeShellProps) {
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">Language x CS</p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">{copy.bridgeTitle}</h1>
            <p className="max-w-2xl text-sm leading-6 text-moss/80 md:text-base">{copy.bridgeSubtitle}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-moss/80">
            {copy.bridgeAvailable(languages.length, topics.length)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_220px_1fr_160px]">
          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.language}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentLanguage}
              onChange={(event) => onParamsChange({ lang: event.target.value, locale })}
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
            <span className="block font-medium">{copy.csCategory}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentCategory}
              onChange={(event) => onParamsChange({ category: event.target.value, slug: "", locale })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategoryLabel(category, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.csTopic}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentSlug}
              onChange={(event) => onParamsChange({ slug: event.target.value, locale })}
            >
              {topics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.title}
                </option>
              ))}
            </select>
          </label>

          <button
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-leaf hover:text-leaf"
            onClick={() => onParamsChange({ q: localQuery.trim(), locale })}
            type="button"
          >
            {copy.syncFilter}
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_160px]">
          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.sharedFocusQuery}</span>
            <input
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={localQuery}
              onChange={(event) => setLocalQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onParamsChange({ q: localQuery.trim(), locale });
                }
              }}
              placeholder={copy.sharedSearchPlaceholder}
            />
          </label>
          <div className="flex items-end gap-3">
            <Link className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-sand transition hover:bg-moss" href={hrefWithLocale("/compare", locale)}>
              {copy.backToCompare}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.quickLocate}</p>
          <div className="mt-5 space-y-6 text-sm">
            <div>
              <p className="mb-2 font-medium text-ink">{formatDisplayName(currentLanguage)}</p>
              <div className="space-y-2">
                {filteredLeftHeadings.map((heading) => (
                  <a key={`left-${heading}`} className="block text-moss/80 transition hover:text-ember" href={`#left-${slugify(heading)}`}>
                    {heading}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink">{rightTitle}</p>
              <div className="space-y-2">
                {filteredRightHeadings.map((heading) => (
                  <a key={`right-${heading}`} className="block text-moss/80 transition hover:text-ember" href={`#cs-${slugify(heading)}`}>
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{copy.languagePane}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{formatDisplayName(currentLanguage)}</h2>
            </div>
            <div ref={leftRef} className="prose prose-stone max-h-[70vh] max-w-none overflow-y-auto px-5 py-6 prose-headings:font-serif prose-p:text-moss prose-li:text-moss prose-strong:text-ink" onScroll={() => syncScroll("left")}>
              {leftPane}
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-panel">
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.csPane}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{rightTitle}</h2>
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
