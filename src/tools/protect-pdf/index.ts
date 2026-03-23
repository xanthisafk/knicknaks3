import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Protect PDF",
  slug: "protect-pdf",
  description: "Secure your PDF documents with passwords and permissions",
  longDescription:
    "Lock down sensitive data strictly inside your browser. Apply secure user passwords (required to even open the file) and owner passwords (used to manage restriction flags). " +
    "Selectively block unauthorized printing, text copying, and document modifications. The heavy cryptographic lifting is entirely handled locally via pdf-lib.",
  category: "pdf",
  status: "beta",
  icon: "🔒",
  keywords: ["password protect pdf online", "encrypt pdf document", "lock pdf file locally", "restrict pdf printing", "prevent pdf copying", "secure pdf maker", "add pdf password"],
  tags: ["pdf", "security"],

  component: () => import("./ProtectPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is the difference between an 'owner' password and a 'user' password?",
      answer: "A User Password requires the recipient to input a passcode merely to open and read the file. An Owner Password locks background permissions—such as preventing the reader from physically printing the document or copying its text to their clipboard."
    },
    {
      question: "Are my strictly confidential files uploaded?",
      answer: "Never. Protecting your files is an offline cryptographic procedure performed natively by your web browser hardware. We cannot read your documents nor log your passwords."
    }
  ],

  howItWorks:
    "Upload the PDF you wish to encrypt. Provide a strong User Password to halt unauthorized opening. Toggle the advanced permission checkboxes to prohibit actions like content extraction or printing, then click 'Protect & Download' to save the locked file.",

  relatedTools: ["unlock-pdf", "watermark-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
