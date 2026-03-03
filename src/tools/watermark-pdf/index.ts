import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Watermark PDF",
  slug: "watermark-pdf",
  description: "Secure your documents by adding custom text or image watermarks to PDF pages locally.",
  longDescription:
    "Protect your intellectual property or label document drafts easily. Upload a standard PDF and overlay a heavily customized text watermark on every single page. You have total creative control over the font opacity, diagonal rotation, sizing, and color. All operations execute directly inside your browser.",
  category: "pdf",
  icon: "💧",
  keywords: ["watermark pdf online", "add stamp to pdf", "overlay text on pdf", "brand pdf document", "draft watermark maker", "secure pdf document", "transparent pdf text overlay"],
  tags: ["pdf", "edit"],

  component: () => import("./WatermarkPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },
  
  faq: [
    {
      question: "Will the watermark cover my original text?",
      answer: "No, by default we apply an alpha-transparency (opacity) filter strictly to the watermark layer. This ensures the 'stamp' is clearly visible, while allowing all the original document text beneath it to remain perfectly legible."
    },
    {
      question: "Does the watermark get added to every page?",
      answer: "Yes. The current rendering engine runs a fast loop, automatically calculating and applying the exact same watermark position coordinates onto every single page of your uploaded document."
    }
  ],

  howItWorks:
    "Upload your target PDF document. Type your desired watermark text (e.g. 'CONFIDENTIAL DRAFT'), tweak the opacity slider and angle rotation dials for perfect placement, then click 'Apply & Download' to generate the stamped file.",

  relatedTools: ["pdf-page-numbers", "rotate-pdf", "protect-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
