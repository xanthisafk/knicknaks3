import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Upside Down Text Generator",
  slug: "upside-down-text",
  description: "Flip text upside down instantly.",
  category: "text",
  icon: "🙃",
  status: "new",
  keywords: [
    "upside down text generator",
    "flip text upside down",
    "upside down font copy paste",
    "invert text online",
    "mirror text generator",
    "unicode upside down letters",
    "reverse and flip text",
    "funny text generator",
    "social media text effects",
    "upside down writing tool"
  ],
  tags: ["text", "unicode", "generator", "fun"],
  component: () => import("./UpsideDownTextTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "What is an upside down text generator?",
      answer: "It converts normal text into upside down Unicode characters so it appears flipped when read."
    },
    {
      question: "How does upside down text work?",
      answer: "Each character is replaced with a visually inverted Unicode equivalent, then the string is reversed."
    },
    {
      question: "Can I copy and paste upside down text?",
      answer: "Yes, the output uses standard Unicode so it works on most apps, browsers, and social platforms."
    },
    {
      question: "Does this work on mobile devices?",
      answer: "Yes, you can generate and paste flipped text on iOS and Android without issues."
    },
    {
      question: "Is this the same as mirrored text?",
      answer: "Not exactly. Upside down text flips vertically, while mirrored text flips horizontally."
    },
    {
      question: "Why do some characters not flip perfectly?",
      answer: "Unicode doesn't have exact inverted versions for every symbol, so some are approximations."
    },
    {
      question: "Can I use upside down text on social media?",
      answer: "Yes, it works on platforms like Instagram, Twitter (X), TikTok, and Discord."
    },
    {
      question: "Does it support numbers and punctuation?",
      answer: "Most numbers and common punctuation are supported, though a few may look slightly different."
    },
    {
      question: "Is this tool free to use?",
      answer: "Yes, it's completely free with no limits."
    }
  ],
  howItWorks: "Enter text, and the tool replaces each character with an upside down Unicode equivalent, then reverses the string to create the flipped effect.",
  relatedTools: ["fancy-text-generator", "zalgo-text", "reverse-text"],
  schemaType: "WebApplication",
  createdAt: "2026-03-04",
  launchedAt: "2026-03-04",
  updatedAt: "2026-03-29",
};
