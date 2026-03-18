import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Delete PDF Pages",
  slug: "delete-pdf-pages",
  description: "Remove selected pages from a PDF securely in your browser",
  longDescription:
    "Remove unwanted pages from a PDF directly in your browser. Upload your document, choose the pages or ranges you want to delete, and download the cleaned file instantly. " +
    "All processing runs locally, so your files never leave your device.",

  category: "pdf",
  icon: "🗑️",
  keywords: [
    "delete pdf pages online",
    "remove pages from pdf",
    "extract pdf pages",
    "trim pdf document",
    "secure pdf page remover",
    "browser pdf editor",
    "cut out pdf pages"
  ],
  tags: ["pdf", "edit"],

  component: () => import("./DeletePdfPagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I delete pages from a PDF?",
      answer:
        "Upload your PDF, enter the page numbers you want to remove (for example: 2,4,7-10), preview the selection, and download the new PDF."
    },
    {
      question: "Are my sensitive PDFs uploaded anywhere?",
      answer:
        "No. All processing happens locally in your browser using JavaScript. Your PDF never leaves your device and is not uploaded to any server."
    },
    {
      question: "Can I delete multiple pages at once?",
      answer:
        "Yes. Enter multiple page numbers separated by commas, or use ranges like 5-10 to remove several pages at once."
    },
    {
      question: "Can I preview which pages will be deleted?",
      answer:
        "Yes. The page preview shows which pages are marked for deletion so you can visually confirm your selection before processing the PDF."
    },
    {
      question: "Does this work offline?",
      answer:
        "Yes. Once the page loads, the tool can run entirely offline because all PDF processing happens directly in your browser."
    },
    {
      question: "Will the original PDF be modified?",
      answer:
        "No. The original file remains unchanged. The tool generates a new PDF with the selected pages removed."
    },
    {
      question: "Is there a file size limit?",
      answer:
        "There is no strict server limit since processing happens locally, but very large PDFs may be limited by your browser's available memory."
    },
    {
      question: "Which browsers are supported?",
      answer:
        "The tool works in all modern browsers including Chrome, Firefox, Edge, and Safari. Older browsers that do not support modern JavaScript features may not work properly."
    },
    {
      question: "Can I use this tool on mobile devices?",
      answer:
        "Yes. The tool works on modern mobile browsers on Android and iOS, though very large PDFs may perform better on desktop devices."
    },
    {
      question: "Can I edit password-protected PDFs?",
      answer:
        "Password-protected PDFs must be unlocked before they can be processed. Remove the password protection first, then upload the file again."
    },
    {
      question: "How long does it take to remove pages?",
      answer:
        "Processing usually takes only a few seconds depending on the size of the PDF and the number of pages being removed."
    },

  ],

  howItWorks:
    "Upload a PDF file and enter the page numbers or ranges you want to remove (for example: 2, 5-7). The preview highlights the pages that will be deleted so you can confirm your selection. When you click 'Remove', a new PDF is generated instantly with those pages excluded and downloaded to your device.",

  relatedTools: ["split-pdf", "rearrange-pdf", "rotate-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-10",
  lastUpdated: "2026-03-19",
};