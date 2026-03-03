import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF Metadata Editor",
  slug: "pdf-metadata",
  description: "View and edit PDF metadata like title, author, and keywords — all in your browser.",
  longDescription:
    "Upload a PDF to inspect its metadata fields (title, author, subject, creator, producer, keywords). " +
    "Edit any field and save. All processing is local using pdf-lib.",
  category: "pdf",
  icon: "📋",
  keywords: ["pdf", "metadata", "title", "author", "properties", "info"],
  tags: ["pdf", "edit"],

  component: () => import("./PdfMetadataTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF to view its metadata. Edit any fields, then click Save to download the updated PDF.",

  relatedTools: ["protect-pdf", "merge-pdf", "watermark-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
