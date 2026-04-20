"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "-");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral"
        });

        const result = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Failed to render Mermaid diagram.");
          setSvg("");
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Mermaid render error: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 rounded-2xl border border-ink/10 bg-mist/70 px-4 py-6 text-center text-sm text-moss/75">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram my-6 overflow-x-auto rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-panel"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
