import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Deduplicate Lines",
  slug: "deduplicate-lines",
  description: "Remove duplicate lines from text while preserving the original order.",
  category: "text",
  icon: "🧹",
  keywords: ["deduplicate", "duplicate", "unique", "lines", "remove", "filter", "distinct"],
  tags: ["text", "cleanup"],
  component: () => import("./DeduplicateLinesTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Paste your text and duplicates are removed instantly. Optionally ignore case or trim whitespace.",
  relatedTools: ["text-sorter", "word-counter", "remove-line-breaks"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
