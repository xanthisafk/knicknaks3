import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text ↔ ASCII Codes",
  slug: "text-to-ascii",
  description: "Map characters to their decimal ASCII / Unicode code values and back.",
  category: "encoders",
  icon: "🔤",
  keywords: ["ascii", "text", "code", "decimal", "character", "encode", "decode", "codepoint"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToAsciiTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "ASCII vs Unicode?", answer: "ASCII covers 128 characters (0–127). This tool shows full Unicode code points for any character including emoji." },
  ],
  howItWorks: "Enter text to see each character's decimal code, or enter a comma-separated list of codes to decode.",
  relatedTools: ["text-to-hex", "unicode-inspector"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
