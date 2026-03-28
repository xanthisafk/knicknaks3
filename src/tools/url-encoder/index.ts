import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Encoder / Decoder",
  slug: "url-encoder",
  description: "Encode or decode any web URL",
  category: "encoders",
  icon: "🔗",
  keywords: ["url encoder online", "decode url string", "percent encoding tool", "encodeURIComponent tester", "sanitize web link", "url decoder tool", "convert spaces to %20"],
  tags: ["encoding", "web", "url"],

  component: () => import("./UrlEncoderTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What exactly is URL encoding?",
      answer:
        "Also known as percent-encoding, it's a mechanism to safely pass data across the internet. It replaces 'unsafe' characters with a `%` symbol followed by their two-character mathematical hex code. For example, a blank space becomes `%20` and an ampersand `&` becomes `%26`.",
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer:
        "`encodeURI` is used for full URLs, preserving structural characters like `:`, `/`, `?`, and `#`. `encodeURIComponent` is far more aggressive, encoding absolutely everything. It is designed specifically to ensure query parameter string values don't break the parent link.",
    },
    {
      question: "Are my pasted links tracked?",
      answer: "No. The entire conversion execution runs directly inside your active browser utilizing native Javascript functions. The data never interacts with an external server."
    }
  ],

  howItWorks:
    "Paste your raw text or existing URL into the primary input field. Select the toggle between 'Encode' or 'Decode' operations. Choose your desired strictness level (Component vs Full URI), and the resulting string will instantly update below.",

  relatedTools: ["base64", "html-entities", "url-builder"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};
