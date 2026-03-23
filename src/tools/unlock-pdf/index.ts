import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unlock PDF",
  slug: "unlock-pdf",
  description: "Remove passwords from your PDF files",
  longDescription:
    "Strip encryption and permission restrictions from any locked PDF without taking the risk of uploading it to an unknown server. If you currently possess the password, our Unlock PDF tool utilizes the local WebAssembly power of pdf-lib to rip off the encryption sheath, providing you with a clean, unencumbered file.",
  category: "pdf",
  icon: "🔓",
  status: "beta",
  keywords: ["unlock pdf online", "remove pdf password", "decrypt pdf file", "strip pdf encryption locally", "unprotect pdf document", "remove pdf printing restriction", "bypass pdf lock"],
  tags: ["pdf", "security"],

  component: () => import("./UnlockPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Will this tool crack or recover a lost password?",
      answer: "No. This tool is designed for convenience, not hacking. You must type in the correct 'User' or 'Owner' password. It simply saves you the effort of meticulously typing that password every single time you need to view the document in the future."
    },
    {
      question: "Can anyone else access my unlocked file?",
      answer: "No. The decryption algorithm executes entirely inside the boundaries of your local web browser. Your private documents are never intercepted, copied, or uploaded to any external server architecture."
    }
  ],

  howItWorks:
    "Upload your password-protected PDF. A prompt will require you to input the correct passcode to verify your authority over the file. Once verified, click 'Unlock' to have pdf-lib strip the cryptographic layer and save an open copy to your device.",

  relatedTools: ["protect-pdf", "pdf-metadata", "merge-pdf"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-04",
};
