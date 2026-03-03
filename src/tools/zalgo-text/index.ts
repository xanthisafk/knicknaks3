import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Zalgo Text Generator",
  slug: "zalgo-text",
  description: "Corrupt your text by adding creepy, glitchy Zalgo combining Unicode diacritic marks instantly.",
  longDescription: "Summon the void into your standard text box. The Zalgo Text Generator overlays your standard alphabetic text input with chaotic, random layers of invisible Unicode combining algorithms. It simulates extreme graphical glitches, horror aesthetics, and 'cursed' computer crashes. Perfect for Halloween, gaming usernames, and disturbing Discord messages.",
  category: "text",
  icon: "👾",
  keywords: ["zalgo text generator", "glitch text maker", "creepy cursed text", "corrupted string generator", "demonic font copy paste", "weird unicode symbols", "scary text effect"],
  tags: ["text", "fun", "unicode"],
  component: () => import("./ZalgoTextTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What exactly is Zalgo text?", answer: "Zalgo text exploits 'combining diacritical marks' in the Unicode standard. These are mathematical symbols designed to be attached to normal letters (like adding an accent above an 'e'). By stacking dozens of them randomly above and below a single character, it creates a terrifying vertical visual glitch." },
    { question: "Will Zalgo text break my computer or website?", answer: "No, it's completely safe! It looks like a virus or a computer crash, but it is fundamentally just standard text. However, extreme Zalgo rendering may temporarily lag significantly older mobile phone processors, and some websites have filters that strip the effect out." },
    { question: "How do I remove the effect from copied text?", answer: "Because it relies on stacked diacritics, most basic 'remove text formatting' or 'URL encoding' tools will instantly strip the Zalgo corruption, reverting the text back to its clean foundation." }
  ],
  howItWorks: "Type your standard text into the main input box. Use the slider to dictate the 'intensity' of the corruption (how heavily the diacritics are stacked). The corrupted output displays instantly, ready to be highlighted and copied.",
  relatedTools: ["upside-down-text", "fancy-text-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
