import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "String Escaper",
  slug: "string-escaper",
  description: "Quickly escape and unescape text strings for safe use",
  longDescription: "Prevent syntax errors and syntax injection vulnerabilities with our multi-language String Escaper. This tool automatically sanitizes raw text by escaping problematic characters (like quotes, backslashes, and newlines) specifically formatted for JS string literals, JSON values, HTML payloads, CSV data, or SQL database queries.",
  category: "dev",
  icon: "🛡️",
  keywords: ["string escaper online", "javascript escape characters", "json stringify tool", "html unescape string", "sql injection preventer", "csv quote escape", "sanitize text string"],
  tags: ["developer", "encoding"],
  component: () => import("./StringEscaperTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What does escaping a string mean?", answer: "Escaping adds special marker characters (usually a backslash `\\`) in front of symbols like quotes or newlines so that programming languages treat them as normal text rather than executable syntax commands." },
    { question: "Why do SQL strings need escaping?", answer: "If a user inputs a single quote (`'`) into a SQL database query, it can prematurely end the command, leading to syntax errors or dangerous SQL Injection attacks. Escaping neutralizes the quote." },
    { question: "Does this handle JSON stringify?", answer: "Yes! Selecting the JSON mode will properly escape double quotes, control characters, and newlines, ensuring your string is 100% valid for insertion into a JSON payload." }
  ],
  howItWorks: "Paste your raw text into the input box and select your target programming context (e.g., JavaScript or SQL). The output instantly updates to show the safely escaped string. Click the toggle to perform the reverse 'unescape' action.",
  relatedTools: ["html-entities", "url-encoder", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
