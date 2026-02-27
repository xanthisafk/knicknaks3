import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word to Number",
  slug: "word-to-number",
  description: "Convert English number words to digits and back — \"one hundred twenty\" ↔ 120.",
  category: "converters",
  icon: "🔢",
  keywords: ["word", "number", "convert", "text", "digit", "english", "spell", "written"],
  tags: ["text", "numbers", "conversion"],
  component: () => import("./WordToNumberTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What range is supported?", answer: "Supports numbers up to trillions in both directions." },
    { question: "Does it handle decimals?", answer: "Yes — 'three point five' converts to 3.5 and vice versa." },
  ],
  howItWorks: "Type a number or English words. The tool converts in both directions simultaneously.",
  relatedTools: ["number-to-words", "percentage-calc"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
