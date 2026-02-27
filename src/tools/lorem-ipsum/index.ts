import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Lorem Ipsum Generator",
  slug: "lorem-ipsum",
  description: "Generate placeholder text by paragraphs, sentences, or word count for your designs.",
  longDescription:
    "Generate professional placeholder text for mockups and designs. Choose between paragraphs, " +
    "sentences, or word-count modes. Supports classic Lorem Ipsum with customizable outputs.",
  category: "generators",
  icon: "📜",
  keywords: ["lorem", "ipsum", "placeholder", "text", "dummy", "generate", "mockup"],
  tags: ["text", "generator", "design"],

  component: () => import("./LoremIpsumTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is Lorem Ipsum?",
      answer:
        "Lorem Ipsum is placeholder text used in design and typesetting to simulate real content. " +
        "It originates from a 1st-century BC Latin text by Cicero.",
    },
  ],

  howItWorks:
    "Select your desired output mode (paragraphs, sentences, or words) and quantity. " +
    "Click Generate to produce placeholder text, then copy it to your clipboard.",

  relatedTools: ["word-counter", "markdown-preview"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
