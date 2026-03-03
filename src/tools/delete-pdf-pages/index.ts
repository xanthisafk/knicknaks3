import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Delete PDF Pages",
  slug: "delete-pdf-pages",
  description: "Securely remove selected pages from a PDF document entirely in your browser.",
  longDescription:
    "Edit your PDFs securely by removing unwanted pages locally. Just upload your PDF and define the precise pages or ranges you want to eliminate. The streamlined document is saved as a new PDF file immediately. " +
    "All processing is executed safely on your device using pdf-lib; your files are never uploaded.",
  category: "pdf",
  icon: "🗑️",
  keywords: ["delete pdf pages online", "remove pages from pdf", "extract pdf pages", "trim pdf document", "secure pdf page remover", "browser pdf editor", "cut out pdf pages"],
  tags: ["pdf", "edit"],

  component: () => import("./DeletePdfPagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Are my sensitive PDFs uploaded anywhere?",
      answer: "No. Unlike other online PDF editors, all modifications happen directly via JavaScript inside your web browser. Your document is entirely private and never leaves your machine."
    },
    {
      question: "Can I delete multiple pages at once?",
      answer: "Yes, you can specify multiple individual page numbers separated by commas, or indicate dynamic ranges (like 1-5) to effortlessly delete bulk sections of the file."
    }
  ],

  howItWorks:
    "Upload any PDF document. Type out the exact page numbers or sweeping ranges you wish to discard, then click 'Remove'. " +
    "A newly processed PDF file missing those excluded pages will be automatically generated and prepared for immediate download.",

  relatedTools: ["split-pdf", "rearrange-pdf", "rotate-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
