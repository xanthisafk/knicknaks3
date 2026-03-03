import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Remove Line Breaks",
  slug: "remove-line-breaks",
  description: "Instantly strip all line breaks and hard returns from your text to collapse it into a single paragraph.",
  longDescription: "Clean up messy copy-pasted text effortlessly. Our Remove Line Breaks tool automatically scans your text to identify and completely erase unwanted hard returns, carriage returns, and line breaks. Compress fragmented sentences into a single, continuous paragraph, or join lines using a custom separator.",
  category: "text",
  icon: "📏",
  keywords: ["remove line breaks online", "strip newlines text", "collapse paragraphs", "remove carriage returns", "join text lines", "delete hard enter spacing", "format copy pasted pdf text"],
  tags: ["text", "cleanup"],
  component: () => import("./RemoveLineBreaksTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Why do I need to remove line breaks?", answer: "When copying text from older PDF documents, emails, or terminal windows, hard 'enter' breaks are often embedded at the end of every visual line. Removing these allows the text to naturally flow and wrap smoothly in standard word processors." },
    { question: "Can I replace the breaks with a comma?", answer: "Yes! By default, the tool replaces breaks with a standard space. However, you can select the 'Comma' option to instantly convert a vertical list of items into a clean, comma-separated string (CSV format)." },
    { question: "Does this remove double-spaced paragraphs?", answer: "If you select the 'Preserve Paragraphs' option, the tool clears single line breaks but intelligently keeps double carriage returns, maintaining your intended paragraph separation while fixing the jagged lines." }
  ],
  howItWorks: "Paste your raw, messy text into the input field. Select your desired replacement character (such as a 'Space', 'Comma', or entirely 'None') and click 'Format'. The tool strips the invisible line break characters (`\\n` and `\\r`) instantly.",
  relatedTools: ["deduplicate-lines", "text-sorter", "word-counter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
