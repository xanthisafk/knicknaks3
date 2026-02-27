import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Sorter",
  slug: "text-sorter",
  description: "Sort lines of text alphabetically, numerically, by length, or in reverse order.",
  category: "text",
  icon: "🔃",
  keywords: ["sort", "text", "lines", "alphabetical", "reverse", "order", "list"],
  tags: ["text", "sorting"],
  component: () => import("./TextSorterTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Paste lines of text, select sorting method, and get instantly sorted output.",
  relatedTools: ["word-counter", "deduplicate-lines", "case-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
