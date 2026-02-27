import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Case Converter",
  slug: "case-converter",
  description: "Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
  longDescription:
    "Convert text between multiple casing styles instantly. Supports UPPERCASE, lowercase, Title Case, " +
    "Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case.",
  category: "text",
  icon: "🔤",
  keywords: ["case", "convert", "uppercase", "lowercase", "camel", "snake", "pascal", "kebab", "title"],
  tags: ["text", "conversion", "formatting"],

  component: () => import("./CaseConverterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What case styles are supported?",
      answer:
        "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, " +
        "kebab-case, CONSTANT_CASE, and dot.case.",
    },
    {
      question: "How does Title Case differ from Sentence case?",
      answer:
        "Title Case capitalizes the first letter of every word. Sentence case only capitalizes " +
        "the first letter of each sentence.",
    },
  ],

  howItWorks:
    "Enter your text and click any case style button to transform it instantly. " +
    "Use the copy button to grab the result for your project.",

  relatedTools: ["word-counter", "text-to-slug", "string-escaper"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
