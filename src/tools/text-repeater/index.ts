import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Repeater",
  slug: "text-repeater",
  description: "Repeat a string N times with a custom separator between each occurrence.",
  category: "text",
  icon: "🔃",
  keywords: ["repeat", "text", "string", "duplicate", "separator", "fill", "pattern"],
  tags: ["text", "utility"],
  component: () => import("./TextRepeaterTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What separators can I use?", answer: "Any text — a newline, comma, space, dash, or even empty string to join immediately." },
  ],
  howItWorks: "Enter your text, choose a repeat count, pick a separator, and copy the result.",
  relatedTools: ["lorem-ipsum", "text-diff"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
