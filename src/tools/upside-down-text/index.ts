import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Upside Down Text",
  slug: "upside-down-text",
  description: "Instantly flip your text upside down using specialized Unicode character equivalents.",
  longDescription: "Create engaging social media posts, fun jokes, or unique gaming usernames. The Upside Down Text generator maps your standard alphabetical input to visually inverted Unicode character equivalents, giving the perfect optical illusion of an inverted string. Guaranteed to make your friends tilt their phones.",
  category: "text",
  icon: "🙃",
  keywords: ["upside down text generator", "flip text upside down", "mirror text online", "inverted letters copy paste", "unicode flip letters", "make text read upside down", "funny social media font"],
  tags: ["text", "fun", "unicode"],
  component: () => import("./UpsideDownTextTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "How does the flipping illusion actually work?", answer: "We don't actually rotate your screen! The tool intelligently swaps your standard English letters (like 'h') for specific, obscure math and foreign Unicode characters that look structurally inverted (like 'ɥ')." },
    { question: "Can I paste this flipped text anywhere?", answer: "Yes! Because the output consists entirely of standard Unicode characters, you can successfully paste the illusion into Twitter, Discord, Instagram, or text messages without the formatting breaking." },
    { question: "Does every letter have an upside down equivalent?", answer: "Most alphabetic characters and standardized numbers have recognizable inverted cousins. However, certain complex punctuation marks lack a perfect Unicode match and are only roughly approximated." }
  ],
  howItWorks: "Type your joke or message into the main input field. As you type, the engine instantly matches your standard string against a large dictionary array of inverted Unicode characters, displaying the flipped result below.",
  relatedTools: ["fancy-text-generator", "zalgo-text", "reverse-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
