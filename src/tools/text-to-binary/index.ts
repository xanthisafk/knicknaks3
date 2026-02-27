import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text ↔ Binary",
  slug: "text-to-binary",
  description: "Convert text to 8-bit binary representations and back, with space or custom delimiter.",
  category: "encoders",
  icon: "💾",
  keywords: ["binary", "text", "bits", "encode", "decode", "convert", "01", "computer", "ascii"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToBinaryTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Why 8 bits?", answer: "Standard ASCII uses 7 bits, but it's padded to 8 bits (one byte) for alignment. Unicode characters use multiple bytes." },
  ],
  howItWorks: "Enter text to see each character's binary representation, or enter binary to decode back to text.",
  relatedTools: ["text-to-hex", "text-to-ascii"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
