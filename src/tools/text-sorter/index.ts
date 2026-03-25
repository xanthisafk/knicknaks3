import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Sorter",
  slug: "text-sorter",
  description: "Sort text lines alphabetically, numerically, by length, or shuffle instantly.",
  category: "text",
  icon: "🔃",
  keywords: [
    "text sorter",
    "sort text online",
    "alphabetize list",
    "sort lines a to z",
    "sort text by length",
    "numeric list sorter",
    "shuffle list online",
    "reverse text order",
    "organize text lines",
    "alphabetical order tool"
  ],
  tags: ["text", "sorting"],
  component: () => import("./TextSorterTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "How do I sort text alphabetically?",
      answer: "Paste your lines and choose A → Z or Z → A. The tool instantly reorders your text alphabetically."
    },
    {
      question: "Can I sort numbers correctly?",
      answer: "Yes. Use the numeric mode to sort values based on actual numbers, so 2 comes before 10."
    },
    {
      question: "Can I sort text by length?",
      answer: "Yes. Choose short → long or long → short to organize lines based on character count."
    },
    {
      question: "What does shuffle do?",
      answer: "Shuffle randomizes the order of lines, useful for random selections or testing."
    },
    {
      question: "Does this tool handle large lists?",
      answer: "Yes. It can process large text lists quickly, though performance depends on your browser and device."
    },
    {
      question: "Is my data private?",
      answer: "Yes. All sorting happens locally in your browser. No data is uploaded or stored."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, it works completely offline."
    },
    {
      question: "Can I reverse the order of lines?",
      answer: "Yes. Use Z → A or long → short modes to reverse sorting order depending on your needs."
    }
  ],

  howItWorks:
    "Paste your text (one item per line), select a sorting mode like alphabetical, numeric, length, or shuffle, and instantly get the sorted result. Runs entirely in your browser.",

  relatedTools: ["deduplicate-lines", "case-converter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-26",
};
