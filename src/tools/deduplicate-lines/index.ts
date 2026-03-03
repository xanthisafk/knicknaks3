import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Deduplicate Lines",
  slug: "deduplicate-lines",
  description: "Instantly remove duplicate lines from text lists while preserving their original order.",
  longDescription: "Clean up your data effortlessly with the Deduplicate Lines tool. Simply paste any list or text block, and our algorithm will instantly strip out repetitive lines while maintaining the exact original order of the remaining unique items. Ideal for processing CSVs, cleaning email lists, and formatting code.",
  category: "text",
  icon: "🧹",
  keywords: ["deduplicate lines online", "remove duplicate text", "unique line filter", "clean up lists", "delete repeated lines", "strip duplicate words", "text list deduplicator"],
  tags: ["text", "cleanup"],
  component: () => import("./DeduplicateLinesTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Does it preserve the original sorting order?", answer: "Yes. Unlike some primitive tools that force an alphabetical sort to remove duplicates, our tool maintains the chronological appearance of the first unique instance of every line." },
    { question: "Can I ignore capitalization when removing duplicates?", answer: "Yes, you can toggle the 'Ignore Case' option to treat 'Apple' and 'apple' as the exact same line, effectively removing one of them." },
    { question: "Is my pasted data stored anywhere?", answer: "No. All text processing occurs safely and privately within your own web browser. No data is sent to our servers." }
  ],
  howItWorks: "Paste your raw text or list into the input box. The tool scans every line in real-time, instantly identifying and removing redundant entries. Check the options to ignore case or trim whitespace for more aggressive cleaning before copying the result.",
  relatedTools: ["text-sorter", "word-counter", "remove-line-breaks"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
