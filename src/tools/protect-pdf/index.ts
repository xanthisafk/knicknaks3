import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Protect PDF",
  slug: "protect-pdf",
  description: "Add password protection and permissions to a PDF — all in your browser.",
  longDescription:
    "Set a user password (to open) and/or owner password (for restrictions) on a PDF. " +
    "Control printing, copying, and modification permissions. Powered by pdf-lib.",
  category: "pdf",
  icon: "🔒",
  keywords: ["pdf", "protect", "password", "encrypt", "lock", "security"],
  tags: ["pdf", "security"],

  component: () => import("./ProtectPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, set passwords and permission options, then click Protect & Download.",

  relatedTools: ["unlock-pdf", "watermark-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
