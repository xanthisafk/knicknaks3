import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Fancy Text Generator",
  slug: "fancy-text-generator",
  description: "Convert normal text into Unicode stylistic variants like bold, cursive, script, and fraktur.",
  longDescription: "Level up your social media bios and posts! The Fancy Text Generator seamlessly transforms standard text strings into an array of aesthetically pleasing Unicode variants. Generate cool cursive, bold, script, and fraktur fonts that you can copy and paste anywhere.",
  category: "text",
  icon: "✨",
  keywords: ["fancy text generator", "unicode text converter", "cool text fonts", "copy paste fonts", "social media bio fonts", "cursive text maker", "bold italic unicode", "fraktur font generator"],
  tags: ["text", "fun", "social", "unicode"],
  component: () => import("./FancyTextGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Will these fonts work on Instagram or Twitter?", answer: "Yes! Because the tool uses actual mathematical Unicode characters instead of CSS styling, these 'fonts' will render correctly across almost all modern platforms, including Instagram, Twitter, Facebook, and Discord." },
    { question: "Are they technically fonts?", answer: "No, they are different standardized Unicode symbols that resemble the alphabet (like mathematical bold or script characters). That is why you can freely copy and paste them as text." },
    { question: "Why do some characters look like empty boxes?", answer: "Some older devices or very specific applications might not fully support the expansive Unicode standard, replacing untranslatable characters with the default 'tofu' box icon." }
  ],
  howItWorks: "Simply type or paste your regular text in the input box. The tool automatically maps your characters to their Unicode equivalents and displays a huge list of stylistic variants instantly. Click any stylized row to copy it directly to your clipboard.",
  relatedTools: ["upside-down-text", "zalgo-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
