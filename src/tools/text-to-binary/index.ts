import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Binary Converter",
  slug: "text-to-binary",
  description: "Convert text to binary and decode binary back to text instantly.",
  category: "encoders",
  icon: "🔟",
  keywords: [
    "text to binary",
    "binary converter",
    "binary to text",
    "string to binary",
    "binary code translator",
    "ascii to binary",
    "decode binary to text",
    "binary string generator",
    "convert text to 0 and 1",
    "binary encoder decoder"
  ],
  tags: ["encoding", "developer"],
  component: () => import("./TextToBinaryTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "How do I convert text to binary?",
      answer: "Enter your text and the tool instantly converts each character into its binary representation using the selected bit width."
    },
    {
      question: "Can I convert binary back to text?",
      answer: "Yes. Paste a binary string into the output field, and it will automatically decode into readable text."
    },
    {
      question: "What is 8-bit vs 16-bit vs 32-bit?",
      answer: "Bit width determines how many binary digits are used per character. 8-bit is standard for ASCII, while 16-bit and 32-bit support larger Unicode values."
    },
    {
      question: "Why are binary values padded with zeros?",
      answer: "Binary values are padded to maintain consistent bit lengths, which is required for proper encoding and decoding."
    },
    {
      question: "What separators can I use?",
      answer: "You can separate binary values with spaces, dashes, or no separator depending on your use case."
    },
    {
      question: "Does this support Unicode characters?",
      answer: "Yes. It uses JavaScript character encoding, so it can handle most Unicode characters, though multi-byte characters may produce longer binary output."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, it works entirely offline."
    },
    {
      question: "Is my data private?",
      answer: "Yes. All conversions happen locally in your browser with no data sent to a server."
    }
  ],

  howItWorks:
    "Type text to convert it into binary using 8, 16, or 32-bit encoding. You can also paste binary to instantly decode it back into text. Everything runs locally in your browser.",

  relatedTools: ["text-to-hex", "text-to-ascii"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-26",
};