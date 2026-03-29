import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "UUID Generator",
  slug: "uuid-generator",
  description: "Generate UUID v4 and v7 instantly.",
  category: "generators",
  icon: "🆔",
  keywords: [
    "uuid generator",
    "uuid v4 generator",
    "uuid v7 generator",
    "guid generator online",
    "generate uuid online",
    "bulk uuid generator",
    "create unique id",
    "random uuid generator",
    "sortable uuid v7",
    "database id generator"
  ],
  tags: ["generator", "id", "developer", "uuid"],

  component: () => import("./UuidGeneratorTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is a UUID?",
      answer: "A UUID is a universally unique identifier used to uniquely identify data across systems."
    },
    {
      question: "What is the difference between UUID v4 and v7?",
      answer: "v4 is random-based, while v7 includes a timestamp, making it sortable by creation time."
    },
    {
      question: "When should I use UUID v7?",
      answer: "Use v7 when you need time-ordered IDs, such as database indexes or logs."
    },
    {
      question: "Are these UUIDs secure?",
      answer: "Yes, they use cryptographically secure randomness from the browser crypto API."
    },
    {
      question: "Can I generate multiple UUIDs at once?",
      answer: "Yes, you can generate up to 100 UUIDs in a single batch."
    },
    {
      question: "What is a GUID?",
      answer: "GUID is another name for UUID, commonly used in Microsoft systems."
    },
    {
      question: "Are UUIDs guaranteed to be unique?",
      answer: "They are not guaranteed, but the probability of collision is extremely low."
    },
    {
      question: "Can I use UUIDs as database primary keys?",
      answer: "Yes, especially v7 which is optimized for indexing due to its sortable structure."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes, all generation happens locally in your browser."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, it is completely free to use."
    }
  ],

  howItWorks:
    "Choose UUID version and quantity, then generate a list of unique IDs instantly using secure browser APIs.",

  relatedTools: ["ulid-generator", "password-generator", "hash-generator"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};