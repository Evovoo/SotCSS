export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DISPLAY_NAME_MAP: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  "react-native": "React Native",
  vue: "Vue",
  next: "Next.js",
  python: "Python",
  java: "Java",
  go: "Go",
  rust: "Rust",
  rabbitmq: "RabbitMQ",
  minio: "MinIO",
  redis: "Redis",
  es: "Elasticsearch",
  nacos: "Nacos",
  openfeign: "OpenFeign",
  seata: "Seata",
  shiro: "Shiro",
  kafka: "Kafka"
};

export function formatDisplayName(value: string) {
  return (
    DISPLAY_NAME_MAP[value] ??
    value
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}
