import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Diff Checker",
  slug: "text-diff",
  description: "Compare two texts side-by-side and highlight differences instantly.",
  category: "text",
  icon: "⚖",
  keywords: [
    "text diff checker",
    "compare text online",
    "find differences between two texts",
    "diff checker side by side",
    "compare two files text",
    "code diff tool",
    "text comparison tool",
    "online diff viewer",
    "check text changes",
    "difference between two strings"
  ],
  tags: ["text", "compare", "developer"],
  component: () => import("./TextDiffTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "How does this text diff checker work?",
      answer: "It uses a diff algorithm to compare two inputs and highlight insertions, deletions, and modifications in real time."
    },
    {
      question: "Can I compare code with this tool?",
      answer: "Yes. It works well for comparing code, including JSON, HTML, JavaScript, and other plain text formats."
    },
    {
      question: "What type of differences are shown?",
      answer: "The tool highlights added, removed, and changed text, making it easy to spot edits between versions."
    },
    {
      question: "Is this a side-by-side diff viewer?",
      answer: "Yes. It displays both versions next to each other with synchronized scrolling for easy comparison."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. All comparisons run locally in your browser. No text is uploaded or stored."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. After loading or installing as a PWA, you can compare text without an internet connection."
    },
    {
      question: "Can I copy the diff result?",
      answer: "Yes. You can copy both original and modified text with a single click."
    },
    {
      question: "What algorithm is used for diffing?",
      answer: "The tool is based on a Myers diff-style algorithm, optimized for detecting minimal changes between two text inputs."
    }
  ],

  howItWorks:
    "Paste original text on the left and modified text on the right. The tool instantly highlights differences side-by-side with color-coded changes. Everything runs locally in your browser.",

  relatedTools: ["find-replace", "deduplicate-lines"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-26",
};