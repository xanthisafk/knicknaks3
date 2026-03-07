import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "UUID Generator",
  slug: "uuid-generator",
  description: "Generate cryptographically secure v4 and v7 UUIDs",
  longDescription:
    "Generate universally unique identifiers (UUIDs) using cryptographically secure random values. " +
    "Supports both classic completely randomized v4 keys, and the modern timestamp-ordered v7 keys. Generate up to 100 UUIDs simultaneously in a fast, robust offline batch.",
  category: "generators",
  icon: "🆔",
  keywords: ["uuid generator online", "guid creator online", "generate uuid v4", "create sortable uuid v7", "cryptographically secure identifier", "bulk guid generator", "database primary key maker"],
  tags: ["generator", "id", "developer"],

  component: () => import("./UuidGeneratorTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is the difference between UUID v4 and v7?",
      answer:
        "UUID v4 is purely random, ensuring high cryptographic entropy but causing severe database index fragmentation. UUID v7 embeds a millisecond-precision Unix timestamp in the first 48 bits, making it perfectly lexicographically sortable by creation time — the ideal modern standard for database primary keys."
    },
    {
      question: "Is this tool generating truly secure IDs?",
      answer: "Yes. All randomness is sourced directly from your browser's native `window.crypto.getRandomValues()` API framework, guaranteeing cryptographically secure algorithmic generation suitable for enterprise production environments."
    }
  ],

  howItWorks:
    "Select your preferred UUID version architecture and desired quantity, then click Generate. The resulting list of IDs can be copied individually by clicking them, or copied entirely using the bulk action button.",

  relatedTools: ["ulid-generator", "password-generator", "hash-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
