import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Compress PDF",
  slug: "compress-pdf",
  description: "Reduce PDF file size securely directly in your browser without uploading to external servers.",
  longDescription:
    "Compress and optimize your PDF files instantly with our secure, client-side PDF compressor. By running entirely in your browser using WebAssembly and pdf-lib, this tool significantly reduces file sizes by stripping redundant objects and re-serializing documents. " +
    "Perfect for preparing large PDFs for email attachments or web hosting without compromising privacy.",
  category: "pdf",
  icon: "📦",
  keywords: ["compress pdf online", "reduce pdf file size", "shrink pdf document", "optimize pdf for web", "secure pdf compression local", "make pdf smaller", "pdf size reducer"],
  tags: ["pdf", "optimize"],

  component: () => import("./CompressPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How much smaller will my PDF get?",
      answer: "Reduction results vary depending on the original file. PDFs burdened with unoptimized images, redundant metadata, or heavily embedded redundant objects benefit the most. Documents that are already highly optimized may see minimal changes.",
    },
    {
      question: "Are my PDF files kept private?",
      answer: "Absolutely. All compression algorithms execute completely locally inside your web browser. Your sensitive documents are never uploaded to our servers, ensuring 100% data privacy."
    },
    {
      question: "Will the compression lower the quality of my PDF?",
      answer: "No visible quality is lost. Our tool utilizes lossless optimization techniques by reconstructing the internal PDF structure and removing unnecessary bloat without degrading the actual content."
    }
  ],

  howItWorks:
    "Drop your bulky PDF into the upload zone. The tool instantly parses the file locally, then re-encodes the entire document by creating a fresh internal structure, effectively stripping out unnecessary embedded bloat before returning a lean, compressed file ready for download.",

  relatedTools: ["merge-pdf", "image-to-pdf", "pdf-metadata"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
