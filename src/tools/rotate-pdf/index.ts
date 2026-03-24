import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rotate PDF Pages",
  slug: "rotate-pdf",
  description: "Rotate PDF pages instantly in your browser. No upload required.",
  category: "pdf",
  icon: "🔄",
  keywords: [
    "rotate pdf",
    "rotate pdf online",
    "rotate pdf pages free",
    "fix upside down pdf",
    "change pdf orientation",
    "rotate scanned pdf",
    "pdf rotate 90 degrees",
    "turn pdf landscape portrait",
    "browser pdf editor",
    "offline pdf rotate tool"
  ],
  tags: ["pdf", "rotate"],

  component: () => import("./RotatePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I rotate a PDF page?",
      answer: "Upload your file, select a page, and rotate it 90°, 180°, or 270°. You can apply changes to individual pages or the entire document before downloading."
    },
    {
      question: "Can I rotate only specific pages?",
      answer: "Yes. Each page can be rotated independently, making it easy to fix only the pages that are misaligned."
    },
    {
      question: "Will rotating a PDF reduce quality?",
      answer: "No. The tool adjusts page rotation metadata without re-rendering content, so text and images remain lossless and fully searchable."
    },
    {
      question: "Is this PDF rotator secure?",
      answer: "Yes. All processing happens locally in your browser. Your files are never uploaded or stored on any server."
    },
    {
      question: "Does this work offline?",
      answer: "Yes. After installing the app as a PWA, you can rotate PDFs entirely offline with no internet connection."
    },
    {
      question: "Can I rotate scanned PDFs?",
      answer: "Yes. Scanned PDFs can be rotated just like digital files, correcting sideways or upside-down pages instantly."
    },
    {
      question: "What rotation angles are supported?",
      answer: "You can rotate pages by 90°, 180°, or 270° in either direction."
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation is required for basic use. For offline access, you can install the app as a Progressive Web App (PWA)."
    }
  ],

  howItWorks:
    "Upload your PDF, rotate any page or all pages by 90°, 180°, or 270°, then download the updated file instantly. All processing runs locally in your browser.",

  relatedTools: ["merge-pdf", "split-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};