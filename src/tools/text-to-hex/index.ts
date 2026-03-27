import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Hex",
  slug: "text-to-hex",
  description: "Convert text to hex and decode hex to readable text instantly.",
  category: "encoders",
  icon: "🔡",
  keywords: [
    "text to hex",
    "hex to text",
    "string to hex",
    "hexadecimal converter",
    "utf8 to hex",
    "hex encoder decoder",
    "ascii to hex",
    "hex string converter",
    "encode text to hex",
    "decode hex string",
    "base16 converter",
    "hex bytes generator"
  ],
  tags: ["encoding", "developer", "hex", "converter"],
  component: () => import("./TextToHexTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "What format does the hex output use?",
      answer: "Each character is converted into a two-digit hexadecimal byte. By default, bytes are separated by spaces (e.g., '48 65 6C 6C 6F')."
    },
    {
      question: "Can I remove spaces or change separators?",
      answer: "Yes. You can format the output using spaces, commas, colons, or no separator at all depending on your use case."
    },
    {
      question: "Does it support UTF-8 and emojis?",
      answer: "Yes. Multi-byte UTF-8 characters like emojis and non-Latin scripts are encoded into multiple hex bytes correctly."
    },
    {
      question: "Can I decode hex back to text?",
      answer: "Yes. Switch to decode mode and paste your hex string. The tool will convert it back into readable text instantly."
    },
    {
      question: "What prefixes are supported?",
      answer: "You can add common prefixes like 0x, \\x, or % (URL encoding style) to each byte."
    },
    {
      question: "Is this the same as ASCII to hex?",
      answer: "ASCII is supported, but this tool also handles full UTF-8 encoding, making it more flexible than basic ASCII converters."
    },
    {
      question: "Why are some characters multiple bytes?",
      answer: "Characters outside the basic ASCII range use UTF-8 encoding, which represents them using multiple hexadecimal bytes."
    },
    {
      question: "Can I paste formatted hex strings?",
      answer: "Yes. The decoder accepts spaces, commas, colons, and prefixed formats like 0x48 or \\x48."
    },
    {
      question: "Is this tool safe to use offline?",
      answer: "Yes. The tool runs entirely in your browser and does not send data to any server."
    },
    {
      question: "What is hex encoding used for?",
      answer: "Hex encoding is commonly used in low-level programming, debugging, networking, cryptography, and data inspection."
    }
  ],
  howItWorks: "Enter text to encode it into hexadecimal bytes, or paste a hex string to decode it back into readable text. Supports UTF-8, prefixes, and multiple formatting styles.",
  relatedTools: ["text-to-binary", "text-to-ascii", "base-converter", "url-encoder"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-27",
};
