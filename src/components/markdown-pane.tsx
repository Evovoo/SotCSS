"use client";

import { isValidElement, ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { ConceptChipLink } from "@/components/concept-chip-link";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { linkLanguageDocConcepts } from "@/lib/cs-links";
import { t } from "@/lib/i18n";
import { getDocExcerpt, SiteCsRecord, SiteDocRecord, SiteToolRecord } from "@/lib/site-data";
import { slugify } from "@/lib/text";

type MarkdownPaneProps = {
  doc: SiteDocRecord | SiteCsRecord | SiteToolRecord;
  side: "left" | "right";
  query?: string;
  anchorPrefix?: string;
};

type CodeNodeProps = {
  children?: ReactNode;
  className?: string;
};

export function MarkdownPane({ doc, side, query, anchorPrefix }: MarkdownPaneProps) {
  const rawSource = getDocExcerpt(doc, query);
  const source = "lang" in doc ? linkLanguageDocConcepts(rawSource, doc) : rawSource;
  const resolvedPrefix = anchorPrefix ?? side;
  const copy = t(doc.locale);

  return (
    <div className="space-y-4">
      {doc.isFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{copy.localeFallback}</div>
      ) : null}
      <div className="prose prose-stone max-w-none prose-headings:font-serif prose-p:text-moss prose-li:text-moss prose-strong:text-ink">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            h1: ({ children }) => <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">{children}</h1>,
            h2: ({ children }) => {
              const text = String(children);
              const id = `${resolvedPrefix}-${slugify(text)}`;
              return (
                <h2 id={id} className="scroll-mt-32 border-t border-ink/10 pt-8 font-serif text-2xl font-semibold text-moss">
                  {children}
                </h2>
              );
            },
            pre: ({ children }) => <CodeBlockRenderer>{children}</CodeBlockRenderer>,
            code: ({ children, className }) => (
              <code className={className ? className : "rounded bg-ink/5 px-1.5 py-0.5 text-[0.95em] text-ember"}>{children}</code>
            ),
            a: ({ children, href }) => {
              const isConceptLink = typeof href === "string" && href.startsWith("/concepts?");
              if (isConceptLink) {
                return <ConceptChipLink href={href}>{children}</ConceptChipLink>;
              }

              return (
                <a className="text-ember underline decoration-ember/35 underline-offset-4 transition hover:text-leaf hover:decoration-leaf/45" href={href}>
                  {children}
                </a>
              );
            }
          }}
        >
          {normalizeTabs(source)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function CodeBlockRenderer({ children }: { children: ReactNode }) {
  if (isValidElement<CodeNodeProps>(children)) {
    const className = children.props.className ?? "";
    if (className.includes("language-mermaid")) {
      const chart = extractText(children.props.children).trim();
      return <MermaidDiagram chart={chart} />;
    }
  }

  return <pre className="overflow-x-auto rounded-2xl border border-ink/10 bg-[#171c19] p-4 text-sm text-sand shadow-panel">{children}</pre>;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement(node)) {
    return extractText((node as ReactElement<{ children?: ReactNode }>).props.children);
  }

  return "";
}

function normalizeTabs(source: string) {
  return source.replace(/<Tabs>([\s\S]*?)<\/Tabs>/g, (_, inner: string) => {
    const tabs = Array.from(inner.matchAll(/<Tab label="([^"]+)">([\s\S]*?)<\/Tab>/g));
    if (!tabs.length) {
      return inner;
    }

    return tabs
      .map(([, label, content]) => `### ${label}\n\n${String(content).trim()}`)
      .join("\n\n");
  });
}
