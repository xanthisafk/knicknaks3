import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "User Agent Parser",
  slug: "user-agent-parser",
  description: "Parse User-Agent strings to detect browser, OS, engine, and device type.",
  category: "dev",
  icon: "🕵️",
  keywords: ["user", "agent", "ua", "browser", "os", "parse", "detect", "navigator", "device"],
  tags: ["developer", "network"],
  component: () => import("./UserAgentParserTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is a User-Agent?", answer: "A User-Agent is a string sent by browsers to identify themselves to servers, including browser name, version, OS, and engine." },
  ],
  howItWorks: "Your current User-Agent is detected automatically. Paste any UA string to parse it.",
  relatedTools: ["screen-info", "url-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
