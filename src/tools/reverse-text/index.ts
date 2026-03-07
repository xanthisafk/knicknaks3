import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Reverse Text",
  slug: "reverse-text",
  description: "Reverse your text order",
  longDescription: "Easily manipulate string orientation with the local Reverse Text tool. Instantly mirror block text character-by-character (for puzzles or passwords), flip the sequence of entire words within a sentence (Yoda speak), or completely invert the vertical order of a multi-line list.",
  category: "text",
  icon: "🔀",
  keywords: ["reverse text online", "flip text backwards", "mirror letters generator", "backwards word spelling", "reverse list order", "text reverser tool", "make text read backwards"],
  tags: ["text", "fun"],
  component: () => import("./ReverseTextTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What does 'Reverse Characters' do?", answer: "This mode mirrors the entire string precisely. 'Hello World' fundamentally becomes 'dlroW olleH'." },
    { question: "What does 'Reverse Words' mean?", answer: "This separates the text by spaces and flips their order while keeping the letters forward-facing. 'Hello World' becomes 'World Hello'." },
    { question: "Can I invert the order of my list items?", answer: "Yes! By selecting 'Reverse Lines', the tool takes a vertical list and flips its sequence so the last item is now first, without altering the spelling of the individual lines." }
  ],
  howItWorks: "Simply type or paste your standard text into the primary input box. Choose the specific modifier (Characters, Words, or Lines) via the options menu. The application instantly processes the string array and outputs the reversed format.",
  relatedTools: ["case-converter", "upside-down-text", "text-sorter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
