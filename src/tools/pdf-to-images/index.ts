import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF to Images",
  slug: "pdf-to-images",
  description: "Convert PDF files to images in your browser",
  longDescription:
    "Extract and save individual pages from any PDF document as standard image files. Choose your preferred output extension (crisp PNG or compressed JPG) and dictate the exact rendering resolution scale. " +
    "This tool leverages the powerful pdfjs-dist library to render vector pages into pixels entirely locally. Your confidential documents are never uploaded to any external server.",
  category: "pdf",
  icon: "🖼️",
  keywords: ["pdf to image converter", "pdf to png extract", "convert pdf to jpg online", "save pdf page as picture", "high resolution pdf to image", "local pdf rasterizer", "extract photos from pdf"],
  tags: ["pdf", "converter"],

  component: () => import("./PdfToImagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Are my documents kept secure?",
      answer: "Yes, 100%. The conversion process happens entirely within your device's web browser memory. No files are ever transmitted or saved to external servers."
    },
    {
      question: "Can I adjust the quality of the output images?",
      answer: "Yes, before converting, you can adjust the 'Resolution Scale' multiplier to generate significantly higher definitions than standard web resolution, which is perfect for printing."
    }
  ],

  howItWorks:
    "Upload your target PDF file. Select your desired image format (PNG or JPG) and adjust the resolution scaling factor. Click 'Convert' to trigger the browser to render each page into an individual canvas, eventually packaging them into a downloadable ZIP file.",

  relatedTools: ["image-to-pdf", "split-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
