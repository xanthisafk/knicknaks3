import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Morse Code",
  slug: "morse-code",
  description: "Accurately encode or decode text to Morse code with built-in Web Audio API tone playback.",
  longDescription: "Learn, translate, and listen to authentic Morse code right in your browser. Our Text to Morse Code converter translates standard English text into classic dots and dashes (and vice versa). Click 'Play' to hear your translated message transmitted audibly via the browser's Web Audio API.",
  category: "encoders",
  icon: "📡",
  keywords: ["morse code translator", "encode text to morse", "decode morse code online", "audio morse code player", "dots and dashes converter", "learn morse code audio", "sos telegraph generator"],
  tags: ["encoding", "audio", "fun"],
  component: () => import("./MorseCodeTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I actually hear the Morse code?", answer: "Yes! Click the Play button to instantly generate and listen to authentic telegraph audio tones utilizing your browser's Web Audio API." },
    { question: "What characters does the translator support?", answer: "The converter seamlessly supports all standard English alphabet letters (A-Z), numerical digits (0-9), and common punctuation marks typically used in modern Morse code." },
    { question: "How does the decoder handle spacing?", answer: "In standard Morse code, letters are separated by a single space, and individual words are separated by a slash (`/`) or three spaces. Ensure proper spacing when pasting code for accurate decoding." }
  ],
  howItWorks: "Type or paste standard text into the top box to immediately see the Morse code equivalent below. Alternatively, paste existing dots and dashes to decode the hidden message. Press the 'Play' button to hear the audio transmission.",
  relatedTools: ["text-to-hex", "base64"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
