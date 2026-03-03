import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF Metadata Editor",
  slug: "pdf-metadata",
  description: "Securely view and edit PDF metadata tags like title, author, and keywords in your browser.",
  longDescription:
    "Gain complete control over your document's hidden properties. Upload a PDF file to instantly expose and modify underlying metadata fields including the Title, Author, Subject, Creator, Producer tool, and searchable Keywords. " +
    "This tool relies entirely on local WebAssembly processing via pdf-lib, meaning your sensitive documents are securely modified without ever hitting a remote server.",
  category: "pdf",
  icon: "📋",
  keywords: ["pdf metadata editor", "edit pdf properties", "change pdf author name", "view pdf hidden info", "modify pdf title field", "pdf document details tool", "remove pdf metadata track"],
  tags: ["pdf", "edit"],

  component: () => import("./PdfMetadataTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Why should I edit my PDF metadata?",
      answer: "Metadata is used by deeply integrated search systems (like Windows Search or macOS Spotlight) and web scrapers to categorize files. Ensuring accuracy improves SEO and internal document organization. Conversely, stripping personal metadata like 'Author' helps maintain your privacy before sharing."
    },
    {
      question: "Are my documents kept secure during editing?",
      answer: "Yes, 100%. The metadata extraction and re-saving process executes exclusively inside your standard web browser. The document never leaves your personal hardware."
    }
  ],

  howItWorks:
    "Upload any valid PDF document. The tool instantly parses the file and populates editable text fields with any currently existing metadata. Adjust or completely delete the data securely within the fields, then click 'Save' to immediately download your newly modified PDF.",

  relatedTools: ["protect-pdf", "merge-pdf", "watermark-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
