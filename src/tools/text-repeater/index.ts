import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text Repeater",
  slug: "text-repeater",
  description: "Duplicate any string of text with custom separator",
  longDescription: "Quickly generate dummy data, testing patterns, or repetitive code blocks. Provide a base string, specify the exact number of times you want it to be repeated (up to thousands), and assign a custom separator (like a space or a newline). The Text Repeater outputs the massive string instantly.",
  category: "text",
  icon: "🔃",
  keywords: ["text repeater tool", "duplicate string online", "copy text 100 times", "string multiplier", "repeat words generator", "spam text copy paste", "generate repeated phrases"],
  tags: ["text", "utility"],
  component: () => import("./TextRepeaterTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What separators can I use?", answer: "You can select a standard Space, a Comma, a Newline (to create vertical lists), or define a totally Custom text string to sit between every repeated block." },
    { question: "What is the maximum number of repeats?", answer: "While you can technically repeat a phrase thousands of times, browser memory limits apply. Generating extreme volumes of text (e.g. millions of words) may cause your tab to freeze temporarily." },
    { question: "Who uses this tool?", answer: "Software testers use it to generate large strings to try and break database limits. Designers use it for rapid visual dummy text, and everyday users use it to make repetitive formatting easier." }
  ],
  howItWorks: "Enter the base word or phrase you wish to copy into the primary input field. Select how many times to duplicate it using the number dial, choose your separator character, and instantly click to copy the generated mass output.",
  relatedTools: ["lorem-ipsum", "text-diff"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
