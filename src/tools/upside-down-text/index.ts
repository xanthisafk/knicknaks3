import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Upside Down Text",
  slug: "upside-down-text",
  description: "Flip text upside down using Unicode equivalents — perfect for fun social media posts.",
  category: "text",
  icon: "🙃",
  keywords: ["upside", "down", "flip", "text", "unicode", "mirror", "fun", "social"],
  tags: ["text", "fun", "unicode"],
  component: () => import("./UpsideDownTextTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "How does it work?", answer: "Each character is mapped to a Unicode equivalent that looks like it's flipped — e.g. 'a' becomes 'ɐ', 'b' becomes 'q'." },
    { question: "Does all text have an upside-down version?", answer: "Most letters, numbers, and punctuation have Unicode equivalents. Some symbols are approximated." },
  ],
  howItWorks: "Type or paste text. The upside-down version appears instantly and can be copied to clipboard.",
  relatedTools: ["fancy-text-generator", "zalgo-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
