import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to ASCII Converter",
  slug: "text-to-ascii",
  description: "Convert text to ASCII codes in decimal, hex, octal, or binary.",
  category: "encoders",
  icon: "🔤",
  keywords: [
    "text to ascii",
    "ascii converter",
    "ascii code generator",
    "string to ascii codes",
    "character code converter",
    "text to hex ascii",
    "ascii table lookup",
    "unicode to ascii numbers",
    "char code tool",
    "ascii values of characters"
  ],
  tags: ["encoding", "developer"],
  component: () => import("./TextToAsciiTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "How do I convert text to ASCII codes?",
      answer: "Enter your text and the tool instantly converts each character into its numeric ASCII (or Unicode) representation."
    },
    {
      question: "What formats are supported?",
      answer: "You can view character codes in decimal, hexadecimal, octal, or binary formats."
    },
    {
      question: "What is the difference between ASCII and Unicode?",
      answer: "ASCII covers basic characters (0–127), while Unicode extends this to support thousands of global characters. This tool uses Unicode code points, so it works with emojis and non-English text."
    },
    {
      question: "What does each number represent?",
      answer: "Each number corresponds to a character’s code point—its internal numeric representation used by computers."
    },
    {
      question: "Can I see a character-by-character breakdown?",
      answer: "Yes. The tool includes a table showing each character alongside its decimal, hex, octal, and binary values."
    },
    {
      question: "Is this tool useful for developers?",
      answer: "Yes. It’s commonly used for debugging encoding issues, learning character codes, and working with low-level text formats."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, it works entirely offline."
    },
    {
      question: "Is my data private?",
      answer: "Yes. All conversions happen locally in your browser with no data sent to a server."
    }
  ],

  howItWorks:
    "Enter text, choose a format like decimal, hex, octal, or binary, and instantly see each character converted into its numeric code. Includes a detailed character table for reference.",

  relatedTools: ["unicode-inspector"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-26",
};
