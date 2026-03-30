import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Watermark PDF",
  slug: "watermark-pdf",
  description: "Add text or image watermarks to PDF files",
  category: "pdf",
  icon: "©️",
  keywords: [
    "watermark pdf online",
    "add watermark to pdf free",
    "pdf watermark tool",
    "stamp pdf online",
    "add text watermark pdf",
    "image watermark pdf",
    "protect pdf with watermark",
    "confidential pdf stamp",
    "draft watermark pdf",
    "pdf branding tool"
  ],
  tags: ["pdf", "edit"],

  component: () => import("./WatermarkPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I add a watermark to a PDF?",
      answer: "Upload your PDF, choose text or image watermark, adjust opacity, size, and rotation, then download your watermarked file instantly."
    },
    {
      question: "Can I add an image watermark like a logo?",
      answer: "Yes. You can upload a PNG, JPG, or WEBP image and place it as a watermark across all pages."
    },
    {
      question: "Will the watermark appear on every page?",
      answer: "Yes, the watermark is automatically applied to all pages in your PDF."
    },
    {
      question: "Can I control transparency and position?",
      answer: "You can adjust opacity, size, and rotation to precisely control how the watermark appears."
    },
    {
      question: "Is this PDF watermark tool free?",
      answer: "Yes, the tool is completely free to use with no hidden limits."
    },
    {
      question: "Are my PDF files secure?",
      answer: "Yes. Files are processed locally in your browser and are not uploaded to any server."
    },
    {
      question: "Can I add a confidential or draft stamp?",
      answer: "Yes. You can quickly add text like 'CONFIDENTIAL', 'DRAFT', or 'SAMPLE' as a watermark."
    },
    {
      question: "Does watermarking reduce PDF quality?",
      answer: "No, the original content remains unchanged. The watermark is added as a separate overlay layer."
    }
  ],

  howItWorks:
    "Upload a PDF, add a text or image watermark, customize opacity, size, and rotation, then download your stamped PDF in seconds.",

  relatedTools: ["pdf-page-numbers", "rotate-pdf", "protect-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-04",
  launchedAt: "2026-03-04",
  updatedAt: "2026-03-30",
};