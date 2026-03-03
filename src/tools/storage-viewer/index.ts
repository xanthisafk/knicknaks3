import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Storage Viewer",
  slug: "storage-viewer",
  description: "Inspect, edit, and delete localStorage and sessionStorage keys instantly within your browser.",
  longDescription: "A fast, streamlined dashboard for web developers to peer directly into their browser's persistent storage state. Easily inspect raw data payloads, manually inject new testing variables, edit existing JSON values, or completely clear your local origin's Web Storage API cache without opening heavy browser DevTools.",
  category: "dev",
  icon: "🗄️",
  keywords: ["localstorage viewer online", "inspect sessionstorage data", "web storage editor tool", "browser cache string reader", "debug localstorage json", "clear session storage", "frontend developer tools"],
  tags: ["developer", "debugging"],
  component: () => import("./StorageViewerTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Can I see storage for other websites?", answer: "No. For vital security reasons, modern web browsers strictly enforce the 'Same-Origin Policy'. This tool can only read, write, or delete data saved specifically for the exact domain you are currently visiting." },
    { question: "What is the difference between localStorage and sessionStorage?", answer: "Data saved in `localStorage` persists indefinitely across browser restarts until manually deleted. Data in `sessionStorage` is strictly temporary and is automatically wiped by your browser the moment you close the current tab." },
    { question: "Does this read cookies?", answer: "No, this tool exclusively interacts with the modern Web Storage API. HTTP Cookies represent a different, older storage mechanism designed primarily for server-side communication." }
  ],
  howItWorks: "Upon loading the page, the tool automatically queries your browser's native `window.localStorage` and `window.sessionStorage` objects. Toggle between the two tabs to view active data. Use the 'Add Item' button to inject new keys, or click the trash icon next to any existing variable to purge it.",
  relatedTools: ["screen-info", "user-agent-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
