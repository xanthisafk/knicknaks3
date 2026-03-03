import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Builder",
  slug: "url-builder",
  description: "Interactively construct and test complex URLs from individual components like host, path, and queries.",
  longDescription: "A visual playground for constructing perfectly formatted API endpoints and web links. Our interactive URL Builder allows developers to break down web addresses into their raw structural components—Protocol, Hostname, Port, Path, and Query Parameters. It automatically handles the tricky percent-encoding of special characters and provides a live preview of the final assembled URL string.",
  category: "dev",
  icon: "🏗️",
  keywords: ["url builder online", "construct api endpoint", "url query parameter generator", "assemble web address", "live url preview tool", "format url string", "add uri parameters"],
  tags: ["developer", "network"],
  component: () => import("./UrlBuilderTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is URL encoding?", answer: "Special characters (like spaces, ampersands, or equals signs) have structural meaning inside a URL. If you want to use them as standard text in a query parameter, they must be 'percent-encoded' (e.g. converting a space into '%20') so they don't break the link." },
    { question: "Does this tool auto-encode my query parameters?", answer: "Yes! As you type your key-value pairs into the Query Parameters list, the URL Builder automatically applies the necessary percent-encoding in real-time, ensuring your final link is perfectly safe to use." },
    { question: "Can I test different HTTP protocols?", answer: "Absolutely. The dropdown handles standard Web protocols (`http://` and `https://`), FTP transfer (`ftp://`), and even Websocket connections (`ws://` and `wss://`)." }
  ],
  howItWorks: "Select your desired network protocol and input the base Host/Domain. Fill out optional fields like Port numbers or specific file paths. Click the '+' button to add dynamic Query Parameters. The final URL string updates live as you type, ready to be copied.",
  relatedTools: ["url-parser", "url-encoder", "http-status-codes"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
