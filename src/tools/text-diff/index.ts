import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Diff",
  slug: "text-diff",
  description: "Compare two text documents side-by-side to highlight additions, deletions, and differences instantly.",
  longDescription: "A powerful visual file comparison utility right in your browser. Paste two versions of a document, configuration file, or script into the Text Diff tool to instantly identify what changed. It highlights exact line additions (green), deletions (red), and unchanged context (white), perfectly replicating developer diff workflows.",
  category: "text",
  icon: "📊",
  keywords: ["text diff checker online", "compare two files", "find differences in text", "code difference checker", "side by side text comparison", "file revision diff", "check text changes"],
  tags: ["text", "compare", "developer"],
  component: () => import("./TextDiffTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "How does the comparison algorithm work?", answer: "The tool utilizes a high-performance implementation of the Myers Diff Algorithm. It calculates the mathematically shortest path of edit scripts (insertions and deletions) required to transform the original text into the new text." },
    { question: "Can I use this to compare computer code?", answer: "Absolutely. The tool is highly optimized for comparing plain text, which makes it perfect for finding subtle syntax changes in HTML, JSON, Python, or standard configuration files." },
    { question: "Are my sensitive documents sent to a server?", answer: "No. The entire comparison algorithm executes locally inside your web browser. Your private documents are never uploaded or stored." }
  ],
  howItWorks: "Paste your original text block into the left-hand 'Original Data' panel, and your modified text into the right-hand 'New Data' panel. The tool will automatically sync the scrolling and color-code the specific structural changes between the two versions.",
  relatedTools: ["find-replace", "deduplicate-lines"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
