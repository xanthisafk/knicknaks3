import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Builder",
  slug: "url-builder",
  description: "Assemble a URL from parts — protocol, host, path, query params — with live output and copy.",
  category: "dev",
  icon: "🏗️",
  keywords: ["url", "build", "assemble", "query", "params", "construct", "link", "api"],
  tags: ["developer", "network"],
  component: () => import("./UrlBuilderTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is URL encoding?", answer: "Special characters in query strings are percent-encoded so they don't break the URL structure." },
  ],
  howItWorks: "Fill in the URL parts, add query parameters with the + button, and copy the constructed URL.",
  relatedTools: ["url-parser", "url-encoder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
