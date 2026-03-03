import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text ↔ Binary",
  slug: "text-to-binary",
  description: "Convert text strings to formatted 8-bit binary code accurately (0s and 1s) and back.",
  longDescription: "Translate human-readable phrases into pure machine language. This bidirectional text-to-binary tool perfectly transforms characters into standard 8-bit binary byte blocks padded with zeros. Ideal for developers debugging raw data, students studying computer science, or creating encoded puzzle messages.",
  category: "encoders",
  icon: "💾",
  keywords: ["text to binary converter", "binary code translator", "letters to binary 01", "binary decode to english", "8-bit padding", "binary string generator", "word to byte converter"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToBinaryTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Why is every letter represented by 8 numbers?", answer: "Standard characters use an 8-bit scale called a 'byte'. Even if the numerical value of a character only requires 6 bits (zeros or ones) to calculate, standard architecture pads the front with '0's to align the data perfectly into 8-bit memory blocks." },
    { question: "Can it decode binary back into English text?", answer: "Yes! Simply use the toggle to switch into Decode mode. Paste your sequence of 0s and 1s, and the engine will instantly evaluate the bytes back into human-readable characters." },
    { question: "How does it handle complex symbols or Emojis?", answer: "Modern text utilizes UTF-16 Unicode values. If a complex emoji is evaluated, it will naturally require more bytes of memory to store, resulting in a much longer binary output string for that single visible character." }
  ],
  howItWorks: "To encode, type a standard phrase into the box to see its binary bytes (padded to 8 bits by default). To decode, paste your raw 010101 string sequences separated by spaces to immediately reveal the translated textual phrase.",
  relatedTools: ["text-to-hex", "text-to-ascii"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
