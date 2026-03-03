import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unlock PDF",
  slug: "unlock-pdf",
  description: "Remove password protection from a PDF if you know the current password.",
  longDescription:
    "Enter the password for a protected PDF and save an unlocked, unencrypted copy. " +
    "All processing is local using pdf-lib.",
  category: "pdf",
  icon: "🔓",
  keywords: ["pdf", "unlock", "decrypt", "remove password", "unprotect"],
  tags: ["pdf", "security"],

  component: () => import("./UnlockPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a password-protected PDF, enter the password, and click Unlock to save a copy without encryption.",

  relatedTools: ["protect-pdf", "pdf-metadata", "merge-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
