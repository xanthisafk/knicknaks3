import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Split PDF",
  slug: "split-pdf",
  description: "Extract specific pages or split a PDF into individual files, entirely in your browser.",
  longDescription:
    "Upload a PDF and select which pages to extract. Download them as a single PDF or individual files. " +
    "All processing is local using pdf-lib.",
  category: "pdf",
  icon: "✂️",
  keywords: ["pdf", "split", "extract", "pages", "separate", "cut"],
  tags: ["pdf", "split"],

  component: () => import("./SplitPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can I extract non-consecutive pages?",
      answer: "Yes! Enter page ranges like '1,3,5-8' to extract specific pages.",
    },
  ],

  howItWorks:
    "Upload a PDF, enter the pages you want (e.g. 1-3, 5, 7-10), and click Extract. " +
    "The selected pages will be saved as a new PDF.",

  relatedTools: ["merge-pdf", "rotate-pdf", "delete-pdf-pages"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
