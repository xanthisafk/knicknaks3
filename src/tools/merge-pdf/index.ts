import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Merge PDF",
  slug: "merge-pdf",
  description: "Merge PDF files quickly in your browser",
  category: "pdf",
  icon: "📑",
  keywords: [
    "merge pdf",
    "combine pdf files",
    "join pdf",
    "pdf merger online",
    "merge pdf files free",
    "combine multiple pdfs",
    "pdf joiner"
  ],
  tags: ["pdf", "merge"],

  component: () => import("./MergePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Is there a file size limit?",
      answer: "It depends on your device. Most browsers handle large files without issues."
    },
    {
      question: "Are my files uploaded?",
      answer: "No. All merging happens locally in your browser."
    },
    {
      question: "Can I change the file order?",
      answer: "Yes. Drag and drop files to set the order before merging."
    },
    {
      question: "Do I need to install anything?",
      answer: "No. Just open the tool and upload your files."
    },
    {
      question: "Can I merge more than two PDFs?",
      answer: "Yes. You can merge multiple files at once."
    },
    {
      question: "Will the quality change?",
      answer: "No. The original content and quality are preserved."
    },
    // {
    //   question: "Does it work offline?",
    //   answer: "Yes. Once loaded, it can run without internet."
    // },
    {
      question: "Can I use it on mobile?",
      answer: "Yes. It works on modern phones and tablets."
    },
    {
      question: "Is it free to use?",
      answer: "Yes. You can merge PDFs without cost."
    },
    {
      question: "Will it remove anything from my PDFs?",
      answer: "No. It simply combines files without altering content."
    }
  ],

  howItWorks:
    "Upload your PDF files, arrange them in order, then click merge. Download your combined PDF instantly.",

  relatedTools: ["split-pdf", "rotate-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-21",
};