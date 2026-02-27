import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Number to Words",
  slug: "number-to-words",
  description: "Convert digits to written English — 1542 → \"one thousand five hundred forty-two\". Great for legal/finance documents.",
  category: "converters",
  icon: "🔤",
  keywords: ["number", "words", "spell", "written", "convert", "english", "legal", "finance", "text"],
  tags: ["numbers", "text", "conversion"],
  component: () => import("./NumberToWordsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Does it support decimals?", answer: "Yes — decimals are written as 'point X' or as 'and X/100' cents format for currency." },
    { question: "How large can the number be?", answer: "Up to quadrillion (10^15)." },
  ],
  howItWorks: "Enter a number and see its English word form instantly. Toggle currency mode for dollar formatting.",
  relatedTools: ["word-to-number", "percentage-calc"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
