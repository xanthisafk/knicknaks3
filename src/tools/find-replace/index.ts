import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Find & Replace",
  slug: "find-replace",
  description: "Advanced text Find & Replace tool with support for Regex, live matching, and capture groups.",
  longDescription: "Quickly scan and modify large blocks of text with our advanced Find & Replace utility. Easily perform simple text substitutions or leverage the immense power of full JavaScript Regular Expressions (Regex) complete with capture group replacements in a live preview environment.",
  category: "text",
  icon: "🔎",
  keywords: ["find and replace text online", "regex replace string", "text substitution tool", "bulk replace words", "regexp string modifier", "live text search replace", "find and substitute"],
  tags: ["text", "developer", "editing"],
  component: () => import("./FindReplaceTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I use Regex for advanced replacing?", answer: "Absolutely. Toggle on Regex mode to use standard JavaScript regular expression syntax. You can even use capture groups (like `$1`, `$2`) dynamically within your replacement text." },
    { question: "Is the find query case-sensitive?", answer: "By default, no. However, you can toggle exact case-sensitivity on or off instantly using the dedicated 'Aa' formatting button." },
    { question: "Can I replace newlines and line breaks?", answer: "Yes! Using Regex mode, you can target and match `\\n` (newlines) and `\\t` (tabs) to effectively remove or replace hidden document formatting." }
  ],
  howItWorks: "Paste your starting text into the editor, enter the specific search term or Regex pattern, and type your desired replacement phrase. The tool visually highlights all live matches before you commit. Click replace to finalize updates across the entire document.",
  relatedTools: ["regex-tester", "text-diff"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
