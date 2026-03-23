import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Compress PDF",
  slug: "compress-pdf",
  description: "Make PDF files smaller quickly in your browser",
  category: "pdf",
  icon: "📦",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "make pdf smaller",
    "shrink pdf",
    "pdf compressor online",
    "optimize pdf",
    "small pdf file"
  ],
  tags: ["pdf", "compress"],

  component: () => import("./CompressPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How much can a PDF be compressed?",
      answer: "It depends on the file. Large or unoptimized PDFs usually shrink more than already optimized ones.",
    },
    {
      question: "Is this tool safe to use?",
      answer: "Yes. Your files never leave your device. Everything runs in your browser.",
    },
    {
      question: "Will the quality change?",
      answer: "No. The tool keeps the visual quality the same while reducing file size.",
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation is required. Just open the tool and upload your file.",
    },
    {
      question: "Can I use this on mobile?",
      answer: "Yes. It works on most modern phones and tablets.",
    },
    {
      question: "Is there a file size limit?",
      answer: "Limits depend on your browser and device performance.",
    },
    {
      question: "Does it work offline?",
      answer: "Yes. Once loaded, the tool can run without an internet connection.",
    },
    {
      question: "What kind of PDFs work best?",
      answer: "Files with images, metadata, or extra embedded data usually see better results.",
    },
    {
      question: "Can I compress multiple PDFs?",
      answer: "This version supports one file at a time.",
    },
    {
      question: "Will it remove content from my PDF?",
      answer: "No. It only removes unnecessary data, not actual content.",
    }
  ],

  howItWorks:
    "Upload your PDF and press Compress & Download. The tool rebuilds the file and removes extra data to make it smaller.",

  relatedTools: ["merge-pdf", "image-to-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  launchedAt: "2026-03-03",
  createdAt: "2026-03-03",
  updatedAt: "2026-03-18",
};
