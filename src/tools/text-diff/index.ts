import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Diff",
  slug: "text-diff",
  description: "Compare two text blocks side-by-side and highlight additions, deletions, and unchanged lines.",
  category: "text",
  icon: "📊",
  keywords: ["diff", "compare", "text", "difference", "changes", "additions", "deletions", "merge"],
  tags: ["text", "compare", "developer"],
  component: () => import("./TextDiffTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "How does the diff work?", answer: "Uses the Myers diff algorithm (line-by-line) to find the shortest edit script between two text blocks." },
    { question: "Can I compare code?", answer: "Yes — any plain text including code, config files, or prose works perfectly." },
  ],
  howItWorks: "Paste text into both panels. Changes are highlighted instantly — green for additions, red for deletions, white for unchanged lines.",
  relatedTools: ["find-replace", "deduplicate-lines"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
