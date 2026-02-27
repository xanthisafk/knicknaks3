import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Fancy Text Generator",
  slug: "fancy-text-generator",
  description: "Convert text into Unicode stylistic variants — bold, italic, script, fraktur, and more.",
  category: "text",
  icon: "✨",
  keywords: ["fancy", "text", "unicode", "bold", "italic", "script", "fraktur", "stylistic", "font", "social"],
  tags: ["text", "fun", "social", "unicode"],
  component: () => import("./FancyTextGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Will this work everywhere?", answer: "Yes — these use actual Unicode characters, not special fonts, so they render anywhere text is supported." },
  ],
  howItWorks: "Type your text and see all stylistic variants instantly. Click any style to copy it to clipboard.",
  relatedTools: ["upside-down-text", "zalgo-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
