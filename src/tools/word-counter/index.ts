import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word Counter",
  slug: "word-counter",
  description: "Free online word counter with character count, sentences, and reading time.",
  category: "text",
  icon: "📝",
  keywords: [
    "word counter",
    "word counter online free",
    "character count tool",
    "count words and characters",
    "reading time calculator",
    "sentence counter",
    "paragraph counter",
    "text analyzer online",
    "word count checker",
    "characters without spaces counter"
  ],
  tags: ["text", "analytics", "writing"],

  component: () => import("./WordCounterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I count words in my text?",
      answer: "Paste or type your text into the box and the word count updates instantly in real time."
    },
    {
      question: "Does this tool count characters and spaces?",
      answer: "Yes, it shows total characters and characters without spaces as separate metrics."
    },
    {
      question: "How is reading time calculated?",
      answer: "Reading time is estimated using an average speed of 200 words per minute."
    },
    {
      question: "How is speaking time calculated?",
      answer: "Speaking time is based on an average pace of 130 words per minute."
    },
    {
      question: "Can I count sentences and paragraphs?",
      answer: "Yes, the tool automatically detects sentences and paragraphs from your text."
    },
    {
      question: "Is this word counter free?",
      answer: "Yes, the tool is completely free with no limits or sign-up required."
    },
    {
      question: "Is my text saved or uploaded?",
      answer: "No, your text stays private and is never uploaded or stored."
    },
    {
      question: "Can I use this for essays or SEO content?",
      answer: "Yes, it's useful for essays, blog posts, SEO writing, and social media content."
    },
    {
      question: "What counts as a word?",
      answer: "Words are detected by splitting text based on spaces and standard whitespace."
    }
  ],

  howItWorks:
    "Paste or type text to instantly count words, characters, sentences, and reading time in real time.",

  relatedTools: ["case-converter", "text-sorter", "lorem-ipsum"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-30",
};
