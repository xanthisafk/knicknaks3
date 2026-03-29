import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "User Agent Parser",
  slug: "user-agent-parser",
  description: "Parse user agent strings into browser, OS, and device.",
  category: "dev",
  icon: "🕵️",
  keywords: [
    "user agent parser",
    "ua parser online",
    "user agent analyzer",
    "browser detector from user agent",
    "detect device from user agent",
    "ua string parser",
    "identify browser version",
    "user agent lookup",
    "bot user agent checker",
    "parse navigator userAgent"
  ],
  tags: ["developer", "network", "browser", "ua"],

  component: () => import("./UserAgentParserTool"),

  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What is a user agent string?",
      answer: "A user agent string is a text identifier sent by browsers that includes details about the browser, operating system, and device."
    },
    {
      question: "What can this user agent parser detect?",
      answer: "It detects browser name and version, rendering engine, operating system, device type, vendor, and possible bot status."
    },
    {
      question: "How do I find my user agent?",
      answer: "Click the 'Use My User Agent' button to automatically load your browser's user agent string."
    },
    {
      question: "Can user agents be faked?",
      answer: "Yes, user agent strings can be easily spoofed, so they should not be used alone for security decisions."
    },
    {
      question: "Does this detect bots and crawlers?",
      answer: "Yes, it flags common bot patterns such as Googlebot, Bingbot, and other crawlers."
    },
    {
      question: "What is a rendering engine?",
      answer: "A rendering engine is the browser component responsible for displaying web content, such as WebKit or Gecko."
    },
    {
      question: "Can I parse mobile user agents?",
      answer: "Yes, it detects mobile, tablet, and desktop devices along with vendor and model when available."
    },
    {
      question: "Is this tool accurate?",
      answer: "It provides reliable parsing based on common patterns, but uncommon or custom user agents may not be fully recognized."
    },
    {
      question: "Is my data sent anywhere?",
      answer: "No, all parsing happens locally in your browser without any server requests."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, it is completely free and works offline."
    }
  ],

  howItWorks:
    "Paste a user agent string or use your own, and the tool instantly parses it into browser, engine, OS, and device details.",

  relatedTools: ["screen-info", "url-parser", "http-status-codes"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};