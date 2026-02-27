import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Remove Line Breaks",
  slug: "remove-line-breaks",
  description: "Strip line breaks and collapse text into a single paragraph or join with a custom separator.",
  category: "text",
  icon: "📏",
  keywords: ["remove", "line", "break", "newline", "strip", "merge", "collapse", "paragraph"],
  tags: ["text", "cleanup"],
  component: () => import("./RemoveLineBreaksTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Paste text with line breaks and choose to join with a space, comma, or custom separator.",
  relatedTools: ["deduplicate-lines", "text-sorter", "word-counter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
