import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Sorter",
  slug: "text-sorter",
  description: "Sort lines alphabetically, numerically, or by string length",
  longDescription: "Bring order to chaotic data. Simply paste a messy vertical list of names, items, or numbers into our Text Sorter. With a single click, perfectly organize your data alphabetically (A-Z), reverse-alphabetically (Z-A), numerically, or even by character length. Works locally without server uploads.",
  category: "text",
  icon: "🔃",
  keywords: ["sort list alphabetically online", "alphabetizer tool", "order lines a to z", "sort text by length", "numerical list sorter", "reverse list order", "organize words alphabetically"],
  tags: ["text", "sorting"],
  component: () => import("./TextSorterTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Does this tool sort numbers properly?", answer: "Yes. In standard dictionary sorting, '10' appears before '2'. However, by checking our 'Sort Numerically' option, the tool evaluates the math, properly placing '2' before '10'." },
    { question: "Will it ignore capital letters?", answer: "By default, computer logic groups uppercase letters before lowercase. However, selecting the 'Case Insensitive' option ensures 'apple' and 'Zebra' are sorted strictly by spelling, regardless of capitalization." },
    { question: "How does sorting by length work?", answer: "Selecting 'Length' sorts the document based strictly on the character count of each line. The shortest strings appear at the top, and the longest sentences drop to the bottom." }
  ],
  howItWorks: "Paste your raw, unorganized list into the input box. Use the toggles to dictate the sorting behavior (A-Z, Reverse, Numeric, Case-Sensitivity). The list instantly reorganizes itself visually as you make changes.",
  relatedTools: ["word-counter", "deduplicate-lines", "case-converter"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
