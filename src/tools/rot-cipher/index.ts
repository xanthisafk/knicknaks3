import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ROT-N Cipher",
  slug: "rot-cipher",
  description: "Customizable Caesar cipher with a user-defined shift value N (default: ROT13).",
  category: "encoders",
  icon: "🔢",
  keywords: ["rot13", "rot", "cipher", "caesar", "shift", "encode", "decode", "crypto"],
  tags: ["cipher", "encoding", "fun"],
  component: () => import("./RotCipherTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What is ROT13?", answer: "ROT13 shifts each letter by 13 positions. Since the alphabet has 26 letters, applying ROT13 twice returns the original text — it's its own inverse." },
    { question: "Does it work with numbers or symbols?", answer: "No, only A-Z and a-z letters are shifted. Numbers, spaces, and symbols remain unchanged." },
  ],
  howItWorks: "Enter text and set the shift value (1-25). The cipher shifts each letter by N positions in the alphabet. Use the same shift to decode.",
  relatedTools: ["base64", "hash-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
