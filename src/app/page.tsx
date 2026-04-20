"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSiteData } from "@/components/content-data-provider";
import { formatDisplayName } from "@/lib/text";
import { formatKnowledgeSectionLabel, hrefWithLocale, resolveLocale, t } from "@/lib/i18n";

function pickDefaultPair(languages: string[]) {
  const preferred = ["javascript", "python"];
  const first = preferred.find((lang) => languages.includes(lang)) ?? languages[0] ?? "java";
  const second =
    preferred.find((lang) => languages.includes(lang) && lang !== first) ??
    languages.find((lang) => lang !== first) ??
    languages[0] ??
    "python";

  return { first, second };
}

function pickDefaultTool(tools: string[]) {
  const preferred = ["redis", "kafka", "rabbitmq", "es"];
  return preferred.find((tool) => tools.includes(tool)) ?? tools[0] ?? "";
}

const DOC_TYPE_COPY = {
  base: {
    label: "Base",
    labelZh: "基础",
    description: "Syntax, variables, control flow, functions, and module fundamentals.",
    descriptionZh: "语法、变量、控制流、函数与模块基础。",
    accent: "text-leaf",
    badge: "Start Here",
    badgeZh: "从这里开始",
    panel: "bg-[linear-gradient(180deg,_rgba(239,230,212,0.98)_0%,_rgba(226,241,231,0.92)_100%)]",
    arrow: "text-leaf/45"
  },
  intermediate: {
    label: "Intermediate",
    labelZh: "进阶",
    description: "Concurrency, web engineering, persistence, testing, and deployment.",
    descriptionZh: "并发、Web 工程、持久化、测试与部署。",
    accent: "text-ember",
    badge: "Build Systems",
    badgeZh: "构建系统",
    panel: "bg-[linear-gradient(180deg,_rgba(255,244,237,0.98)_0%,_rgba(248,226,214,0.92)_100%)]",
    arrow: "text-ember/45"
  },
  advanced: {
    label: "Advanced",
    labelZh: "高级",
    description: "Runtime internals, deeper type systems, performance, and security tradeoffs.",
    descriptionZh: "运行时内部、更深的类型系统、性能与安全取舍。",
    accent: "text-moss",
    badge: "Deep Dive",
    badgeZh: "深入学习",
    panel: "bg-[linear-gradient(180deg,_rgba(240,246,239,0.98)_0%,_rgba(221,234,225,0.92)_100%)]",
    arrow: "text-moss/45"
  }
} as const;

export default function HomePage() {
  const siteData = useSiteData();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);
  const csTopicCount = siteData.csDocs.filter((doc) => doc.locale === locale).length;
  const toolDocCount = siteData.toolDocs.filter((doc) => doc.locale === locale).length;
  const { first: defaultLeft, second: defaultRight } = pickDefaultPair(siteData.languages);
  const defaultTool = pickDefaultTool(siteData.tools);
  const defaultToolSummary = defaultTool ? siteData.toolDocs.find((doc) => doc.tool === defaultTool && doc.locale === locale) : undefined;
  const defaultToolDoc = defaultToolSummary?.slug ?? "";
  const toolsHref =
    defaultTool && defaultToolDoc
      ? hrefWithLocale(`/cs?section=tools&category=${defaultTool}&slug=${defaultToolDoc}`, locale)
      : hrefWithLocale("/cs?section=tools", locale);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,114,66,0.18),_transparent_30%),linear-gradient(180deg,_#f6f2e8_0%,_#efe6d4_100%)] px-6 py-8 text-ink md:px-10 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-ink/10 bg-white/75 p-8 shadow-panel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{copy.studySystem}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">{copy.compareHero}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-moss/85">{copy.compareLead}</p>
          <div className="mt-8">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-moss/65">
              <span>{copy.learningPath}</span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {siteData.docTypes.map((docType, index) => {
                const item = DOC_TYPE_COPY[docType];
                const href = hrefWithLocale(`/compare?left=${defaultLeft}&right=${defaultRight}&type=${docType}`, locale);
                return (
                  <div key={docType} className="relative min-w-0">
                    <Link
                      className={`group block h-full rounded-[1.75rem] border border-ink/10 ${item.panel} p-5 shadow-[0_12px_40px_rgba(17,34,24,0.08)] transition hover:-translate-y-1 hover:border-leaf/35 hover:shadow-panel`}
                      href={href}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white/70 text-base font-semibold text-ink">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${item.accent}`}>
                              {locale === "zh" ? item.badgeZh : item.badge}
                            </p>
                            <h2 className="mt-2 font-serif text-[2rem] leading-none text-ink md:text-[2.15rem]">
                              {locale === "zh" ? item.labelZh : item.label}
                            </h2>
                          </div>
                        </div>
                        <span className="rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-moss/70 transition group-hover:border-leaf/30 group-hover:text-leaf">
                          {copy.open}
                        </span>
                      </div>
                      <p className="mt-5 max-w-[34ch] text-sm leading-6 text-moss/80">
                        {locale === "zh" ? item.descriptionZh : item.description}
                      </p>
                    </Link>
                    {index < siteData.docTypes.length - 1 ? (
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none hidden absolute -right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-2xl 2xl:flex ${item.arrow}`}
                      >
                        &#8594;
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-sand transition hover:bg-moss" href={hrefWithLocale("/cs", locale)}>
              {copy.openKnowledgeWorkspace}
            </Link>
            <Link className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:border-ember hover:text-ember" href={toolsHref}>
              {copy.openToolsWorkspace}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-[1.75rem] border border-ink/10 bg-[linear-gradient(135deg,_rgba(255,248,241,0.95)_0%,_rgba(244,229,219,0.92)_100%)] p-5 shadow-[0_12px_36px_rgba(17,34,24,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{copy.toolsSpotlight}</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl leading-none text-ink">{formatKnowledgeSectionLabel("tools", locale)}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-moss/80">{copy.toolsSpotlightBody}</p>
                </div>
                <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-moss/70">
                  {copy.open}
                </span>
              </div>
            </div>
            <Link
              className="group rounded-[1.75rem] border border-ink/10 bg-white/85 p-5 shadow-[0_12px_36px_rgba(17,34,24,0.06)] transition hover:-translate-y-1 hover:border-ember/35 hover:bg-white"
              href={toolsHref}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-moss/55">{copy.toolsDetected(siteData.tools.length, toolDocCount)}</p>
              <h3 className="mt-3 font-serif text-3xl text-ink">{defaultTool ? formatDisplayName(defaultTool) : formatKnowledgeSectionLabel("tools", locale)}</h3>
              <p className="mt-2 text-sm leading-6 text-moss/80">
                {defaultTool && defaultToolSummary ? `${formatDisplayName(defaultTool)} / ${defaultToolSummary.title}` : copy.openToolsWorkspace}
              </p>
              <p className="mt-4 text-sm font-medium text-ember transition group-hover:text-leaf">{copy.openToolsWorkspace}</p>
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-sand shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand/70">{copy.autoDiscovery}</p>
          <div className="subtle-scrollbar mt-6 max-h-[38rem] space-y-4 overflow-y-auto pr-2">
            {siteData.languages.map((language) => (
              <div key={language} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="font-serif text-2xl">{formatDisplayName(language)}</p>
                <p className="mt-1 text-sm text-sand/70">{copy.alignedDocsDetected(siteData.docTypes.length)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="font-serif text-2xl">{copy.knowledgeBase}</p>
            <p className="mt-1 text-sm text-sand/70">
              {copy.knowledgeCoverage(siteData.csCategories.length, csTopicCount, siteData.tools.length, toolDocCount)}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
