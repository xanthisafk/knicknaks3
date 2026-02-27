import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Universal Base Converter",
  slug: "base-converter",
  description: "Convert numbers between any base (2-36) — binary, octal, decimal, hexadecimal, and more.",
  category: "encoders",
  icon: "🔢",
  keywords: ["base", "convert", "binary", "hex", "octal", "decimal", "number", "radix"],
  tags: ["encoding", "math", "developer"],
  component: () => import("./BaseConverterTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What bases are supported?", answer: "Any base from 2 (binary) to 36. Common bases include 2 (binary), 8 (octal), 10 (decimal), and 16 (hexadecimal)." },
  ],
  howItWorks: "Enter a number in any base and instantly see its representation in all other common bases, plus any custom base.",
  relatedTools: ["rot-cipher", "base64"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
