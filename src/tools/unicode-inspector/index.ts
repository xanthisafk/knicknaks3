import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unicode Inspector",
  slug: "unicode-inspector",
  description: "Inspect every character's Unicode code point, name, block, and category.",
  category: "encoders",
  icon: "🔬",
  keywords: ["unicode", "codepoint", "character", "inspect", "utf", "utf8", "utf16", "encoding", "hex"],
  tags: ["developer", "encoding", "unicode"],
  component: () => import("./UnicodeInspectorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is a code point?", answer: "A code point is the numerical value assigned to each Unicode character — e.g. 'A' is U+0041." },
    { question: "What is UTF-8?", answer: "UTF-8 is the most common Unicode encoding, using 1–4 bytes per character." },
  ],
  howItWorks: "Type or paste text to see a breakdown of every character with its Unicode code point, name, and bytes.",
  relatedTools: ["html-entities", "base64"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
