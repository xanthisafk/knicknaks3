import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Markdown to PDF",
  slug: "markdown-to-pdf",
  description: "Convert Markdown to PDF instantly in your browser",
  longDescription:
    "Turn Markdown into a clean, formatted PDF in seconds. Write or paste your Markdown, preview it live, and export instantly. No installs, no uploads—everything runs locally on your device. Perfect for notes, docs, and reports.",
  category: "pdf",
  icon: "📝",
  keywords: [
    "markdown to pdf",
    "md to pdf",
    "convert markdown to pdf",
    "markdown pdf export",
    "markdown converter",
    "save markdown as pdf",
    "online markdown to pdf"
  ],
  tags: ["pdf", "converter", "markdown"],

  component: () => import("./MarkdownToPdfTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Are my files private?",
      answer: "Yes. Everything runs locally in your browser."
    },
    {
      question: "Does it support GitHub Markdown?",
      answer: "Yes. Tables, code blocks, and task lists are supported."
    },
    {
      question: "Do I need to install anything?",
      answer: "No. Just open the tool and start writing."
    },
    {
      question: "Can I paste Markdown text?",
      answer: "Yes. You can type or paste content directly."
    },
    {
      question: "Is there a live preview?",
      answer: "Yes. You can see formatting before exporting."
    },
    {
      question: "Will formatting stay the same in the PDF?",
      answer: "Yes. The PDF matches the preview output."
    },
    // {
    //   question: "Does it work offline?",
    //   answer: "Yes. Once loaded, it works without internet."
    // },
    {
      question: "Can I use it on mobile?",
      answer: "Yes. It works on modern devices."
    },
    {
      question: "Is it free to use?",
      answer: "Yes. You can convert Markdown to PDF for free."
    },
    {
      question: "What is this best used for?",
      answer: "Notes, documentation, and simple reports."
    }
  ],

  howItWorks:
    "Write or paste Markdown, preview it, then export to PDF instantly.",

  relatedTools: ["markdown-preview", "image-to-pdf", "merge-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  lastUpdated: "2026-03-21",
};