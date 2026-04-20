"use client";

import { ReactNode, useEffect, useState } from "react";
import { Locale, t } from "@/lib/i18n";
import { slugify } from "@/lib/text";

type TopicSummary = {
  slug: string;
  title: string;
};

type SectionOption = {
  value: string;
  label: string;
};

type CategoryOption = {
  value: string;
  label: string;
};

type CsShellProps = {
  locale: Locale;
  sections: SectionOption[];
  currentSection: string;
  currentSectionLabel: string;
  categories: CategoryOption[];
  currentCategory: string;
  topics: TopicSummary[];
  currentSlug: string;
  query: string;
  headings: string[];
  paneTitle: string;
  pane: ReactNode;
  onParamsChange: (next: Record<string, string>) => void;
};

export function CsShell({
  locale,
  sections,
  currentSection,
  currentSectionLabel,
  categories,
  currentCategory,
  topics,
  currentSlug,
  query,
  headings,
  paneTitle,
  pane,
  onParamsChange
}: CsShellProps) {
  const copy = t(locale);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const filteredHeadings = headings.filter((heading) => heading.toLowerCase().includes(localQuery.toLowerCase()));
  const currentTopic = topics.find((topic) => topic.slug === currentSlug);
  const currentCategoryLabel = categories.find((category) => category.value === currentCategory)?.label ?? currentCategory;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-ink/10 bg-mist/90 p-5 shadow-panel backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{currentSectionLabel}</p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">{copy.csTitle}</h1>
            <p className="max-w-2xl text-sm leading-6 text-moss/80 md:text-base">{copy.csSubtitle}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-moss/80">
            {copy.topicsInCategory(topics.length, currentCategoryLabel || currentSectionLabel)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[220px_220px_1fr_220px_160px]">
          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.knowledgeSource}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentSection}
              onChange={(event) => onParamsChange({ section: event.target.value, category: "", slug: "", locale })}
            >
              {sections.map((section) => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.knowledgeCollection}</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-leaf"
              value={currentCategory}
              onChange={(event) => onParamsChange({ category: event.target.value, slug: "", locale })}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-moss">
            <span className="block font-medium">{copy.knowledgeDocument}</span>
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
              placeholder={copy.headingSearchPlaceholderCs}
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

      <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.topicIndex}</p>
          <div className="mt-5 space-y-6 text-sm">
            <div>
              <p className="mb-2 font-medium text-ink">{currentCategoryLabel}</p>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const isActive = topic.slug === currentSlug;
                  return (
                    <button
                      key={topic.slug}
                      className={`block w-full rounded-xl px-3 py-2 text-left transition ${isActive ? "bg-ember/10 text-ember" : "text-moss/80 hover:bg-ink/5 hover:text-ink"}`}
                      onClick={() => onParamsChange({ slug: topic.slug, locale })}
                      type="button"
                    >
                      {topic.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink">{copy.quickLocate}</p>
              <div className="space-y-2">
                {filteredHeadings.map((heading) => (
                  <a key={heading} className="block text-moss/80 transition hover:text-ember" href={`#cs-${slugify(heading)}`}>
                    {heading}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <article className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-panel">
          <div className="border-b border-ink/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.csPane}</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">{paneTitle || currentTopic?.title || currentSlug}</h2>
          </div>
          <div className="prose prose-stone max-w-none px-5 py-6 prose-headings:font-serif prose-p:text-moss prose-li:text-moss prose-strong:text-ink">
            {pane}
          </div>
        </article>
      </section>
    </div>
  );
}
