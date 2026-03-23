import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF to Images",
  slug: "pdf-to-images",
  description: "Convert every PDF page into a PNG or JPG — free, instant, and entirely in your browser.",
  category: "pdf",
  icon: "🖼️",
  keywords: [
    "pdf to image converter",
    "pdf to png online free",
    "convert pdf to jpg",
    "extract pages from pdf as images",
    "pdf page to picture",
    "high resolution pdf rasterizer",
    "pdf to jpeg no upload",
    "offline pdf converter",
    "pdf to image without sending to server",
    "batch pdf page export",
    "save pdf as image",
    "pdf screenshot tool",
  ],
  tags: ["pdf", "converter", "images", "png", "jpg", "offline"],

  component: () => import("./PdfToImagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Is my PDF ever uploaded to a server?",
      answer:
        "Never. Every step — loading, rendering, and exporting — runs inside your browser using the PDF.js rendering engine. Your file never leaves your device, which makes this tool safe for confidential contracts, medical records, and any other sensitive documents.",
    },
    {
      question: "Can I use this tool offline?",
      answer:
        "Yes. Install Knicknaks as a Progressive Web App (PWA) by tapping 'Add to Home Screen' on mobile or clicking the install icon in your desktop browser's address bar. Once installed, the PDF to Images tool works with no internet connection at all.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "You can export pages as PNG (lossless, ideal for text-heavy or line-art pages) or JPEG (smaller file size, best for photo-heavy PDFs). Choose PNG when you need crisp edges; choose JPEG when you need to minimise file size.",
    },
    {
      question: "What do the resolution scale options mean?",
      answer:
        "Scale 1x renders pages at screen resolution (~96 DPI), suitable for web thumbnails. Scale 2x doubles the pixel density (~192 DPI), a solid default for sharing and presentations. Scale 3x produces print-grade output (~288 DPI), ideal for high-quality printing or archiving. Higher scales increase both quality and file size.",
    },
    {
      question: "How many pages can I convert at once?",
      answer:
        "There is no hard page limit — the tool processes pages one by one and streams thumbnails into the grid as they render, so you can start downloading early pages while the rest are still being processed. Very large PDFs (100+ pages at 3x scale) may take a minute due to browser memory constraints.",
    },
    {
      question: "Can I download all the images at once?",
      answer:
        "Yes. Once conversion is complete, click 'Download All' to receive a ZIP archive containing every page as a numbered image file, named after your original PDF for easy organisation.",
    },
    {
      question: "Will the images look exactly like the original PDF?",
      answer:
        "Yes, for text and vector graphics. PDF.js faithfully renders fonts, layouts, and vector paths. Raster images embedded in the PDF are reproduced at their original resolution and will not be sharper than they were in the source file.",
    },
    {
      question: "Does this work on mobile?",
      answer:
        "Yes — the tool works on any modern mobile browser. For the best experience, install Knicknaks as a PWA so it behaves like a native app with offline support and a full-screen interface.",
    },
  ],

  howItWorks:
    "Drop or select a PDF. Choose PNG or JPEG and a resolution scale (1x-3x). Click Convert — the browser renders each page onto an HTML canvas using PDF.js and streams the images into the grid as they complete. Download individual pages with a single click, or grab the full ZIP.",

  relatedTools: ["image-to-pdf", "split-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-23",
};