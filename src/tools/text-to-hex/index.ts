import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text ↔ Hex",
  slug: "text-to-hex",
  description: "Convert text to hexadecimal UTF-8 values and back, with custom delimiter support.",
  category: "encoders",
  icon: "🔡",
  keywords: ["hex", "text", "hexadecimal", "encode", "decode", "convert", "utf8", "bytes"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToHexTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What delimiter is used?", answer: "By default a space separates hex bytes, but you can use any delimiter like a comma or colon." },
    { question: "Is it UTF-8?", answer: "Yes — multibyte characters produce multiple hex bytes." },
  ],
  howItWorks: "Enter text to get hex, or enter hex values to decode back to text. Bidirectional conversion.",
  relatedTools: ["text-to-binary", "text-to-ascii", "base-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
