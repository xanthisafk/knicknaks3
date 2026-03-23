import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Image to PDF",
  slug: "image-to-pdf",
  description: "Convert images into a single PDF locally in your browser",
  category: "pdf",
  icon: "🖼️",
  keywords: [
    "image to pdf converter",
    "jpg to pdf",
    "png to pdf",
    "photo to pdf",
    "combine images to pdf",
    "local pdf generator"
  ],
  tags: ["pdf", "converter"],

  component: () => import("./ImageToPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Will my images lose quality?",
      answer: "No. Images are embedded as-is without additional compression, preserving their original resolution."
    },
    {
      question: "Are my files uploaded anywhere?",
      answer: "No. Everything runs locally in your browser—no files are sent to any server."
    },
    {
      question: "How many images can I convert at once?",
      answer: "There's no fixed limit, but very large batches may slow down or crash your browser due to memory constraints."
    },
    {
      question: "Can I reorder images before creating the PDF?",
      answer: "Yes. You can drag and drop files to set the exact page order before conversion."
    },
    {
      question: "What file formats are supported?",
      answer: "PNG, JPG, BMP and WebP images are supported."
    },
    {
      question: "Does each image become a separate page?",
      answer: "Yes. Each uploaded image is placed on its own PDF page."
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation is required—everything runs directly in your browser."
    }
  ],

  howItWorks:
    "Upload images, reorder, rotate, and set page size if needed, set a filename, then click convert. A PDF is generated locally with one image per page and downloaded instantly.",

  relatedTools: ["pdf-to-images", "merge-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-19",
  updatedAt: "2026-03-19",
};