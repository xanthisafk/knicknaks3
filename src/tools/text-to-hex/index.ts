import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Hex",
  slug: "text-to-hex",
  description: "Translate text to and from hex",
  longDescription: "Translate human-readable phrases into standard base-16 machine representation. This advanced bidirectional Text-to-Hexadecimal converter meticulously translates standard characters and complex multibyte Unicode strings (including emojis) into their precise UTF-8 hex byte sequences. Crucial for web developers, cybersecurity analysts investigating payloads, and computer science students.",
  category: "encoders",
  icon: "🔡",
  keywords: ["text to hex converter", "hexadecimal string encoder", "decode hex to text", "utf8 hex values", "base-16 translator", "string to hex bytes", "hexidecimal to letters"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToHexTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What delimiter should I use to format the output?", answer: "By default, the tool outputs hex bytes separated by a standard Space for maximum readability (e.g., '48 65 6c 6c 6f'). However, you can toggle the settings to use commas, colons (MAC address style), or remove delimiters entirely." },
    { question: "Does this tool support UTF-8 encoding?", answer: "Yes! Unlike basic ASCII converters, this tool utilizes fully Modern Javascript encoding. Multibyte characters, complex foreign languages, and Emojis will correctly produce multiple hexadecimal bytes (e.g., '🔥' becomes 'f0 9f 94 a5')." },
    { question: "Can I decode a Hex sequence back into english?", answer: "Absolutely. Click the 'Decode' toggle and paste your sequence of hex characters. Assuming the hexadecimal syntax is valid, the translated human-readable text will immediately appear." }
  ],
  howItWorks: "Select 'Encode' to type a standard alphabetic phrase and watch it transform into pure base-16 numerical bytes. Select 'Decode' to paste formatted 0-9/A-F hexadecimal sequences to instantly reveal the underlying text.",
  relatedTools: ["text-to-binary", "text-to-ascii", "base-converter"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
