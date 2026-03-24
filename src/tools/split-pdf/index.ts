import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Split PDF",
  slug: "split-pdf",
  description: "Split PDF pages or extract specific page ranges instantly in your browser.",
  category: "pdf",
  icon: "✂️",
  keywords: [
    "split pdf",
    "split pdf online free",
    "extract pages from pdf",
    "separate pdf pages",
    "cut pdf file",
    "pdf page extractor",
    "save specific pages from pdf",
    "divide pdf into pages",
    "pdf splitter browser",
    "offline pdf splitter"
  ],
  tags: ["pdf", "split"],

  component: () => import("./SplitPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I split a PDF file?",
      answer: "Upload your PDF, enter the page numbers or ranges (e.g., 1-3, 5, 7-10), then click split to download a new file with only those pages."
    },
    {
      question: "Can I extract specific pages from a PDF?",
      answer: "Yes. You can select individual pages or ranges using formats like '2, 4, 6-9' to extract exactly what you need."
    },
    {
      question: "Can I split non-consecutive pages?",
      answer: "Yes. The tool supports mixed input like '1, 3, 5-8', allowing flexible page selection."
    },
    {
      question: "Will splitting a PDF reduce quality?",
      answer: "No. Pages are copied directly without re-encoding, so all text, images, and formatting remain unchanged."
    },
    {
      question: "Is this PDF splitter secure?",
      answer: "Yes. All processing happens locally in your browser. Your files are never uploaded or stored."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. After installing as a PWA, you can split PDFs completely offline."
    },
    {
      question: "Is there a file size limit?",
      answer: "Limits depend on your device's memory and browser performance. Most modern systems handle large PDFs (100MB+) without issues."
    },
    {
      question: "Can I split a PDF into individual pages?",
      answer: "Yes. Enter a full range like '1-100' and export selected pages, or run multiple splits to isolate single pages."
    }
  ],

  howItWorks:
    "Upload your PDF, enter page ranges like '1-3, 5, 7-10', and download a new file containing only those pages. Everything runs locally in your browser for speed and privacy.",

  relatedTools: ["merge-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-25",
};
