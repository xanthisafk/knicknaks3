import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Merge PDF",
  slug: "merge-pdf",
  description: "Combine multiple PDF files into a single document, all in your browser.",
  longDescription:
    "Upload two or more PDF files and merge them into one document. " +
    "Reorder files before merging. All processing happens locally using pdf-lib — no data leaves your device.",
  category: "pdf",
  icon: "📑",
  keywords: ["pdf", "merge", "combine", "join", "concatenate", "document"],
  tags: ["pdf", "merge"],

  component: () => import("./MergePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Is there a file size limit?",
      answer: "No hard limit — it depends on your device's memory. Most PDFs merge fine up to ~100 MB total.",
    },
    {
      question: "Is my data safe?",
      answer: "Yes. All merging is done locally in your browser. No files are uploaded anywhere.",
    },
  ],

  howItWorks:
    "Drop or select multiple PDF files. Reorder them if needed, then click Merge. " +
    "The merged PDF will be downloaded automatically.",

  relatedTools: ["split-pdf", "rotate-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
