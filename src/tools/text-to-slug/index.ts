import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Slug",
  slug: "text-to-slug",
  description: "Generate clean, SEO-friendly URL",
  longDescription: "Prepare blog post titles and page names for the web. Our Text-to-Slug converter automatically sanitizes messy text inputs into perfectly formatted URL perma-links. It intelligently strips out illegal special characters, collapses continuous white-space into single hyphens, normalizes accented characters, and lowercases the entire string for maximum server compatibility.",
  category: "text",
  icon: "🔗",
  keywords: ["text to slug converter", "url friendly string maker", "generate permalink online", "seo slug generator", "replace spaces with dashes", "sanitize url string", "wordpress slug formatter"],
  tags: ["text", "url", "seo"],
  component: () => import("./TextToSlugTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Why do I need to format titles into 'slugs'?", answer: "Web browsers and backend servers cannot easily interpret spaces or chaotic special characters (like '&' or '#') inside a web address. Slugs solve this by bridging chaotic human language into a strict, readable, hyphenated web path." },
    { question: "What happens to emojis and crazy punctuation?", answer: "The URL conversion strictly prioritizes standard alphanumeric characters (a-z, 0-9). Extraneous punctuation, emojis, and unreadable symbols are automatically scrubbed from the final output." },
    { question: "Does it work maliciously on multiple languages?", answer: "Yes. The tool makes a best-effort attempt to 'normalize' foreign characters, intelligently converting accented letters (like 'é' or 'ü') into their closest readable english equivalents ('e' and 'u')." }
  ],
  howItWorks: "Simply type or paste your rough blog title or messy sentence into the primary text field. The tool instantly lowercases the string, strips out non-url-safe characters, and replaces all remaining spaces with clean hyphens.",
  relatedTools: ["case-converter", "url-encoder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
