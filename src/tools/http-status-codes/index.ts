import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "HTTP Status Code Reference",
  slug: "http-status-codes",
  description: "Searchable, filterable cheat sheet of all HTTP status codes with descriptions and usage tips.",
  category: "dev",
  icon: "📋",
  keywords: ["http", "status", "code", "404", "200", "500", "reference", "rest", "api", "response"],
  tags: ["developer", "network", "reference"],
  component: () => import("./HttpStatusCodesTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What categories exist?", answer: "1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Errors, 5xx Server Errors." },
  ],
  howItWorks: "Search by code number or description, or filter by category. Click any status for full details.",
  relatedTools: ["url-parser", "url-builder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
