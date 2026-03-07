import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Split PDF",
  slug: "split-pdf",
  description: "Split a large PDF into smaller ones",
  longDescription:
    "Divide massive PDF documents into smaller, manageable files without relying on external cloud servers. Upload your PDF and specify exactly which pages or page ranges you wish to extract. " +
    "You can save the precise selection as one new merged PDF, or explode it into a ZIP file of individual pages. Completely private and powered by local WebAssembly.",
  category: "pdf",
  icon: "✂️",
  keywords: ["split pdf online", "extract pdf pages", "divide pdf file", "cut pdf pages", "separate pdf pages online", "save one page from pdf", "local pdf splitter"],
  tags: ["pdf", "split"],

  component: () => import("./SplitPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can I extract non-consecutive pages?",
      answer: "Yes! Enter comma-separated page formats or ranges like '1, 3, 5-8' to quickly cherry-pick specific pages from a long document.",
    },
    {
      question: "Is there a file size limit for splitting?",
      answer: "Because the parsing is performed entirely by your computer's RAM rather than a remote server, limits depend entirely on your local hardware. Most modern browsers can easily split 100MB+ documents in seconds."
    }
  ],

  howItWorks:
    "Upload the master PDF. Enter the precise page numbers you want to extract into the input field (e.g., '1-3, 5, 7-10'). Choose whether to bundle the output as a single new PDF or export them individually, then click 'Extract'.",

  relatedTools: ["merge-pdf", "rotate-pdf", "delete-pdf-pages"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
