import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rotate PDF Pages",
  slug: "rotate-pdf",
  description: "Fix upside-down PDF documents by rotating pages 90°, 180°, or 270° directly in your browser.",
  longDescription:
    "Instantly correct the orientation of scanned documents without complex software. Upload a PDF to visually rotate all pages globally, or selectively target specific individual pages to turn 90, 180, or 270 degrees. " +
    "This tool utilizes a local WebAssembly port of pdf-lib to process the rotation natively on your device, guaranteeing total privacy for sensitive legal or personal forms.",
  category: "pdf",
  icon: "🔄",
  keywords: ["rotate pdf online", "turn pdf pages", "fix upside down pdf", "change pdf to landscape", "pdf orientation editor", "rotate pdf 90 degrees", "local pdf page flipper"],
  tags: ["pdf", "rotate"],

  component: () => import("./RotatePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can I just rotate one single page in a large document?",
      answer: "Yes, you can target individual pages. While the default setting applies the rotation globally to the entire document, you can specify individual page numbers to correct only the ones that were scanned incorrectly."
    },
    {
      question: "Will rotating reduce the quality of the text or images?",
      answer: "No. The tool modifies the internal orientation metadata vector of the PDF format rather than rasterizing and re-saving the file. 100% of the original visual quality and text searchability is perfectly retained."
    }
  ],

  howItWorks:
    "Upload your PDF file. Select the desired angle of rotation (90° clockwise, 180° upside-down, or 270° counter-clockwise) and choose whether to apply it to all pages or specific ones. Click 'Rotate & Download' to securely save the oriented file.",

  relatedTools: ["merge-pdf", "split-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
