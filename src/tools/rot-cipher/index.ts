import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ROT-N Cipher",
  slug: "rot-cipher",
  description: "Encode and decode text using ROT13 or a custom Caesar cipher shift.",
  category: "encoders",
  icon: "🛞", // wheel emoji. not visible on win-10
  keywords: [
    "rot13 decoder",
    "rot13 encoder",
    "caesar cipher",
    "rot n cipher",
    "shift cipher tool",
    "encode text rot13",
    "decode rot13 online",
    "caesar cipher translator",
    "alphabet shift cipher",
    "geocaching rot13 decoder"
  ],
  tags: ["cipher", "encoding", "security"],
  component: () => import("./RotCipherTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    {
      question: "What is ROT13?",
      answer: "ROT13 is a Caesar cipher that shifts letters by 13 positions. Applying it twice returns the original text."
    },
    {
      question: "Can I use other shift values?",
      answer: "Yes, you can use any shift value to encode or decode text using a standard Caesar cipher."
    },
    {
      question: "Does it affect numbers or symbols?",
      answer: "No, only letters (A–Z) are shifted. Numbers and symbols remain unchanged."
    }
  ],
  howItWorks: "Enter text, choose a shift value, and instantly encode or decode using a ROT-N Caesar cipher.",
  relatedTools: ["base64", "hash-generator"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};
