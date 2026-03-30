import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Watermark PDF",
  slug: "watermark-pdf",
  description: "Add a watermark to your PDF file",
  category: "pdf",
  icon: "©️",
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
  createdAt: "2026-03-04",
  launchedAt: "2026-03-04",
  updatedAt: "2026-03-30",
};
