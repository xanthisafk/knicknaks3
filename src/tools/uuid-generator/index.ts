import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "UUID Generator",
  slug: "uuid-generator",
  description: "Generate v4 (random) and v7 (timestamp-ordered) UUIDs with bulk generation support.",
  longDescription:
    "Generate universally unique identifiers (UUIDs) using cryptographically secure random values. " +
    "Supports v4 (random) and v7 (timestamp-ordered). Generate up to 100 UUIDs at once.",
  category: "generators",
  icon: "🆔",
  keywords: ["uuid", "guid", "unique", "id", "identifier", "generate", "random", "v4", "v7"],
  tags: ["generator", "id", "developer"],

  component: () => import("./UuidGeneratorTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is the difference between UUID v4 and v7?",
      answer:
        "UUID v4 is purely random. UUID v7 embeds a Unix timestamp in the first 48 bits, making it " +
        "lexicographically sortable by creation time — ideal for database primary keys.",
    },
  ],

  howItWorks:
    "Select a UUID version and quantity, then click Generate. Results can be copied individually " +
    "or all at once. UUIDs are generated using the browser's crypto.getRandomValues() API.",

  relatedTools: ["ulid-generator", "password-generator", "hash-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
