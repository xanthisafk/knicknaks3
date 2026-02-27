import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Reverse Text",
  slug: "reverse-text",
  description: "Reverse characters, words, or lines in your text with live preview.",
  category: "text",
  icon: "🔀",
  keywords: ["reverse", "text", "mirror", "backwards", "flip"],
  tags: ["text", "fun"],
  component: () => import("./ReverseTextTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Enter text and choose to reverse characters, words, or entire lines. Output updates in real-time.",
  relatedTools: ["case-converter", "upside-down-text", "text-sorter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
