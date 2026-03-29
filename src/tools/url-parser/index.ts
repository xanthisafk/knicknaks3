import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Parser & Decoder",
  slug: "url-decoder",
  description: "Parse URLs into components and parameters.",
  category: "encoders",
  icon: "🔗",
  keywords: [
    "url parser",
    "url parser online",
    "url decoder",
    "analyze url structure",
    "break down url components",
    "extract query parameters",
    "url query string parser",
    "parse api endpoint",
    "url analyzer tool",
    "split url into parts"
  ],
  tags: ["developer", "network", "url", "parser"],
  component: () => import("./UrlParserTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What is a URL parser?",
      answer: "A URL parser breaks a URL into parts like protocol, hostname, path, query parameters, and fragment."
    },
    {
      question: "What parts of a URL can this tool extract?",
      answer: "It extracts protocol, origin, hostname, port, path, query string, fragment, and individual parameters."
    },
    {
      question: "Does this tool decode query parameters?",
      answer: "Yes, it shows both decoded and encoded values for query parameters when applicable."
    },
    {
      question: "Can I parse URLs without http or https?",
      answer: "Yes, the tool automatically normalizes input by adding a default protocol if missing."
    },
    {
      question: "What are query parameters in a URL?",
      answer: "Query parameters are key-value pairs appended after a question mark used to pass data to a server."
    },
    {
      question: "What is a URL fragment?",
      answer: "A fragment is the part after the # symbol used to reference a section within a page."
    },
    {
      question: "Does this tool validate URLs?",
      answer: "It validates format using the browser URL API, but does not check if the domain is reachable."
    },
    {
      question: "Can I use this for API URLs?",
      answer: "Yes, it is useful for inspecting REST API endpoints and debugging query strings."
    },
    {
      question: "Is any data sent to a server?",
      answer: "No, parsing happens entirely in your browser with no external requests."
    },
    {
      question: "What are path segments?",
      answer: "Path segments are the individual parts of the URL path separated by slashes."
    }
  ],

  howItWorks:
    "Paste a URL and the tool instantly parses it into structured components, including query parameters and path segments, using the browser URL API.",

  relatedTools: ["url-encoder", "url-builder", "http-status-codes"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};
