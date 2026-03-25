import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Repeater",
  slug: "text-repeater",
  description: "Repeat text multiple times with custom separators instantly.",
  category: "text",
  icon: "🔃",
  keywords: [
    "text repeater",
    "repeat text online",
    "duplicate text tool",
    "repeat string multiple times",
    "copy text many times",
    "text multiplier",
    "repeat words generator",
    "bulk text generator",
    "newline text generator",
    "string repeat tool"
  ],
  tags: ["text", "utility"],
  component: () => import("./TextRepeaterTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "How do I repeat text multiple times?",
      answer: "Enter your text, set the repeat count, choose a separator (like space or newline), and the tool instantly generates the repeated output."
    },
    {
      question: "What separators can I use?",
      answer: "You can use presets like newline, space, comma, or define any custom separator such as symbols or words."
    },
    {
      question: "Can I create a list with each line on a new row?",
      answer: "Yes. Use the newline (\\n) separator to generate vertical lists with each repetition on its own line."
    },
    {
      question: "Is there a maximum repeat limit?",
      answer: "The tool caps output to prevent browser slowdowns, but you can still generate large repeated text blocks efficiently."
    },
    {
      question: "Can I copy the generated text?",
      answer: "Yes. You can copy the full output instantly for use in documents, code, or testing."
    },
    {
      question: "Is this tool useful for testing?",
      answer: "Yes. Developers often use it to generate large input strings for stress testing forms, APIs, or databases."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, it works completely offline."
    },
    {
      question: "Is my data private?",
      answer: "Yes. All processing happens locally in your browser with no data sent to a server."
    }
  ],

  howItWorks:
    "Enter your text, choose how many times to repeat it, and set a separator like space, comma, or newline. The repeated output is generated instantly in your browser.",

  relatedTools: ["lorem-ipsum", "text-diff"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-26",
};