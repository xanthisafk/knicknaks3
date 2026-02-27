import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Find & Replace",
  slug: "find-replace",
  description: "Regex-powered find and replace with live match count and highlighting.",
  category: "text",
  icon: "🔎",
  keywords: ["find", "replace", "search", "regex", "text", "substitute", "pattern"],
  tags: ["text", "developer", "editing"],
  component: () => import("./FindReplaceTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I use regex?", answer: "Yes — toggle regex mode to use full JavaScript regex patterns with capture groups." },
    { question: "Is it case-sensitive?", answer: "Toggle case-sensitivity on or off with the Aa button." },
  ],
  howItWorks: "Paste your text, enter a search term (or pattern), type the replacement, and see results live before applying.",
  relatedTools: ["regex-tester", "text-diff"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
