import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Reverse Text",
  slug: "reverse-text",
  description: "Reverse text by characters, words, or lines instantly.",
  category: "text",
  icon: "⏪",
  keywords: [
    "reverse text",
    "reverse text online",
    "flip text backwards",
    "backwards text generator",
    "reverse words in sentence",
    "reverse string tool",
    "reverse lines order",
    "mirror text generator",
    "invert text order",
    "text reverser"
  ],
  tags: ["text", "formatter", "fun"],
  component: () => import("./ReverseTextTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    {
      question: "How does reverse text work?",
      answer: "You can reverse text at different levels: characters, words, or entire lines, depending on your selection."
    },
    {
      question: "Can I reverse word order without changing spelling?",
      answer: "Yes, the word mode keeps each word intact while reversing their order in the sentence."
    },
    {
      question: "Can I reverse a list?",
      answer: "Yes, line mode flips the order of lines, making the last item appear first."
    }
  ],
  howItWorks: "Paste your text, choose a reverse mode, and instantly flip characters, words, or lines.",
  relatedTools: ["case-converter", "upside-down-text", "text-sorter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};