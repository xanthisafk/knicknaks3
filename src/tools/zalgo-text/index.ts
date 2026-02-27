import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Zalgo Text Generator",
  slug: "zalgo-text",
  description: "Add glitchy, creepy combining Unicode diacritics to any text for a corrupted effect.",
  category: "text",
  icon: "👾",
  keywords: ["zalgo", "glitch", "creepy", "text", "diacritics", "unicode", "corrupt", "horror"],
  tags: ["text", "fun", "unicode"],
  component: () => import("./ZalgoTextTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is Zalgo text?", answer: "Zalgo text uses combining Unicode characters that stack above, below, and through base characters creating a chaotic visual effect." },
  ],
  howItWorks: "Type your text, adjust the intensity level, and copy the glitchy result.",
  relatedTools: ["upside-down-text", "fancy-text-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
