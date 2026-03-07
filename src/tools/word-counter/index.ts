import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word & Character Counter",
  slug: "word-counter",
  description: "Count word, characters, sentences and reading time",
  longDescription:
    "A powerful, real-time typography analytics dashboard designed for writers, students, and SEO marketers. Beyond basic word and character counting (with or without spaces), this tool instantly calculates paragraph density, sentence boundaries, estimated human reading time, and theoretical speaking time based on standardized adult reading metrics.",
  category: "text",
  icon: "📝",
  keywords: ["word counter online", "character count tool", "how many words is this", "reading time calculator", "paragraph counter", "text length analyzer", "count words without spaces"],
  tags: ["text", "analytics", "writing"],

  component: () => import("./WordCounterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How is the reading and speaking time calculated?",
      answer:
        "Standard reading time estimation relies on an industry-standard average reading speed of 200 words per minute (WPM), typical for adult English readers. Speaking time utilizes a slightly slower 130 WPM average to account for vocal pacing."
    },
    {
      question: "Does the character count include special symbols?",
      answer:
        "Yes. The primary 'Characters' metric counts absolutely every keystroke (including spaces, newlines, and punctuation). We also provide a distinct 'Characters (no spaces)' metric strictly excluding whitespace."
    },
    {
      question: "Is there a limit to how much text I can paste?",
      answer: "Since the entire calculation loops via Javascript directly within your own browser with no server uploads, the only limit is the total RAM size of your computer. Most modern devices can easily handle counting hundreds of thousands of words instantly."
    }
  ],

  howItWorks:
    "Paste or type your text draft into the large input area. The analytics dashboard above updates in absolute real-time on every single keystroke. Words are split by generic whitespace, sentences are grouped by terminal punctuation (`.!?`), and paragraphs are determined by detecting blank line breaks.",

  relatedTools: ["case-converter", "text-sorter", "lorem-ipsum"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
