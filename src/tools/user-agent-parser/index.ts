import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "User Agent Parser",
  slug: "user-agent-parser",
  description: "Turn user agent string into readable data",
  longDescription: "Uncover the precise details of internet traffic headers. Our extensive User Agent string parser deeply analyzes complex UA headers to reliably identify the specific Web Browser (e.g., Chrome, Safari), underlying Engine (e.g., WebKit, Gecko), Operating System, and physical Device Category (Mobile, Tablet, Desktop) making the network request.",
  category: "dev",
  icon: "🕵️",
  keywords: ["user agent parser online", "detect browser from string", "ua string analyzer", "identify mobile user agent", "parse navigator object", "check web browser version", "bot user agent checker"],
  tags: ["developer", "network"],
  component: () => import("./UserAgentParserTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What exactly is a User-Agent?", answer: "A User-Agent is a specialized text string automatically sent by web browsers in the HTTP headers of every network request to identify their capabilities to the receiving server. It includes the browser name, version, host OS, and layout engine." },
    { question: "Can a User-Agent be spoofed or faked?", answer: "Yes, very easily. Both users and automated bots constantly manipulate their UA strings (for privacy or malicious web scraping), so they should never be solely relied upon for strict security measures." },
    { question: "Does this parse search engine bots?", answer: "Yes. In addition to standard consumer device formats, the internal parsing dictionary reliably identifies strings from major crawlers like Googlebot, Bingbot, and popular social web scrapers." }
  ],
  howItWorks: "Upon loading, the tool automatically reads your own browser's native `navigator.userAgent` property. To test other strings, simply paste any raw UA header text into the input box to instantly dissect the software components.",
  relatedTools: ["screen-info", "url-parser", "http-status-codes"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
