import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Remove Line Breaks",
  slug: "remove-line-breaks",
  description: "Remove line breaks from text and join lines instantly.",
  category: "text",
  icon: "📏",
  keywords: [
    "remove line breaks",
    "remove new lines text",
    "strip line breaks online",
    "join lines of text",
    "remove carriage returns",
    "convert multiline text to single line",
    "remove hard returns",
    "collapse text lines",
    "fix copied pdf text",
    "text line break remover"
  ],
  tags: ["text", "cleanup", "formatter"],
  component: () => import("./RemoveLineBreaksTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    {
      question: "Why remove line breaks from text?",
      answer: "Copied text from PDFs, emails, or terminals often includes unwanted line breaks. Removing them restores natural sentence flow."
    },
    {
      question: "Can I replace line breaks with commas or symbols?",
      answer: "Yes, you can replace line breaks with spaces, commas, or any custom separator to format text exactly how you need."
    },
    {
      question: "Does it support paragraph preservation?",
      answer: "You can control how line breaks are handled, including keeping spacing where needed and removing only hard breaks."
    }
  ],
  howItWorks: "Paste your text, choose a separator, and instantly remove or replace line breaks to create clean, continuous text.",
  relatedTools: ["deduplicate-lines", "text-sorter", "word-counter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};
