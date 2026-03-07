import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Markdown Previewer",
  slug: "markdown-preview",
  description: "Live side-by-side Markdown editor",
  longDescription: "Write and format documentation rapidly with our real-time Markdown Previewer. Utilizing the highly-performant marked.js library, this tool provides a seamless side-by-side editing experience where raw Markdown syntax is instantly translated into beautifully rendered HTML. Perfect for drafting GitHub READMEs or blog content.",
  category: "text",
  icon: "📄",
  keywords: ["markdown editor online", "live markdown preview", "md to html converter", "github flavored markdown", "real time markdown reader", "write markdown browser", "markdown viewer tool"],
  tags: ["markdown", "text", "writing"],
  component: () => import("./MarkdownPreviewTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What Markdown syntax is supported?", answer: "We support standard CommonMark syntax alongside popular GitHub Flavored Markdown (GFM) extensions, including data tables, strikethrough text, interactive task lists, and automatic URL linking." },
    { question: "Can I export my document as raw HTML code?", answer: "Yes! Once you finish writing your Markdown, simply click the 'Copy HTML' button to immediately copy the fully compiled, production-ready HTML markup to your clipboard." },
    { question: "Are my documents saved automatically?", answer: "No, this tool acts as a stateless scratchpad. Your written text is only held temporarily in your browser tab's active memory and is not persisted to any external database." }
  ],
  howItWorks: "Begin typing standard Markdown syntax in the left-hand editor pane. As you type, the right-hand preview pane automatically updates in real-time, displaying exactly how your structured formatting (headers, bolding, lists) will eventually render on the web.",
  relatedTools: ["word-counter", "lorem-ipsum"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
