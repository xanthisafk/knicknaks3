import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Compress PDF",
  slug: "compress-pdf",
  description: "Reduce PDF file size by re-encoding — all in your browser.",
  longDescription:
    "Upload a PDF and save a stripped-down copy. Removes redundant objects and re-serializes for a smaller file. " +
    "All processing is local using pdf-lib.",
  category: "pdf",
  icon: "📦",
  keywords: ["pdf", "compress", "reduce", "shrink", "optimize", "smaller"],
  tags: ["pdf", "optimize"],

  component: () => import("./CompressPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How much smaller will my PDF get?",
      answer: "Results vary. PDFs with redundant metadata or embedded objects benefit most. Heavily compressed PDFs may see little change.",
    },
  ],

  howItWorks:
    "Upload a PDF — the tool re-encodes it by copying all pages to a fresh document, stripping unnecessary embedded data.",

  relatedTools: ["merge-pdf", "image-to-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
