import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Parser",
  slug: "url-parser",
  description: "Deconstruct URL into components",
  longDescription: "Understand precisely where a web link leads. The visual URL Parser breaks down massive, chaotic web addresses into their distinct structural properties. Instantly isolate the Protocol scheme, the core Hostname domain, specific Ports, folder Paths, nested Query string parameters, and Fragment hashes. Perfect for debugging API integrations and redirect chains.",
  category: "dev",
  icon: "🔗",
  keywords: ["url parser online", "break down web link", "extract url query strings", "hostname extractor", "url fragment analyzer", "check api endpoint structure", "deconstruct url"],
  tags: ["developer", "network"],
  component: () => import("./UrlParserTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What URL networking formats are supported?", answer: "The parser robustly interprets any standardized URL scheme mathematically valid under RFC 3986. This includes standard Web (http/https), FTP servers, mailto triggers, and custom application protocol URLs." },
    { question: "Can I visually edit the parsed parts?", answer: "Yes! Our interface is entirely bidirectional. Any edits made to the isolated component input fields (like changing the Hostname or a specific Query value) will instantly rebuild the final URL string above." },
    { question: "Does this perform DNS lookups?", answer: "No. This tool performs strict string manipulation and syntax parsing based on the Javascript URL API. It does not actively ping or verify if the domain is currently online." }
  ],
  howItWorks: "Paste your raw URL string into the top master input. The tool instantly slices the string at specific delimiters, filling the properties panel below. You can then edit the individual property fields to dynamically rebuild the master link.",
  relatedTools: ["url-encoder", "url-builder", "http-status-codes"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
