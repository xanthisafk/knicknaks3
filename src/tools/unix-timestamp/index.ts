import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unix Timestamp Converter",
  slug: "unix-timestamp",
  description: "Convert raw Unix timestamps into human-readable times",
  longDescription: "A crucial daily utility for backend engineers and database administrators. Seamlessly translate meaningless 10-digit UNIX Epoch timestamps back into readable ISO dates, or select a date on a visual calendar to instantly generate its corresponding timestamp. Features a live epoch clock and automatic local time-zone adjustments.",
  category: "calculators",
  icon: "⏱️",
  keywords: ["unix timestamp converter", "epoch time calculator", "seconds to date online", "current unix epoch", "timestamp to human readable", "convert iso date to timestamp", "javascript date tool"],
  tags: ["time", "conversion", "developer"],
  component: () => import("./UnixTimestampTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What is a Unix timestamp exactly?", answer: "A Unix timestamp (frequently called Epoch Time) is simply the total number of seconds that have elapsed since midnight (00:00:00 UTC) on January 1, 1970. It is a universal computing standard." },
    { question: "Why do programmers use timestamps?", answer: "By tracking time as a single escalating integer rather than complex strings (like 'February 2nd, 2026'), computers can perform blazing fast math and sorting operations on dates without worrying about complex global timezones." },
    { question: "Does this tool handle millisecond timestamps?", answer: "Yes! While standard UNIX is measured in 10-digit seconds, Java and JavaScript often use 13-digit milliseconds. The tool automatically detects if your number is in milliseconds and calculates accordingly." }
  ],
  howItWorks: "To decode, enter your raw timestamp integer into the first box to instantly see its human-readable translation. Alternatively, utilize the calendar widget in the lower section to select a date and time, instantly turning it into an epoch number.",
  relatedTools: ["age-calculator", "time-duration"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
