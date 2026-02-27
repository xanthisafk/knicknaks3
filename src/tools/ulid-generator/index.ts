import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ULID Generator",
  slug: "ulid-generator",
  description: "Generate Universally Unique Lexicographically Sortable Identifiers (ULIDs) in the browser.",
  category: "generators",
  icon: "🆔",
  keywords: ["ulid", "id", "unique", "generator", "sortable", "timestamp", "identifier", "uuid"],
  tags: ["developer", "id", "generator"],
  component: () => import("./UlidGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "ULID vs UUID?", answer: "ULIDs are sortable by creation time (the timestamp is embedded), while UUID v4 is random with no ordering guarantee." },
    { question: "Format?", answer: "26 characters in Crockford's Base32: 10-char timestamp + 16-char random component." },
  ],
  howItWorks: "Click Generate to create a ULID. Generate multiple at once. Click any to copy to clipboard.",
  relatedTools: ["uuid-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
