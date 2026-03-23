import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF Metadata Editor",
  slug: "pdf-metadata",
  description: "View, edit, or remove PDF metadata such as title, author, subject, and keywords",
  category: "pdf",
  icon: "📋",
  keywords: [
    "pdf metadata editor",
    "edit pdf properties",
    "change pdf author",
    "remove pdf metadata",
    "view pdf metadata",
    "pdf document properties tool",
    "strip pdf metadata",
    "update pdf title author subject",
    "pdf privacy metadata remover"
  ],
  tags: ["pdf", "edit"],

  component: () => import("./PdfMetadataTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Why should I edit or remove PDF metadata?",
      answer: "PDF metadata can include author names, software used, and document details that may not be visible in the content itself. Editing improves organization and searchability, while removing it helps protect privacy before sharing files."
    },
    {
      question: "What metadata fields can I edit?",
      answer: "You can modify common fields including title, author, subject, keywords, and creator (the application used to generate the PDF)."
    },
    {
      question: "Can I completely remove metadata?",
      answer: "Yes. Simply clear any field and save the file. The tool will overwrite the metadata with empty values in the exported PDF."
    },
    {
      question: "Are my PDF files uploaded to a server?",
      answer: "No. All processing happens locally in your browser using client-side code. Your files never leave your device."
    },
    {
      question: "Does this work with encrypted or protected PDFs?",
      answer: "The tool attempts to read PDFs with basic restrictions, but strongly encrypted or password-protected files may not load or save correctly."
    },
    {
      question: "Will editing metadata affect the content of my PDF?",
      answer: "No. Only the document properties are modified. The visible content, layout, and pages remain unchanged."
    },
    {
      question: "How are keywords handled?",
      answer: "Keywords should be entered as a comma-separated list. The tool automatically parses and formats them into the correct PDF metadata structure."
    },
    {
      question: "Does it work offline?",
      answer: "Yes. If installed as a Progressive Web App (PWA), the tool runs entirely offline with full functionality."
    }
  ],

  howItWorks:
    "Upload a PDF file and the tool will parse its embedded metadata using a client-side PDF processing library. The detected fields are displayed in editable inputs. After making changes, saving regenerates the PDF with updated metadata while preserving the original document structure.",

  relatedTools: ["protect-pdf", "merge-pdf", "watermark-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-22",
};