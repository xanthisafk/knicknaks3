import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Image to PDF",
  slug: "image-to-pdf",
  description: "Convert images to PDF securely in your browser",
  longDescription:
    "Instantly compile multiple photos or graphics into a clean, shareable PDF document. Upload high-resolution images (PNG, JPG, WebP), easily drag-and-drop to reorder them, and generate a multi-page PDF with exactly one image per page. " +
    "Processing is handled entirely locally using WebAssembly and pdf-lib, ensuring your personal photos are never uploaded or stored on external servers.",
  category: "pdf",
  icon: "🖼️",
  keywords: ["image to pdf converter", "jpg to pdf online", "convert png to pdf", "photo to pdf maker", "combine images to pdf", "secure image converter", "local document creator"],
  tags: ["pdf", "converter"],

  component: () => import("./ImageToPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Will the PDF compress my high-quality images?",
      answer: "No, our tool embeds your images directly into the PDF structure precisely as you upload them, maintaining their original resolution and quality without applying lossy compression."
    },
    {
      question: "Is there a limit to how many photos I can upload?",
      answer: "Technically no, but extremely large batches (e.g., 100+ high-res photos) might cause your web browser to run out of memory since all processing happens locally on your device rather than on a server."
    },
    {
      question: "Are my personal pictures kept private?",
      answer: "Yes. Our client-side architecture means your photos are processed directly on your computer. Nothing is ever transmitted across the internet."
    }
  ],

  howItWorks:
    "Upload a batch of image files. Use the visual drag-and-drop interface to meticulously reorder the sequence if necessary, then click 'Convert'. Your browser directly constructs a PDF stream with one image cleanly fitted per page and triggers an immediate download.",

  relatedTools: ["pdf-to-images", "merge-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
