import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unlock PDF",
  slug: "unlock-pdf",
  description: "Remove PDF passwords and restrictions locally",
  category: "pdf",
  icon: "🔓",
  status: "beta",

  keywords: [
    "unlock pdf",
    "remove pdf password",
    "pdf password remover",
    "decrypt pdf online",
    "unlock secured pdf",
    "remove pdf restrictions",
    "unprotect pdf file",
    "unlock pdf without uploading",
    "offline pdf password remover",
    "remove pdf printing restrictions",
    "pdf unlock tool free",
    "decrypt pdf in browser",
    "strip pdf encryption",
    "unlock pdf without server"
  ],

  tags: ["pdf", "security", "tools"],

  component: () => import("./UnlockPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can this tool remove a PDF password?",
      answer:
        "Yes. If you know the correct password, this tool can remove it and save a new unlocked copy of the PDF."
    },
    {
      question: "Can it recover or crack a lost password?",
      answer:
        "No. This tool does not attempt to guess or break passwords. You must provide the correct password to unlock the document."
    },
    {
      question: "Does this remove restrictions like printing or copying?",
      answer:
        "Yes. If the provided password has sufficient permissions, the unlocked file will no longer have restrictions such as printing, copying, or editing limits."
    },
    {
      question: "Is my PDF uploaded to a server?",
      answer:
        "No. All processing happens directly in your browser. Your files never leave your device, ensuring full privacy."
    },
    {
      question: "What types of PDF encryption are supported?",
      answer:
        "Most standard password-protected PDFs (user or owner password) are supported. Some advanced or proprietary encryption methods may not be compatible."
    },
    {
      question: "Will the file quality or content change?",
      answer:
        "No. The tool preserves all pages, layout, and content exactly as-is while removing encryption."
    },
  ],

  howItWorks:
    "Upload your protected PDF, enter the correct password, and instantly generate a new unlocked copy. The tool decrypts the file locally in your browser and removes password restrictions without uploading your data.",

  relatedTools: ["protect-pdf", "merge-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  createdAt: "2026-03-04",
  launchedAt: "2026-03-04",
  updatedAt: "2026-03-29",
};