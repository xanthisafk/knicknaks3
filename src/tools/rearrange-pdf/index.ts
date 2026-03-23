import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rearrange PDF Pages",
  slug: "rearrange-pdf",
  description: "Reorder PDF pages visually and download instantly",
  category: "pdf",
  icon: "🔀",
  status: "updated",
  keywords: [
    "rearrange pdf pages",
    "reorder pdf online",
    "change pdf page order",
    "organize pdf pages",
    "sort pdf pages visually",
    "move pdf pages",
    "pdf page organizer"
  ],
  tags: ["pdf", "edit", "pages"],

  component: () => import("./RearrangePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I change the order of pages?",
      answer: "Use the arrow controls on each page preview to move pages left or right until they are in the desired order, then save the file."
    },
    {
      question: "Is there a limit on file size or page count?",
      answer: "Large PDFs may take longer to load or process since everything runs in your browser. Performance depends on your device and available memory."
    },
    {
      question: "Are my files uploaded anywhere?",
      answer: "No. All processing, including thumbnail generation and reordering, happens locally in your browser."
    }
  ],

  howItWorks:
    "Upload a PDF to generate page previews. Adjust the order using the controls on each page, then click 'Save Reordered PDF' to download the updated document.",

  relatedTools: ["split-pdf", "rotate-pdf", "delete-pdf-pages"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-23",
};