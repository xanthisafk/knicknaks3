import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rearrange PDF Pages",
  slug: "rearrange-pdf",
  description: "Reorder PDF pages",
  longDescription:
    "Fix scrambled documents quickly. Upload your PDF to generate visual page thumbnails, allowing you to seamlessly drag and drop individual pages into a perfectly sequential order. " +
    "This zero-server tool writes the new structural arrangement exclusively utilizing your local device resources via pdf-lib.",
  category: "pdf",
  icon: "🔀",
  status: "updated",
  keywords: ["rearrange pdf pages", "reorder pdf online", "move pdf pages order", "sort pdf document online", "visual pdf page organizer", "drag and drop pdf sorter", "local pdf restructure"],
  tags: ["pdf", "edit"],

  component: () => import("./RearrangePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Is there a limit to how many pages I can rearrange?",
      answer: "Because rendering thumbnails and restructuring the document happens locally on your computer, very massive files (e.g., 500+ pages) may temporarily slow down older web browsers due to memory constraints."
    },
    {
      question: "Is this tool safe for modifying legal or medical documents?",
      answer: "Yes. Due to its rigid serverless design, your uploaded PDF is processed completely offline inside your browser environment, guaranteeing total data residency and privacy."
    }
  ],

  howItWorks:
    "Upload a multi-page PDF document. The tool will parse the file and generate sequence boxes representing each page. Simply click and drag these boxes left or right into your newly desired configuration. Click 'Save PDF' to directly download the manipulated file.",

  relatedTools: ["merge-pdf", "split-pdf", "rotate-pdf", "delete-pdf-pages"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
