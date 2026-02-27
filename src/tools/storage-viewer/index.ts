import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Storage Viewer",
  slug: "storage-viewer",
  description: "Inspect, edit, and delete localStorage and sessionStorage keys for the current origin.",
  category: "dev",
  icon: "🗄️",
  keywords: ["localstorage", "sessionstorage", "storage", "browser", "inspect", "debug", "key", "value"],
  tags: ["developer", "debugging"],
  component: () => import("./StorageViewerTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Is my data safe?", answer: "All data stays in your browser. This tool only reads from the current page's origin." },
    { question: "What is the difference?", answer: "localStorage persists across sessions. sessionStorage is cleared when the tab is closed." },
  ],
  howItWorks: "Switch between localStorage and sessionStorage tabs to view, add, edit, or delete stored key-value pairs.",
  relatedTools: ["screen-info", "user-agent-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
