import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Builder & Query String Generator",
  slug: "url-builder",
  description: "Build and encode URLs with query parameters.",
  category: "dev",
  icon: "🏗️",
  keywords: [
    "url builder",
    "url builder online",
    "query string generator",
    "url parameter builder",
    "build url with parameters",
    "api url generator",
    "encode url parameters",
    "create query string",
    "rest api url builder",
    "construct url online"
  ],
  tags: ["developer", "network", "url", "api"],
  component: () => import("./UrlBuilderTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "What is a URL builder?",
      answer: "A URL builder lets you construct a complete URL by combining protocol, domain, path, query parameters, and fragments."
    },
    {
      question: "What are query parameters?",
      answer: "Query parameters are key-value pairs appended to a URL after a question mark, used to pass data to servers."
    },
    {
      question: "Does this tool encode URL parameters?",
      answer: "Yes, all query keys and values are automatically percent-encoded to ensure valid URLs."
    },
    {
      question: "How do I add multiple query parameters?",
      answer: "Use the add button to create multiple key-value pairs, which will be joined with ampersands in the final URL."
    },
    {
      question: "What is URL encoding?",
      answer: "URL encoding converts special characters into a safe format using percent notation, such as spaces becoming %20."
    },
    {
      question: "Can I include ports in my URL?",
      answer: "Yes, you can specify a custom port which will be appended after the domain."
    },
    {
      question: "What is a URL fragment?",
      answer: "A fragment is the part after the hash symbol (#) used to navigate to a specific section of a page."
    },
    {
      question: "Does this support API URLs?",
      answer: "Yes, it is useful for building REST API endpoints with query parameters."
    },
    {
      question: "What protocols are supported?",
      answer: "Common protocols like HTTP, HTTPS, FTP, WS, and WSS are supported."
    },
    {
      question: "Is this tool free and offline?",
      answer: "Yes, it runs completely in your browser and does not require any server requests."
    }
  ],
  howItWorks: "Enter protocol, host, and optional path, port, query parameters, and fragment. The tool automatically encodes parameters and generates a valid URL in real time.",
  relatedTools: ["url-parser", "url-encoder", "http-status-codes"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};