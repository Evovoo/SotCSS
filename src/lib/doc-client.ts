"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/lib/i18n";
import { CsCategory, DocType, SiteCsRecord, SiteDocRecord, SiteToolRecord } from "@/lib/site-data";

type LanguageDocParams = {
  kind: "language";
  locale: Locale;
  lang: string;
  type: DocType;
};

type CsDocParams = {
  kind: "cs";
  locale: Locale;
  category: CsCategory;
  slug: string;
};

type ToolDocParams = {
  kind: "tool";
  locale: Locale;
  tool: string;
  slug: string;
};

export type DocRequestParams = LanguageDocParams | CsDocParams | ToolDocParams;
export type LoadedDoc = SiteDocRecord | SiteCsRecord | SiteToolRecord;

type DocResourceState = {
  doc: LoadedDoc | null;
  loading: boolean;
  error: string;
};

function buildDocUrl(params: DocRequestParams) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (params.kind === "language") {
    return `${basePath}/docs-data/language/${params.locale}/${params.lang}/${params.type}.json`;
  }

  if (params.kind === "cs") {
    return `${basePath}/docs-data/cs/${params.locale}/${params.category}/${params.slug}.json`;
  }

  return `${basePath}/docs-data/tool/${params.locale}/${params.tool}/${params.slug}.json`;
}

export function useDocResource(params: DocRequestParams | null): DocResourceState {
  const requestKey = params ? buildDocUrl(params) : "";
  const [state, setState] = useState<DocResourceState>({
    doc: null,
    loading: Boolean(params),
    error: ""
  });

  useEffect(() => {
    if (!params) {
      setState({ doc: null, loading: false, error: "" });
      return;
    }

    const controller = new AbortController();
    setState({
      doc: null,
      loading: true,
      error: ""
    });

    fetch(requestKey, {
      signal: controller.signal,
      cache: "force-cache"
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load document.");
        }

        return (await response.json()) as LoadedDoc;
      })
      .then((doc) => {
        setState({
          doc,
          loading: false,
          error: ""
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          doc: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load document."
        });
      });

    return () => {
      controller.abort();
    };
  }, [requestKey]);

  return state;
}

export function useLanguageDocResource(params: LanguageDocParams | null) {
  const state = useDocResource(params);
  return {
    ...state,
    doc: state.doc as SiteDocRecord | null
  };
}

export function useCsDocResource(params: CsDocParams | null) {
  const state = useDocResource(params);
  return {
    ...state,
    doc: state.doc as SiteCsRecord | null
  };
}

export function useToolDocResource(params: ToolDocParams | null) {
  const state = useDocResource(params);
  return {
    ...state,
    doc: state.doc as SiteToolRecord | null
  };
}
