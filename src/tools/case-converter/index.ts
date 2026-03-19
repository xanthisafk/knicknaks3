import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Case Converter",
  slug: "case-converter",
  description: "Convert text between UPPERCASE, lowercase, and more",
  category: "text",
  icon: "🔤",
  keywords: ["case converter online", "uppercase to lowercase", "change text case", "camelcase converter", "snake case to camel case", "title case capitalization", "pascalcase string formatting", "text formatting tool"],
  tags: ["text", "conversion", "formatting"],

  component: () => import("./CaseConverterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What text case styles are supported?",
      answer:
        "The tool comprehensively supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, " +
        "kebab-case, CONSTANT_CASE, and dot.case format conversions.",
    },
    {
      question: "How does Title Case differ from Sentence case?",
      answer:
        "Title Case capitalizes the first letter of almost every word (excluding minor conjunctions or prepositions). Sentence case only capitalizes " +
        "the very first letter of the entire sentence, leaving the rest lowercase.",
    },
    {
      question: "What is camelCase typically used for?",
      answer: "camelCase is incredibly common in programming (especially JavaScript and Java) for naming variables and functions, where the first word is lowercase and subsequent words start with a capital letter without spaces."
    }
  ],

  howItWorks:
    "Paste or type your unformatted text into the input box and click your desired case style button to transform the entire string completely instantly. " +
    "Use the handy copy button to grab the newly formatted text immediately for your project.",

  relatedTools: ["word-counter", "text-to-slug", "string-escaper"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  lastUpdated: "2026-03-18",
};
