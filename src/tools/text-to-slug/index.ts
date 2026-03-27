import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Slug",
  slug: "text-to-slug",
  description: "Convert text into clean, SEO-friendly URL slugs instantly.",
  category: "text",
  icon: "🔗",
  keywords: [
    "text to slug",
    "slug generator",
    "url slug generator",
    "seo friendly url",
    "convert text to url",
    "slugify string",
    "permalink generator",
    "url friendly string",
    "replace spaces with dashes",
    "sanitize url string",
    "wordpress slug generator",
    "blog url formatter"
  ],
  tags: ["text", "url", "seo", "slug"],
  component: () => import("./TextToSlugTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    {
      question: "What is a URL slug?",
      answer: "A slug is the readable part of a URL that identifies a page using lowercase words separated by hyphens (e.g., 'my-blog-post')."
    },
    {
      question: "Why are slugs important for SEO?",
      answer: "Search engines use URL structure as a ranking signal. Clean, keyword-rich slugs improve readability, indexing, and click-through rates."
    },
    {
      question: "How does this tool format text into a slug?",
      answer: "It lowercases the text, removes special characters, normalizes accented letters, and replaces spaces with a chosen separator like a hyphen."
    },
    {
      question: "Can I use separators other than hyphens?",
      answer: "Yes. You can choose hyphens, underscores, or dots depending on your URL structure preferences."
    },
    {
      question: "What happens to special characters and emojis?",
      answer: "All unsupported characters, including emojis and punctuation, are removed to ensure the slug is URL-safe."
    },
    {
      question: "Does it support non-English characters?",
      answer: "Yes. Accented and foreign characters are normalized into their closest ASCII equivalents when possible."
    },
    {
      question: "Will numbers be preserved?",
      answer: "Yes. Numeric characters (0-9) remain unchanged in the generated slug."
    },
    {
      question: "Can I use this for blog posts and WordPress URLs?",
      answer: "Absolutely. The output is fully compatible with CMS platforms like WordPress, Webflow, and custom sites."
    },
    {
      question: "What is the best separator for SEO?",
      answer: "Hyphens are recommended by Google and are the most widely used separator for SEO-friendly URLs."
    },
    {
      question: "Does this tool store my data?",
      answer: "No. The tool runs entirely in your browser and does not send or store any input data."
    }
  ],
  howItWorks: "Paste or type text to instantly generate a clean URL slug. The tool removes unsafe characters, normalizes text, and formats it for SEO-friendly URLs.",
  relatedTools: ["case-converter", "url-encoder", "text-cleaner"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-27",
};
