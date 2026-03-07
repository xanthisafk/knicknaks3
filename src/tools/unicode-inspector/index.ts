import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unicode Inspector",
  slug: "unicode-inspector",
  description: "Analyze and learn more about Unicode characters",
  longDescription: "Peel back the layer of modern typography. Our deep-dive Unicode Inspector instantly analyzes any pasted string or emoji, breaking it down character-by-character. Discover the official mathematical code point, the designated Unicode Block category, and the precise UTF-8 byte distribution used to render the glyph on screen.",
  category: "encoders",
  icon: "🔬",
  keywords: ["unicode inspector tool", "character code point finder", "emoji unicode analyzer", "utf8 byte calculator", "hex value of character", "identify strange symbol", "text block category"],
  tags: ["developer", "encoding", "unicode"],
  component: () => import("./UnicodeInspectorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What exactly is a 'code point'?", answer: "A code point is the specific numerical value assigned by the Unicode Consortium to represent a specific character. For example, the capital letter 'A' is universally known as U+0041." },
    { question: "What does 'UTF-8 Bytes' mean?", answer: "While a code point is a mathematical concept, UTF-8 is the actual way a computer saves that concept to a hard drive format. Standard English letters take 1 byte, while complex foreign symbols or Emojis can take up to 4 bytes." },
    { question: "Why do some Emojis show up as multiple characters?", answer: "Many modern Emojis (like a family, or varying skin tones) are actually composed of multiple distinct Unicode symbols glued together using invisible 'Zero Width Joiners'. This tool reveals every single hidden component." }
  ],
  howItWorks: "Simply type or paste any text, symbol, or emoji sequence into the input box. The tool automatically maps the string into an array, pulling down the official Unicode metadata for every individual component.",
  relatedTools: ["html-entities", "base64", "text-to-ascii"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
