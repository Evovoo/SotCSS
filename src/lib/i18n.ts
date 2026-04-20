export type Locale = "en" | "zh";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "zh";
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : "zh";
}

export function hrefWithLocale(href: string, locale: Locale) {
  if (!href.startsWith("/")) {
    return href;
  }

  const [pathWithQuery, hash = ""] = href.split("#");
  const [pathname, query = ""] = pathWithQuery.split("?");
  const params = new URLSearchParams(query);
  params.set("locale", locale);
  const nextQuery = params.toString();
  const nextHash = hash ? `#${hash}` : "";

  return nextQuery ? `${pathname}?${nextQuery}${nextHash}` : `${pathname}${nextHash}`;
}

export function formatCategoryLabel(category: string, locale: Locale) {
  const labels: Record<string, { en: string; zh: string }> = {
    "data-structures": { en: "Data Structures", zh: "\u6570\u636e\u7ed3\u6784" },
    algorithms: { en: "Algorithms", zh: "\u7b97\u6cd5" },
    "operating-systems": { en: "Operating Systems", zh: "\u64cd\u4f5c\u7cfb\u7edf" },
    networks: { en: "Networks", zh: "\u8ba1\u7b97\u673a\u7f51\u7edc" }
  };

  const fallback = category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return labels[category]?.[locale] ?? fallback;
}

export function formatDocTypeLabel(type: string, locale: Locale) {
  const labels: Record<string, { en: string; zh: string }> = {
    base: { en: "Base", zh: "\u57fa\u7840" },
    intermediate: { en: "Intermediate", zh: "\u8fdb\u9636" },
    advanced: { en: "Advanced", zh: "\u9ad8\u7ea7" }
  };

  return labels[type]?.[locale] ?? type;
}

export function formatKnowledgeSectionLabel(section: string, locale: Locale) {
  const labels: Record<string, { en: string; zh: string }> = {
    cs: { en: "Computer Science", zh: "\u8ba1\u7b97\u673a\u79d1\u5b66" },
    tools: { en: "Tools", zh: "\u5de5\u5177" }
  };

  return labels[section]?.[locale] ?? section;
}

export function t(locale: Locale) {
  return locale === "zh"
    ? {
        languageName: "\u4e2d\u6587",
        switchTo: "\u5207\u6362\u8bed\u8a00",
        home: "\u9996\u9875",
        languageCompare: "\u8bed\u8a00\u5bf9\u6bd4",
        contentAsData: "\u6587\u6863\u5373\u6570\u636e",
        learningPath: "\u5b66\u4e60\u8def\u5f84",
        open: "\u6253\u5f00",
        openKnowledgeWorkspace: "\u6253\u5f00\u77e5\u8bc6\u5de5\u4f5c\u533a",
        openToolsWorkspace: "\u6253\u5f00 Tools \u5de5\u4f5c\u533a",
        viewDocsApi: "\u67e5\u770b Docs API",
        autoDiscovery: "\u81ea\u52a8\u53d1\u73b0",
        alignedDocsDetected: (count: number) => `\u5df2\u68c0\u6d4b ${count} \u4efd\u5bf9\u9f50\u6587\u6863`,
        knowledgeBase: "\u77e5\u8bc6\u5e93",
        knowledgeCoverage: (categories: number, topics: number, tools: number, toolDocs: number) =>
          `CS ${categories} \u4e2a\u5206\u7c7b / ${topics} \u4e2a\u4e3b\u9898\uff0cTools ${tools} \u4e2a\u5de5\u5177 / ${toolDocs} \u4efd\u6587\u6863`,
        updatingView: "\u6b63\u5728\u66f4\u65b0\u89c6\u56fe...",
        languagesDiscovered: (count: number) => `\u5df2\u53d1\u73b0 ${count} \u95e8\u8bed\u8a00`,
        topicsInCategory: (count: number, category: string) => `${category} \u4e0b\u5171 ${count} \u4e2a\u6587\u6863`,
        bridgeAvailable: (languages: number, topics: number) => `${languages} \u95e8\u8bed\u8a00 / ${topics} \u4e2a\u4e3b\u9898\u53ef\u7528`,
        leftLanguage: "\u5de6\u4fa7\u8bed\u8a00",
        rightLanguage: "\u53f3\u4fa7\u8bed\u8a00",
        language: "\u8bed\u8a00",
        document: "\u6587\u6863",
        headingSearch: "\u6807\u9898\u7b5b\u9009",
        applyFilter: "\u5e94\u7528\u7b5b\u9009",
        quickLocate: "\u5feb\u901f\u5b9a\u4f4d",
        leftPane: "\u5de6\u4fa7\u9762\u677f",
        rightPane: "\u53f3\u4fa7\u9762\u677f",
        languagePane: "\u8bed\u8a00\u9762\u677f",
        csPane: "\u77e5\u8bc6\u9762\u677f",
        relatedCsConcepts: "\u76f8\u5173 CS \u6982\u5ff5",
        browseAll: "\u67e5\u770b\u5168\u90e8",
        category: "\u5206\u7c7b",
        topic: "\u4e3b\u9898",
        topicIndex: "\u6587\u6863\u7d22\u5f15",
        sharedFocusQuery: "\u5171\u4eab\u5173\u6ce8\u8bcd",
        syncFilter: "\u540c\u6b65\u7b5b\u9009",
        backToCompare: "\u8fd4\u56de\u5bf9\u6bd4",
        csCategory: "CS \u5206\u7c7b",
        csTopic: "CS \u4e3b\u9898",
        knowledgeSource: "\u5185\u5bb9\u6765\u6e90",
        knowledgeCollection: "\u96c6\u5408",
        knowledgeDocument: "\u6587\u6863",
        toolsSpotlight: "Tools \u5165\u53e3",
        toolsSpotlightBody: "\u76f4\u63a5\u6d4f\u89c8 `tools/` \u76ee\u5f55\u4e0b\u7684\u5b9e\u7528\u578b\u6587\u6863\uff0c\u5305\u62ec What / Why / How / Better / Beyond \u7684\u7edf\u4e00\u7ed3\u6784\u3002",
        toolsDetected: (tools: number, docs: number) => `${tools} \u4e2a\u5de5\u5177 / ${docs} \u4efd\u6587\u6863`,
        compareTitle: "\u8bed\u8a00\u5bf9\u6bd4\u5de5\u4f5c\u533a",
        compareSubtitle: "\u4ece `langs` \u76ee\u5f55\u8bfb\u53d6\u6587\u6863\u5e76\u5e76\u6392\u6e32\u67d3\uff0c\u8ba9\u8bed\u6cd5\u4e0e\u5de5\u7a0b\u5b9e\u8df5\u4fdd\u6301\u5bf9\u9f50\u3002",
        csTitle: "\u77e5\u8bc6\u5de5\u4f5c\u533a",
        csSubtitle: "\u7edf\u4e00\u6d4f\u89c8 `cs` \u4e0e `tools` \u76ee\u5f55\u4e0b\u7684\u7ed3\u6784\u5316\u6587\u6863\uff0c\u652f\u6301 Mermaid\u3001\u6807\u7b7e\u9875\u4ee3\u7801\u793a\u4f8b\u548c\u6570\u5b66\u516c\u5f0f\u6e32\u67d3\u3002",
        bridgeTitle: "\u6982\u5ff5\u6865\u63a5\u5de5\u4f5c\u533a",
        bridgeSubtitle: "\u628a\u8bed\u8a00\u6982\u5ff5\u4e0e\u5bf9\u5e94\u7684\u8ba1\u7b97\u673a\u79d1\u5b66\u6982\u5ff5\u5e76\u6392\u9605\u8bfb\uff0c\u652f\u6301\u5171\u4eab\u7b5b\u9009\u4e0e\u76f4\u63a5\u8df3\u8f6c\u3002",
        noLanguageDocsTitle: "\u672a\u627e\u5230\u8bed\u8a00\u6587\u6863",
        noLanguageDocsBody: "\u8bf7\u5728 `langs/<language>/` \u4e0b\u8865\u9f50 `base.md`\u3001`intermediate.md`\u3001`advanced.md`\u3002",
        noCsDocsTitle: "\u672a\u627e\u5230\u77e5\u8bc6\u6587\u6863",
        noCsDocsBody: "\u8bf7\u5728 `cs/` \u6216 `tools/` \u76ee\u5f55\u4e0b\u6dfb\u52a0\u7b26\u5408\u89c4\u8303\u7684 Markdown \u6587\u6863\u3002",
        noBridgeTitle: "\u672a\u627e\u5230\u6865\u63a5\u5185\u5bb9",
        noBridgeBody: "\u8bf7\u786e\u8ba4 `langs` \u548c `cs` \u76ee\u5f55\u90fd\u5df2\u6709\u5185\u5bb9\uff0c\u518d\u6253\u5f00\u6982\u5ff5\u6865\u63a5\u5de5\u4f5c\u533a\u3002",
        csPreview: "CS \u9884\u89c8",
        close: "\u5173\u95ed",
        loading: "\u52a0\u8f7d\u4e2d...",
        loadingPreview: "\u6b63\u5728\u52a0\u8f7d\u9884\u89c8...",
        preview: "\u9884\u89c8",
        sectionIndex: "\u7ae0\u8282\u7d22\u5f15",
        openFullBridge: "\u6253\u5f00\u5b8c\u6574\u6865\u63a5\u9875",
        invalidConceptLink: "\u6982\u5ff5\u94fe\u63a5\u65e0\u6548\u3002",
        failedConceptPreview: "\u52a0\u8f7d\u6982\u5ff5\u9884\u89c8\u5931\u8d25\u3002",
        compareHero: "\u628a\u8bed\u8a00\u7b14\u8bb0\u53d8\u6210\u53ef\u6d4f\u89c8\u3001\u53ef\u5bf9\u7167\u7684\u5b66\u4e60\u754c\u9762\u3002",
        compareLead: "\u524d\u7aef\u4f1a\u540c\u65f6\u626b\u63cf `langs`\u3001`cs`\u3001`tools`\uff0c\u63d0\u4f9b\u5e76\u6392\u8bed\u8a00\u5de5\u4f5c\u533a\uff0c\u4ee5\u53ca\u7edf\u4e00\u7684\u77e5\u8bc6\u5e93\u6d4f\u89c8\u754c\u9762\u3002",
        studySystem: "\u8ba1\u7b97\u673a\u79d1\u5b66\u4f53\u7cfb\u5316\u5b66\u4e60",
        localeFallback: "\u5f53\u524d\u6587\u6863\u6682\u65e0\u4e2d\u6587\u7248\u672c\uff0c\u5df2\u56de\u9000\u4e3a\u82f1\u6587\u539f\u6587\u3002",
        headingSearchPlaceholderCompare: "\u5e76\u53d1 / \u9519\u8bef / \u6a21\u5757...",
        headingSearchPlaceholderCs: "\u590d\u6742\u5ea6 / \u534f\u8bae / \u5b89\u88c5...",
        sharedSearchPlaceholder: "list / map / concurrency / http..."
      }
    : {
        languageName: "English",
        switchTo: "Switch language",
        home: "Home",
        languageCompare: "Language Compare",
        contentAsData: "Content as Data",
        learningPath: "Learning Path",
        open: "Open",
        openKnowledgeWorkspace: "Open knowledge workspace",
        openToolsWorkspace: "Open tools workspace",
        viewDocsApi: "View docs API",
        autoDiscovery: "Auto discovery",
        alignedDocsDetected: (count: number) => `${count} aligned docs detected`,
        knowledgeBase: "Knowledge Base",
        knowledgeCoverage: (categories: number, topics: number, tools: number, toolDocs: number) =>
          `${categories} CS categories / ${topics} CS topics / ${tools} tools / ${toolDocs} tool docs`,
        updatingView: "Updating view...",
        languagesDiscovered: (count: number) => `${count} languages discovered`,
        topicsInCategory: (count: number, category: string) => `${count} docs in ${category}`,
        bridgeAvailable: (languages: number, topics: number) => `${languages} languages / ${topics} topics available`,
        leftLanguage: "Left language",
        rightLanguage: "Right language",
        language: "Language",
        document: "Document",
        headingSearch: "Heading search",
        applyFilter: "Apply filter",
        quickLocate: "Quick locate",
        leftPane: "Left pane",
        rightPane: "Right pane",
        languagePane: "Language pane",
        csPane: "Knowledge pane",
        relatedCsConcepts: "Related CS Concepts",
        browseAll: "Browse all",
        category: "Category",
        topic: "Topic",
        topicIndex: "Document Index",
        sharedFocusQuery: "Shared focus query",
        syncFilter: "Sync Filter",
        backToCompare: "Back to compare",
        csCategory: "CS Category",
        csTopic: "CS Topic",
        knowledgeSource: "Source",
        knowledgeCollection: "Collection",
        knowledgeDocument: "Document",
        toolsSpotlight: "Tools entry",
        toolsSpotlightBody: "Jump straight into the practical docs under `tools/`, with the current shared What / Why / How / Better / Beyond structure.",
        toolsDetected: (tools: number, docs: number) => `${tools} tools / ${docs} docs`,
        compareTitle: "Language contrast workspace",
        compareSubtitle: "Documents from the `langs` directory are rendered side by side so syntax and engineering patterns stay aligned.",
        csTitle: "Knowledge workspace",
        csSubtitle: "Browse structured notes from both `cs` and `tools`, with Mermaid, tabbed code examples, and math rendering enabled.",
        bridgeTitle: "Concept bridge workspace",
        bridgeSubtitle: "Read a language concept and its underlying computer science concept side by side, with shared filtering and direct navigation.",
        noLanguageDocsTitle: "No language documents found",
        noLanguageDocsBody: "Add all required docs under `langs/<language>/`: `base.md`, `intermediate.md`, `advanced.md`.",
        noCsDocsTitle: "No knowledge documents found",
        noCsDocsBody: "Add Markdown files under `cs/` or `tools/` that follow the current content conventions.",
        noBridgeTitle: "No bridge content found",
        noBridgeBody: "Make sure both `langs` and `cs` content exist before opening the concept bridge workspace.",
        csPreview: "CS Preview",
        close: "Close",
        loading: "Loading...",
        loadingPreview: "Loading preview...",
        preview: "Preview",
        sectionIndex: "Section Index",
        openFullBridge: "Open full bridge",
        invalidConceptLink: "Invalid concept link.",
        failedConceptPreview: "Failed concept preview.",
        compareHero: "Turn language notes into a browsable comparison surface.",
        compareLead: "The frontend now scans `langs`, `cs`, and `tools`, exposing a side by side language workspace plus a unified knowledge browser.",
        studySystem: "Study of the Computer Science System",
        localeFallback: "This document has no localized version yet, so the English source is shown.",
        headingSearchPlaceholderCompare: "Concurrency / Error / Module...",
        headingSearchPlaceholderCs: "Complexity / Protocol / Install...",
        sharedSearchPlaceholder: "list / map / concurrency / http..."
      };
}
