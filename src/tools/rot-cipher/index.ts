import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ROT-N Cipher",
  slug: "rot-cipher",
  description: "Encrypt and decrypt text using a customizable Caesar cipher",
  longDescription: "Protect message spoilers or solve geocaching puzzles using our classic ROT-N Cipher tool. By default, it applies the standard ROT13 algorithm (shifting each letter exactly halfway across the 26-letter alphabet), meaning the exact same tool is used for both encoding and decoding. You can also customize the 'N' shift value to create a custom Caesar cipher.",
  category: "encoders",
  icon: "🔢",
  keywords: ["rot13 decoder online", "caesar cipher translator", "rot n encoder", "shift text cipher", "decode geocaching hint", "spoilers text hide", "rot26 alphabet shift"],
  tags: ["cipher", "encoding", "fun"],
  component: () => import("./RotCipherTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What is ROT13?", answer: "ROT13 is a simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet. Because there are 26 letters in the English alphabet, applying ROT13 twice restores the original text." },
    { question: "Can I use a shift value other than 13?", answer: "Yes! While ROT13 is the default, you can utilize the slider to set a custom 'N' shift value between 1 and 25, turning the tool into a fully functional, classic Caesar cipher." },
    { question: "Does this cipher encrypt numbers and symbols?", answer: "No, standard ROT algorithms strictly apply to alphabetical characters (A-Z and a-z). Numbers, grammatical punctuation, spaces, and emojis remain entirely unaffected by the shift." }
  ],
  howItWorks: "Type your secret message into the input field and select your desired alphabetical shift value using the slider (defaults to 13). The tool will output the ciphered text instantly. To decode a message, simply paste it in and ensure the exact same shift value is selected.",
  relatedTools: ["base64", "hash-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
