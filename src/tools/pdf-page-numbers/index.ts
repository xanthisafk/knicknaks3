import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Add Page Numbers",
  slug: "pdf-page-numbers",
  description: "Automatically add page numbers onto any PDF document",
  longDescription:
    "Properly format long documents by overlaying cleanly styled page numbers directly onto every page of your PDF file. " +
    "You hold full control: choose precise number positioning (headers or footers, left/center/right alignment), configure font sizing, and dictate the exact starting integer. Engineered securely using local browser processing via pdf-lib.",
  category: "pdf",
  icon: "🔢",
  keywords: ["add page numbers to pdf", "insert pdf pagination", "number pdf pages online", "stamp pdf footer numbers", "pdf page number editor", "local pdf numbering tool", "format pdf document pages"],
  tags: ["pdf", "edit"],

  component: () => import("./PdfPageNumbersTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can I choose where the numbers appear?",
      answer: "Yes, our interface allows you to anchor the page numbers cleanly to either the top or bottom margins of the document, and further align them to the left, center, or right edges."
    },
    {
      question: "Is my uploaded document processed securely?",
      answer: "Absolutely. The stamping process executes entirely via client-side JavaScript. Your file is manipulated locally on your machine and is never uploaded across the internet to our servers."
    }
  ],

  howItWorks:
    "Simply upload your target PDF document. Configure the placement settings and determine which integer the count should start from. Click 'Add & Download' to trigger your browser to rapidly stamp every page and export the finished file.",

  relatedTools: ["watermark-pdf", "rotate-pdf", "merge-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
