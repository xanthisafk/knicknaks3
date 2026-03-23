import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Protect PDF",
  slug: "protect-pdf",
  description: "Encrypt PDF files with user and owner passwords",
  category: "pdf",
  icon: "🔒",
  keywords: [
    "password protect pdf",
    "encrypt pdf file",
    "lock pdf with password",
    "secure pdf offline",
    "add password to pdf",
    "pdf encryption tool",
    "protect pdf locally"
  ],
  tags: ["pdf", "security", "encryption"],

  component: () => import("./ProtectPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What's the difference between user and owner passwords?",
      answer: "The user password is required to open the PDF. The owner password controls permissions and full access. If not set, it defaults to the user password."
    },
    {
      question: "Can I protect an already encrypted PDF?",
      answer: "Yes. Provide the existing password first, then set new passwords to re-encrypt the file."
    },
    {
      question: "Are my files uploaded anywhere?",
      answer: "No. All encryption happens locally in your browser. Your files and passwords never leave your device."
    }
  ],

  howItWorks:
    "Upload a PDF, set a user password to restrict access, and optionally define an owner password. If the file is already encrypted, enter its current password. Click 'Protect & Download' to save the secured PDF.",

  relatedTools: ["unlock-pdf", "watermark-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-23",
};