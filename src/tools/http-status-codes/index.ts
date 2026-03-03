import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "HTTP Status Code Reference",
  slug: "http-status-codes",
  description: "Searchable reference guide for all HTTP status codes, complete with descriptions and API usage tips.",
  longDescription: "Stop guessing what '409 Conflict' means. Access a comprehensive, searchable, and fully filterable cheat sheet of every standard HTTP status code. Learn exactly when to use 200 vs 201, investigate obscure 5xx server errors, and improve your REST API design.",
  category: "dev",
  icon: "📋",
  keywords: ["http status codes list", "rest api response codes", "404 vs 500 error", "http code cheat sheet", "developer network reference", "check http status meaning", "api design status code"],
  tags: ["developer", "network", "reference"],
  component: () => import("./HttpStatusCodesTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What do the different categories mean?", answer: "Codes are grouped by their first digit: 1xx are Informational, 2xx mean Success, 3xx dictate Redirection, 4xx imply Client Errors (you did something wrong), and 5xx signify Server Errors (we did something wrong)." },
    { question: "Are these official status codes?", answer: "Yes, our reference primarily covers standard status codes defined by the Internet Engineering Task Force (IETF) in RFCs like RFC 9110, alongside common unofficial codes used by major servers like Nginx or Cloudflare." },
    { question: "When should I use 400 vs 422?", answer: "Use `400 Bad Request` for malformed syntax that the server couldn't parse. Use `422 Unprocessable Entity` when the syntax is mathematically correct, but the underlying data fails semantic business validation rules." }
  ],
  howItWorks: "Quickly locate codes by typing the exact 3-digit number or a descriptive word into the search bar. You can also filter exclusively by category (like 2xx or 4xx). Click on any individual status code card to unpack detailed usage scenarios and best practices.",
  relatedTools: ["url-parser", "url-builder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
