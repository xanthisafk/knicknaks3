import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Merge PDF",
  slug: "merge-pdf",
  description: "Securely combine multiple PDF files into a single, continuous document directly in your browser.",
  longDescription:
    "Effortlessly consolidate your documents by uploading two or more PDF files and merging them together into one unified file. " +
    "Utilize our drag-and-drop interface to manually reorder files before executing the merge. All processing happens 100% locally using pdf-lib—ensuring strict privacy since no data ever leaves your device.",
  category: "pdf",
  icon: "📑",
  keywords: ["merge pdf online", "combine multiple pdfs", "join pdf files", "concatenate pdf documents", "secure local pdf merger", "pdf binder tool", "browser pdf compiler"],
  tags: ["pdf", "merge"],

  component: () => import("./MergePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Is there a maximum file size limit?",
      answer: "There is no hardcoded server limit since all merging leverages your device's local memory. Generally, most modern browsers handle merging documents totaling up to ~100 MB without performance degradation.",
    },
    {
      question: "Are my sensitive documents uploaded to a server?",
      answer: "No. Unlike traditional online PDF tools, this application processes the entire merge operation locally within your browser tab using JavaScript. Your files are never uploaded, ensuring complete data sovereignty.",
    },
    {
      question: "Can I choose the order in which the files are merged?",
      answer: "Yes, after uploading your initial batch of files, you can visually drag and drop the file list items to perfectly arrange their sequential order before clicking the 'Merge' button."
    }
  ],

  howItWorks:
    "Drop or manually select multiple PDF files into the designated dropzone. Visually drag and reorder them into your preferred sequence, then click 'Merge'. " +
    "Your browser will stitch them together instantly and automatically trigger the download of your new, combined PDF document.",

  relatedTools: ["split-pdf", "rotate-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
