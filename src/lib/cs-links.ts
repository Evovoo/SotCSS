import { Locale } from "@/lib/i18n";
import type { CsCategory, DocType, SiteDocRecord } from "@/lib/site-data";

export type RelatedCsLink = {
  category: CsCategory;
  slug: string;
  title: string;
  reason: string;
  focusQuery: string;
};

type TopicMeta = {
  category: CsCategory;
  slug: string;
  title: Record<Locale, string>;
  focusQuery: string;
};

const TOPIC_META: Record<string, TopicMeta> = {
  dynamicArray: {
    category: "data-structures",
    slug: "dynamic-array",
    title: { en: "Dynamic Array", zh: "\u52a8\u6001\u6570\u7ec4" },
    focusQuery: "list"
  },
  hashTable: {
    category: "data-structures",
    slug: "hash-table",
    title: { en: "Hash Table", zh: "\u54c8\u5e0c\u8868" },
    focusQuery: "map"
  },
  linkedList: {
    category: "data-structures",
    slug: "linked-list",
    title: { en: "Linked List", zh: "\u94fe\u8868" },
    focusQuery: "linked list"
  },
  tree: {
    category: "data-structures",
    slug: "tree",
    title: { en: "Tree", zh: "\u6811" },
    focusQuery: "tree"
  },
  sorting: {
    category: "algorithms",
    slug: "sorting",
    title: { en: "Sorting", zh: "\u6392\u5e8f" },
    focusQuery: "sort"
  },
  dynamicProgramming: {
    category: "algorithms",
    slug: "dynamic-programming",
    title: { en: "Dynamic Programming", zh: "\u52a8\u6001\u89c4\u5212" },
    focusQuery: "dynamic programming"
  },
  process: {
    category: "operating-systems",
    slug: "process",
    title: { en: "Process", zh: "\u8fdb\u7a0b\u4e0e\u8c03\u5ea6" },
    focusQuery: "concurrency"
  },
  memory: {
    category: "operating-systems",
    slug: "memory",
    title: { en: "Memory", zh: "\u5185\u5b58" },
    focusQuery: "memory"
  },
  fileSystem: {
    category: "operating-systems",
    slug: "file-system",
    title: { en: "File System", zh: "\u6587\u4ef6\u7cfb\u7edf" },
    focusQuery: "storage"
  },
  tcpIp: {
    category: "networks",
    slug: "tcp-ip",
    title: { en: "TCP/IP", zh: "TCP/IP" },
    focusQuery: "http"
  },
  http: {
    category: "networks",
    slug: "http",
    title: { en: "HTTP", zh: "HTTP" },
    focusQuery: "http"
  },
  dns: {
    category: "networks",
    slug: "dns",
    title: { en: "DNS", zh: "DNS" },
    focusQuery: "dns"
  }
};

type LinkRule = {
  pattern: RegExp;
  topic: keyof typeof TOPIC_META;
  label?: string;
};

function makeLink(topic: keyof typeof TOPIC_META, reason: string, locale: Locale): RelatedCsLink {
  const meta = TOPIC_META[topic];
  return {
    category: meta.category,
    slug: meta.slug,
    title: meta.title[locale],
    reason,
    focusQuery: meta.focusQuery
  };
}

function buildConceptHref(doc: SiteDocRecord, topic: keyof typeof TOPIC_META) {
  const meta = TOPIC_META[topic];
  return `/concepts?lang=${doc.lang}&type=${doc.type}&category=${meta.category}&slug=${meta.slug}&q=${encodeURIComponent(meta.focusQuery)}&locale=${doc.locale}`;
}

function replaceWithConceptLink(line: string, doc: SiteDocRecord, rule: LinkRule) {
  const href = buildConceptHref(doc, rule.topic);
  return line.replace(rule.pattern, (matched) => {
    const label = rule.label ?? matched;
    return `[${label}](${href})`;
  });
}

function getInlineRules(doc: SiteDocRecord): LinkRule[] {
  const sharedBaseRules: LinkRule[] = [
    { pattern: /`list`/g, topic: "dynamicArray" },
    { pattern: /\blist\b/g, topic: "dynamicArray" },
    { pattern: /`ArrayList`/g, topic: "dynamicArray" },
    { pattern: /\bArrayList\b/g, topic: "dynamicArray" },
    { pattern: /dynamic arrays?/gi, topic: "dynamicArray", label: "dynamic array" },
    { pattern: /`Vec<T>`/g, topic: "dynamicArray" },
    { pattern: /\bVec\b/g, topic: "dynamicArray" },
    { pattern: /`dict`/g, topic: "hashTable" },
    { pattern: /\bdict\b/g, topic: "hashTable" },
    { pattern: /`HashMap`/g, topic: "hashTable" },
    { pattern: /\bHashMap\b/g, topic: "hashTable" },
    { pattern: /`Map`/g, topic: "hashTable" },
    { pattern: /\bMap\b/g, topic: "hashTable" },
    { pattern: /hash tables?/gi, topic: "hashTable", label: "hash table" },
    { pattern: /`set`/g, topic: "hashTable" },
    { pattern: /\bSet\b/g, topic: "hashTable" },
    { pattern: /`LinkedList`/g, topic: "linkedList" },
    { pattern: /\bLinkedList\b/g, topic: "linkedList" },
    { pattern: /linked lists?/gi, topic: "linkedList", label: "linked list" },
    { pattern: /\btree\b/gi, topic: "tree", label: "tree" }
  ];

  const intermediateRules: LinkRule[] = [
    { pattern: /`async`\/`await`/g, topic: "process" },
    { pattern: /async\/await/gi, topic: "process", label: "async/await" },
    { pattern: /event loop/gi, topic: "process", label: "event loop" },
    { pattern: /\bthreads?\b/gi, topic: "process", label: "thread" },
    { pattern: /\bgoroutines?\b/gi, topic: "process", label: "goroutine" },
    { pattern: /\bHTTP\b/g, topic: "http" },
    { pattern: /\bTCP\/IP\b/g, topic: "tcpIp" },
    { pattern: /\bDNS\b/g, topic: "dns" },
    { pattern: /\bstorage\b/gi, topic: "fileSystem", label: "storage" }
  ];

  const advancedRules: LinkRule[] = [
    { pattern: /\bmemory\b/gi, topic: "memory", label: "memory" },
    { pattern: /\bheap\b/gi, topic: "memory", label: "heap" },
    { pattern: /\bstack\b/gi, topic: "memory", label: "stack" },
    { pattern: /\bprocess\b/gi, topic: "process", label: "process" }
  ];

  if (doc.type === "base") {
    return sharedBaseRules;
  }

  if (doc.type === "intermediate") {
    return [...sharedBaseRules, ...intermediateRules];
  }

  if (doc.type === "advanced") {
    return [...advancedRules, ...intermediateRules];
  }

  return [
    { pattern: /state-transition/gi, topic: "dynamicProgramming", label: "state-transition" },
    { pattern: /\bfile operations\b/gi, topic: "fileSystem", label: "file operations" }
  ];
}

function queryReason(en: string, zh: string, locale: Locale) {
  return locale === "zh" ? zh : en;
}

function inferQueryLinks(query: string, locale: Locale) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [] as RelatedCsLink[];
  }

  if (/(list|array|slice|vector)/.test(q)) {
    return [
      makeLink("dynamicArray", queryReason("This query is about contiguous sequence storage and resize behavior.", "\u8fd9\u4e2a\u67e5\u8be2\u805a\u7126\u8fde\u7eed\u5b58\u50a8\u548c\u6269\u5bb9\u884c\u4e3a\u3002", locale), locale),
      makeLink("linkedList", queryReason("Useful when comparing array-style collections with pointer-linked alternatives.", "\u9002\u5408\u4e0e\u6570\u7ec4\u5f0f\u96c6\u5408\u5bf9\u6bd4\uff0c\u89c2\u5bdf\u94fe\u5f0f\u7ed3\u6784\u7684\u53d6\u820d\u3002", locale), locale)
    ];
  }

  if (/(dict|map|hash|object|set)/.test(q)) {
    return [makeLink("hashTable", queryReason("This query points to key-value lookup and hashing trade-offs.", "\u8fd9\u4e2a\u67e5\u8be2\u6307\u5411\u952e\u503c\u67e5\u627e\u4e0e\u54c8\u5e0c\u53d6\u820d\u3002", locale), locale)];
  }

  if (/(tree|bst|heap|trie)/.test(q)) {
    return [makeLink("tree", queryReason("This query maps to hierarchical storage and traversal concepts.", "\u8fd9\u4e2a\u67e5\u8be2\u5bf9\u5e94\u5c42\u6b21\u5316\u5b58\u50a8\u4e0e\u904d\u5386\u6982\u5ff5\u3002", locale), locale)];
  }

  if (/(sort|ordering)/.test(q)) {
    return [makeLink("sorting", queryReason("This query is directly related to ordering algorithms and their trade-offs.", "\u8fd9\u4e2a\u67e5\u8be2\u76f4\u63a5\u5bf9\u5e94\u6392\u5e8f\u7b97\u6cd5\u53ca\u5176\u53d6\u820d\u3002", locale), locale)];
  }

  if (/(dynamic programming|dp|memo|tabulation)/.test(q)) {
    return [makeLink("dynamicProgramming", queryReason("This query relates to state transitions and overlapping subproblems.", "\u8fd9\u4e2a\u67e5\u8be2\u6d89\u53ca\u72b6\u6001\u8f6c\u79fb\u4e0e\u91cd\u53e0\u5b50\u95ee\u9898\u3002", locale), locale)];
  }

  if (/(concurrency|async|thread|goroutine|future|await|event loop)/.test(q)) {
    return [
      makeLink("process", queryReason("Concurrency models eventually sit on top of OS scheduling and execution units.", "\u5e76\u53d1\u6a21\u578b\u6700\u7ec8\u90fd\u5efa\u7acb\u5728\u64cd\u4f5c\u7cfb\u7edf\u8c03\u5ea6\u4e0e\u6267\u884c\u5355\u5143\u4e4b\u4e0a\u3002", locale), locale),
      makeLink("memory", queryReason("Shared-state versus isolated-state trade-offs depend on memory and synchronization.", "\u5171\u4eab\u72b6\u6001\u4e0e\u9694\u79bb\u72b6\u6001\u7684\u53d6\u820d\u4f9d\u8d56\u5185\u5b58\u4e0e\u540c\u6b65\u673a\u5236\u3002", locale), locale)
    ];
  }

  if (/(http|api|middleware|route|web)/.test(q)) {
    return [
      makeLink("http", queryReason("This query points to request-response semantics and transport behavior.", "\u8fd9\u4e2a\u67e5\u8be2\u6307\u5411\u8bf7\u6c42-\u54cd\u5e94\u8bed\u4e49\u548c\u4f20\u8f93\u884c\u4e3a\u3002", locale), locale),
      makeLink("tcpIp", queryReason("HTTP sits above TCP/IP, so transport-level trade-offs are often relevant.", "HTTP \u8fd0\u884c\u5728 TCP/IP \u4e4b\u4e0a\uff0c\u56e0\u6b64\u4f20\u8f93\u5c42\u53d6\u820d\u901a\u5e38\u76f8\u5173\u3002", locale), locale),
      makeLink("dns", queryReason("Web requests often depend on DNS resolution and caching before transport begins.", "Web \u8bf7\u6c42\u901a\u5e38\u5148\u7ecf\u5386 DNS \u89e3\u6790\u4e0e\u7f13\u5b58\u3002", locale), locale)
    ];
  }

  if (/(orm|database|persistence|migration|storage)/.test(q)) {
    return [
      makeLink("fileSystem", queryReason("Persistence trade-offs often intersect with storage layout and durability semantics.", "\u6301\u4e45\u5316\u53d6\u820d\u7ecf\u5e38\u4e0e\u5b58\u50a8\u5e03\u5c40\u548c\u8010\u4e45\u6027\u8bed\u4e49\u76f8\u4ea4\u3002", locale), locale),
      makeLink("hashTable", queryReason("Many data-access layers rely on hash indexing and lookup behavior.", "\u5f88\u591a\u6570\u636e\u8bbf\u95ee\u5c42\u4f9d\u8d56\u54c8\u5e0c\u7d22\u5f15\u4e0e\u67e5\u627e\u884c\u4e3a\u3002", locale), locale)
    ];
  }

  if (/(memory|heap|stack|gc|ownership)/.test(q)) {
    return [makeLink("memory", queryReason("This query directly maps to runtime memory layout and virtual memory concepts.", "\u8fd9\u4e2a\u67e5\u8be2\u76f4\u63a5\u5bf9\u5e94\u8fd0\u884c\u65f6\u5185\u5b58\u5e03\u5c40\u4e0e\u865a\u62df\u5185\u5b58\u6982\u5ff5\u3002", locale), locale)];
  }

  return [];
}

function inferBaseLinks(doc: SiteDocRecord) {
  const locale = doc.locale;
  const links: RelatedCsLink[] = [];

  if (["python", "java", "javascript", "go"].includes(doc.lang)) {
    links.push(makeLink("dynamicArray", queryReason(`The core sequence types in ${doc.lang} are usually implemented as resizable contiguous arrays.`, `${doc.lang} \u7684\u6838\u5fc3\u987a\u5e8f\u5bb9\u5668\u901a\u5e38\u57fa\u4e8e\u53ef\u6269\u5bb9\u7684\u8fde\u7eed\u6570\u7ec4\u5b9e\u73b0\u3002`, locale), locale));
  }

  if (["python", "java", "javascript", "go", "rust"].includes(doc.lang)) {
    links.push(makeLink("hashTable", queryReason(`The key-value collections in ${doc.lang} are best understood through hashing and collision handling.`, `${doc.lang} \u7684\u952e\u503c\u96c6\u5408\u6700\u9002\u5408\u4ece\u54c8\u5e0c\u4e0e\u51b2\u7a81\u5904\u7406\u89d2\u5ea6\u7406\u89e3\u3002`, locale), locale));
  }

  if (["java", "rust"].includes(doc.lang)) {
    links.push(makeLink("tree", queryReason(`${doc.lang} standard libraries expose tree-based collections with ordered traversal trade-offs.`, `${doc.lang} \u6807\u51c6\u5e93\u63d0\u4f9b\u6811\u5f62\u96c6\u5408\uff0c\u9002\u5408\u7406\u89e3\u6709\u5e8f\u904d\u5386\u7684\u53d6\u820d\u3002`, locale), locale));
  }

  if (doc.lang === "redis") {
    links.push(makeLink("hashTable", queryReason("Redis key lookup and several core data structures are easiest to reason about through hash-table access patterns.", "Redis \u7684\u952e\u67e5\u627e\u548c\u591a\u79cd\u6838\u5fc3\u7ed3\u6784\u90fd\u9002\u5408\u4ece\u54c8\u5e0c\u8bbf\u95ee\u6a21\u5f0f\u7406\u89e3\u3002", locale), locale));
    links.push(makeLink("memory", queryReason("Redis is memory-first infrastructure, so allocation, eviction, and persistence trade-offs all start from memory behavior.", "Redis \u662f\u4ee5\u5185\u5b58\u4e3a\u6838\u5fc3\u7684\u57fa\u7840\u8bbe\u65bd\uff0c\u5206\u914d\u3001\u6dd8\u6c70\u548c\u6301\u4e45\u5316\u53d6\u820d\u90fd\u59cb\u4e8e\u5185\u5b58\u884c\u4e3a\u3002", locale), locale));
  }

  if (doc.lang === "kafka") {
    links.push(makeLink("process", queryReason("Kafka brokers, partitions, and consumer groups map naturally to process coordination and scheduling concepts.", "Kafka \u7684 broker\u3001partition \u4e0e consumer group \u5f88\u9002\u5408\u6620\u5c04\u5230\u8fdb\u7a0b\u534f\u4f5c\u4e0e\u8c03\u5ea6\u6982\u5ff5\u3002", locale), locale));
    links.push(makeLink("fileSystem", queryReason("Kafka durability depends on append-only logs, retention, and segment management at the file-system layer.", "Kafka \u7684\u6301\u4e45\u6027\u4f9d\u8d56\u8ffd\u52a0\u65e5\u5fd7\u3001\u4fdd\u7559\u7b56\u7565\u548c\u6587\u4ef6\u7cfb\u7edf\u5c42\u9762\u7684 segment \u7ba1\u7406\u3002", locale), locale));
  }

  if (doc.lang === "rabbitmq") {
    links.push(makeLink("process", queryReason("RabbitMQ broker dispatch and consumer execution fit naturally into process and scheduling mental models.", "RabbitMQ \u7684\u5206\u53d1\u4e0e\u6d88\u8d39\u6267\u884c\u5929\u7136\u9002\u5408\u653e\u5165\u8fdb\u7a0b\u4e0e\u8c03\u5ea6\u6a21\u578b\u7406\u89e3\u3002", locale), locale));
    links.push(makeLink("tcpIp", queryReason("RabbitMQ delivery semantics still ride on top of TCP/IP transport behavior and connection lifecycle trade-offs.", "RabbitMQ \u7684\u6295\u9012\u8bed\u4e49\u4ecd\u7136\u5efa\u7acb\u5728 TCP/IP \u4f20\u8f93\u884c\u4e3a\u548c\u8fde\u63a5\u751f\u547d\u5468\u671f\u53d6\u820d\u4e4b\u4e0a\u3002", locale), locale));
  }

  if (doc.lang === "es") {
    links.push(makeLink("tree", queryReason("Elasticsearch indexing and query acceleration connect naturally to tree-based indexing structures.", "Elasticsearch \u7684\u7d22\u5f15\u4e0e\u67e5\u8be2\u52a0\u901f\u5929\u7136\u5173\u8054\u6811\u5f62\u7d22\u5f15\u7ed3\u6784\u3002", locale), locale));
    links.push(makeLink("hashTable", queryReason("Caches, term lookup paths, and metadata access often intersect with hash-table style indexing.", "\u7f13\u5b58\u3001term \u67e5\u627e\u8def\u5f84\u548c\u5143\u6570\u636e\u8bbf\u95ee\u5e38\u5e38\u4e0e\u54c8\u5e0c\u5f0f\u7d22\u5f15\u76f8\u5173\u3002", locale), locale));
    links.push(makeLink("fileSystem", queryReason("Segments, shards, and persistence strategy make Elasticsearch strongly tied to file-system behavior.", "segment\u3001shard \u4e0e\u6301\u4e45\u5316\u7b56\u7565\u4f7f Elasticsearch \u4e0e\u6587\u4ef6\u7cfb\u7edf\u884c\u4e3a\u5f3a\u76f8\u5173\u3002", locale), locale));
  }

  return links;
}

function inferIntermediateLinks(doc: SiteDocRecord) {
  const locale = doc.locale;

  if (doc.lang === "redis") {
    return [
      makeLink("hashTable", queryReason("Redis command behavior is tightly coupled to key indexing, hashing, and lookup trade-offs.", "Redis \u547d\u4ee4\u884c\u4e3a\u4e0e\u952e\u7d22\u5f15\u3001\u54c8\u5e0c\u548c\u67e5\u627e\u53d6\u820d\u9ad8\u5ea6\u8026\u5408\u3002", locale), locale),
      makeLink("memory", queryReason("Redis operational tuning is dominated by memory layout, eviction policy, and persistence overhead.", "Redis \u7684\u8fd0\u7ef4\u8c03\u4f18\u4e3b\u8981\u53d7\u5185\u5b58\u5e03\u5c40\u3001\u6dd8\u6c70\u7b56\u7565\u548c\u6301\u4e45\u5316\u5f00\u9500\u652f\u914d\u3002", locale), locale),
      makeLink("fileSystem", queryReason("AOF and RDB persistence become clearer when mapped to storage layout and file durability semantics.", "\u628a AOF \u548c RDB \u6620\u5c04\u5230\u5b58\u50a8\u5e03\u5c40\u4e0e\u6587\u4ef6\u8010\u4e45\u6027\u540e\u4f1a\u66f4\u5bb9\u6613\u7406\u89e3\u3002", locale), locale)
    ];
  }

  if (doc.lang === "kafka") {
    return [
      makeLink("process", queryReason("Kafka consumer groups and partition ownership behave like process-level coordination and scheduling problems.", "Kafka \u7684 consumer group \u4e0e\u5206\u533a\u5f52\u5c5e\u50cf\u5178\u578b\u7684\u8fdb\u7a0b\u7ea7\u534f\u4f5c\u548c\u8c03\u5ea6\u95ee\u9898\u3002", locale), locale),
      makeLink("fileSystem", queryReason("Kafka throughput and durability depend on append-only log files, segments, and retention policies.", "Kafka \u7684\u541e\u5410\u4e0e\u6301\u4e45\u6027\u53d6\u51b3\u4e8e\u8ffd\u52a0\u65e5\u5fd7\u3001segment \u548c\u4fdd\u7559\u7b56\u7565\u3002", locale), locale),
      makeLink("tcpIp", queryReason("Cross-broker replication and client communication still inherit transport-level constraints from TCP/IP.", "\u8de8 broker \u590d\u5236\u4e0e\u5ba2\u6237\u7aef\u901a\u4fe1\u4ecd\u7ee7\u627f TCP/IP \u7684\u4f20\u8f93\u7ea6\u675f\u3002", locale), locale)
    ];
  }

  if (doc.lang === "rabbitmq") {
    return [
      makeLink("process", queryReason("Broker-side routing, queue dispatch, and consumer execution map well to process and thread scheduling concepts.", "broker \u8def\u7531\u3001\u961f\u5217\u5206\u53d1\u4e0e\u6d88\u8d39\u8005\u6267\u884c\u5f88\u9002\u5408\u6620\u5c04\u5230\u8fdb\u7a0b\u548c\u7ebf\u7a0b\u8c03\u5ea6\u3002", locale), locale),
      makeLink("tcpIp", queryReason("AMQP traffic still depends on TCP/IP reliability, backpressure, and connection management.", "AMQP \u6d41\u91cf\u4ecd\u4f9d\u8d56 TCP/IP \u7684\u53ef\u9760\u6027\u3001\u80cc\u538b\u4e0e\u8fde\u63a5\u7ba1\u7406\u3002", locale), locale),
      makeLink("http", queryReason("Operational APIs, management consoles, and service integration still benefit from an HTTP-layer mental model.", "\u8fd0\u7ef4 API\u3001\u7ba1\u7406\u63a7\u5236\u53f0\u4e0e\u670d\u52a1\u96c6\u6210\u4ecd\u9002\u5408\u501f\u52a9 HTTP \u5206\u5c42\u6a21\u578b\u7406\u89e3\u3002", locale), locale)
    ];
  }

  if (doc.lang === "es") {
    return [
      makeLink("tree", queryReason("Index traversal, range search, and search acceleration are easier to understand through tree-based structures.", "\u7d22\u5f15\u904d\u5386\u3001\u8303\u56f4\u67e5\u8be2\u4e0e\u641c\u7d22\u52a0\u901f\u66f4\u9002\u5408\u901a\u8fc7\u6811\u5f62\u7ed3\u6784\u7406\u89e3\u3002", locale), locale),
      makeLink("hashTable", queryReason("Caching and metadata access paths often behave like hash-driven lookup systems.", "\u7f13\u5b58\u548c\u5143\u6570\u636e\u8bbf\u95ee\u8def\u5f84\u901a\u5e38\u7c7b\u4f3c\u54c8\u5e0c\u9a71\u52a8\u7684\u67e5\u627e\u7cfb\u7edf\u3002", locale), locale),
      makeLink("fileSystem", queryReason("Segment merges, shard layout, and Lucene storage internals map directly to file-system concerns.", "segment merge\u3001shard \u5e03\u5c40\u548c Lucene \u5b58\u50a8\u5185\u90e8\u5b9e\u73b0\u90fd\u76f4\u63a5\u6620\u5c04\u5230\u6587\u4ef6\u7cfb\u7edf\u95ee\u9898\u3002", locale), locale)
    ];
  }

  const links = [
    makeLink("process", queryReason(`${doc.lang} concurrency features ultimately run on top of OS scheduling and process/thread abstractions.`, `${doc.lang} \u7684\u5e76\u53d1\u7279\u6027\u6700\u7ec8\u90fd\u8fd0\u884c\u5728\u64cd\u4f5c\u7cfb\u7edf\u8c03\u5ea6\u4e0e\u8fdb\u7a0b/\u7ebf\u7a0b\u62bd\u8c61\u4e4b\u4e0a\u3002`, locale), locale),
    makeLink("http", queryReason(`${doc.lang} web tooling becomes clearer when mapped to HTTP semantics and middleware flow.`, `${doc.lang} \u7684 Web \u5de5\u5177\u4f53\u7cfb\u6620\u5c04\u5230 HTTP \u8bed\u4e49\u548c\u4e2d\u95f4\u4ef6\u6d41\u540e\u4f1a\u66f4\u6e05\u6670\u3002`, locale), locale),
    makeLink("tcpIp", queryReason(`Network services in ${doc.lang} still inherit transport-level behavior from TCP/IP.`, `${doc.lang} \u4e2d\u7684\u7f51\u7edc\u670d\u52a1\u4ecd\u7ee7\u627f TCP/IP \u7684\u4f20\u8f93\u5c42\u884c\u4e3a\u3002`, locale), locale)
  ];

  if (["python", "javascript"].includes(doc.lang)) {
    links.unshift(makeLink("dns", queryReason(`${doc.lang} service calls often hide DNS resolution and client-side caching costs.`, `${doc.lang} \u7684\u670d\u52a1\u8c03\u7528\u7ecf\u5e38\u9690\u85cf DNS \u89e3\u6790\u548c\u5ba2\u6237\u7aef\u7f13\u5b58\u6210\u672c\u3002`, locale), locale));
  }

  return links;
}

function inferAdvancedLinks(doc: SiteDocRecord) {
  const locale = doc.locale;

  if (doc.lang === "redis") {
    return [
      makeLink("memory", queryReason("Redis advanced tuning is dominated by allocator behavior, memory fragmentation, and eviction semantics.", "Redis \u7684\u9ad8\u7ea7\u8c03\u4f18\u4e3b\u8981\u53d7\u5206\u914d\u5668\u884c\u4e3a\u3001\u5185\u5b58\u788e\u7247\u548c\u6dd8\u6c70\u8bed\u4e49\u5f71\u54cd\u3002", locale), locale),
      makeLink("hashTable", queryReason("Core performance characteristics still reduce to hash indexing, rehashing, and key distribution trade-offs.", "\u6838\u5fc3\u6027\u80fd\u7279\u5f81\u4ecd\u53ef\u5f52\u7ed3\u4e3a\u54c8\u5e0c\u7d22\u5f15\u3001rehash \u4e0e\u952e\u5206\u5e03\u53d6\u820d\u3002", locale), locale),
      makeLink("fileSystem", queryReason("Durability modes eventually map back to append-only files, snapshots, and storage guarantees.", "\u6301\u4e45\u5316\u6a21\u5f0f\u6700\u7ec8\u4ecd\u6620\u5c04\u56de\u8ffd\u52a0\u6587\u4ef6\u3001\u5feb\u7167\u4e0e\u5b58\u50a8\u4fdd\u8bc1\u3002", locale), locale)
    ];
  }

  if (doc.lang === "kafka") {
    return [
      makeLink("process", queryReason("Kafka reliability and throughput depend on process coordination across brokers, leaders, and consumers.", "Kafka \u7684\u53ef\u9760\u6027\u548c\u541e\u5410\u4f9d\u8d56 broker\u3001leader \u4e0e consumer \u4e4b\u95f4\u7684\u8fdb\u7a0b\u534f\u4f5c\u3002", locale), locale),
      makeLink("fileSystem", queryReason("Kafka internals are tightly coupled to log segments, page cache behavior, and disk flush strategy.", "Kafka \u5185\u90e8\u4e0e\u65e5\u5fd7\u6bb5\u3001\u9875\u7f13\u5b58\u884c\u4e3a\u548c\u78c1\u76d8\u5237\u76d8\u7b56\u7565\u9ad8\u5ea6\u8026\u5408\u3002", locale), locale),
      makeLink("memory", queryReason("Buffering, batching, and page-cache interaction create meaningful memory trade-offs in Kafka systems.", "\u7f13\u51b2\u3001\u6279\u5904\u7406\u548c\u9875\u7f13\u5b58\u4ea4\u4e92\u4f1a\u5728 Kafka \u4e2d\u5f62\u6210\u660e\u663e\u7684\u5185\u5b58\u53d6\u820d\u3002", locale), locale)
    ];
  }

  if (doc.lang === "rabbitmq") {
    return [
      makeLink("process", queryReason("RabbitMQ internals map naturally to scheduler pressure, worker execution, and queue coordination.", "RabbitMQ \u5185\u90e8\u5929\u7136\u6620\u5c04\u5230\u8c03\u5ea6\u538b\u529b\u3001worker \u6267\u884c\u548c\u961f\u5217\u534f\u4f5c\u3002", locale), locale),
      makeLink("tcpIp", queryReason("High-volume delivery guarantees still depend on transport behavior, flow control, and network failure modes.", "\u9ad8\u541e\u5410\u6295\u9012\u4fdd\u8bc1\u4ecd\u4f9d\u8d56\u4f20\u8f93\u884c\u4e3a\u3001\u6d41\u63a7\u548c\u7f51\u7edc\u6545\u969c\u6a21\u5f0f\u3002", locale), locale),
      makeLink("memory", queryReason("Queue backlogs, message buffering, and broker pressure all surface as memory-management trade-offs.", "\u961f\u5217\u79ef\u538b\u3001\u6d88\u606f\u7f13\u51b2\u4e0e broker \u538b\u529b\u6700\u7ec8\u90fd\u4f53\u73b0\u4e3a\u5185\u5b58\u7ba1\u7406\u53d6\u820d\u3002", locale), locale)
    ];
  }

  if (doc.lang === "es") {
    return [
      makeLink("tree", queryReason("Index data structures, range queries, and search planning remain deeply tied to tree-style access patterns.", "\u7d22\u5f15\u6570\u636e\u7ed3\u6784\u3001\u8303\u56f4\u67e5\u8be2\u4e0e\u641c\u7d22\u89c4\u5212\u4ecd\u6df1\u5ea6\u4f9d\u8d56\u6811\u5f0f\u8bbf\u95ee\u6a21\u5f0f\u3002", locale), locale),
      makeLink("hashTable", queryReason("Caches and metadata lookup paths still rely on hash-based access behavior.", "\u7f13\u5b58\u548c\u5143\u6570\u636e\u67e5\u627e\u8def\u5f84\u4ecd\u4f9d\u8d56\u57fa\u4e8e\u54c8\u5e0c\u7684\u8bbf\u95ee\u884c\u4e3a\u3002", locale), locale),
      makeLink("fileSystem", queryReason("Segment merging, shard storage, and recovery semantics are fundamentally file-system problems.", "segment \u5408\u5e76\u3001shard \u5b58\u50a8\u4e0e\u6062\u590d\u8bed\u4e49\u672c\u8d28\u4e0a\u4ecd\u662f\u6587\u4ef6\u7cfb\u7edf\u95ee\u9898\u3002", locale), locale)
    ];
  }

  return [
    makeLink("memory", queryReason(`${doc.lang} advanced runtime behavior is tightly coupled to allocation, locality, and isolation.`, `${doc.lang} \u7684\u9ad8\u7ea7\u8fd0\u884c\u65f6\u884c\u4e3a\u4e0e\u5206\u914d\u3001\u5c40\u90e8\u6027\u548c\u9694\u79bb\u7d27\u5bc6\u8026\u5408\u3002`, locale), locale),
    makeLink("process", queryReason(`${doc.lang} deep concurrency and runtime internals map naturally to OS execution concepts.`, `${doc.lang} \u7684\u6df1\u5c42\u5e76\u53d1\u4e0e\u8fd0\u884c\u65f6\u5185\u90e8\u673a\u5236\u5929\u7136\u6620\u5c04\u5230\u64cd\u4f5c\u7cfb\u7edf\u6267\u884c\u6982\u5ff5\u3002`, locale), locale)
  ];
}

function inferAgentLinks(locale: Locale) {
  return [
    makeLink("dynamicProgramming", queryReason("Agent repair loops and planning often benefit from explicit state-transition thinking.", "\u667a\u80fd\u4f53\u4fee\u590d\u5faa\u73af\u4e0e\u89c4\u5212\u5e38\u5e38\u53d7\u76ca\u4e8e\u663e\u5f0f\u7684\u72b6\u6001\u8f6c\u79fb\u601d\u7ef4\u3002", locale), locale),
    makeLink("fileSystem", queryReason("Large agentic refactors still depend on clear module boundaries and durable file operations.", "\u5927\u89c4\u6a21\u667a\u80fd\u4f53\u91cd\u6784\u4ecd\u4f9d\u8d56\u6e05\u6670\u7684\u6a21\u5757\u8fb9\u754c\u548c\u53ef\u9760\u7684\u6587\u4ef6\u64cd\u4f5c\u3002", locale), locale)
  ];
}

function dedupeLinks(links: RelatedCsLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.category}:${link.slug}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function getRelatedCsLinks(doc: SiteDocRecord, type: DocType, query?: string) {
  const queryLinks = inferQueryLinks(query ?? "", doc.locale);
  const fallbackLinks =
    type === "base"
      ? inferBaseLinks(doc)
      : type === "intermediate"
        ? inferIntermediateLinks(doc)
        : type === "advanced"
          ? inferAdvancedLinks(doc)
          : inferAgentLinks(doc.locale);

  return dedupeLinks([...queryLinks, ...fallbackLinks]).slice(0, 4);
}

export function linkLanguageDocConcepts(source: string, doc: SiteDocRecord) {
  const rules = getInlineRules(doc);
  const segments = source.split(/(```[\s\S]*?```)/g);

  return segments
    .map((segment) => {
      if (segment.startsWith("```")) {
        return segment;
      }

      return segment
        .split("\n")
        .map((line) => {
          if (line.includes("](/concepts?") || line.includes("](/cs?") || line.trim().startsWith("|")) {
            return line;
          }

          return rules.reduce((currentLine, rule) => replaceWithConceptLink(currentLine, doc, rule), line);
        })
        .join("\n");
    })
    .join("");
}
