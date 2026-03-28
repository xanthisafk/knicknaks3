import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ULID Generator & Decoder",
  slug: "ulid-generator",
  description: "Generate and decode ULIDs instantly with sortable, unique IDs.",
  category: "generators",
  icon: "🆔",

  keywords: [
    "ulid generator",
    "generate ulid",
    "ulid vs uuid",
    "sortable unique id",
    "ulid decoder",
    "decode ulid timestamp",
    "crockford base32 id",
    "timestamp id generator",
    "lexicographically sortable id",
    "unique id generator",
    "distributed id generator",
    "database id generator",
    "ulid example",
    "ulid format explained"
  ],

  tags: ["developer", "id", "generator", "ulid"],

  component: () => import("./UlidGeneratorTool"),

  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What is a ULID?",
      answer:
        "A ULID (Universally Unique Lexicographically Sortable Identifier) is a 26-character string that combines a timestamp with randomness, allowing IDs to be both unique and sortable."
    },
    {
      question: "Why use ULID instead of UUID?",
      answer:
        "Unlike UUID v4, ULIDs are lexicographically sortable because they include a timestamp. This improves database indexing and query performance."
    },
    {
      question: "What is the ULID format?",
      answer:
        "ULIDs are 26-character strings encoded in Crockford's Base32. The first 10 characters represent the timestamp, and the remaining 16 represent randomness."
    },
    {
      question: "Can I decode a ULID?",
      answer:
        "Yes. This tool extracts the embedded timestamp and random component from any valid ULID."
    },
    {
      question: "Are ULIDs globally unique?",
      answer:
        "Yes. ULIDs combine time and randomness, making collisions extremely unlikely even in distributed systems."
    },
    {
      question: "Is this ULID generator secure?",
      answer:
        "Yes. It uses browser-based randomness APIs to generate sufficiently unpredictable identifiers for most applications."
    },
    {
      question: "Are ULIDs case-sensitive?",
      answer:
        "No. ULIDs are case-insensitive, but they are typically represented in uppercase for consistency."
    },
    {
      question: "What is Crockford Base32?",
      answer:
        "It is a human-friendly Base32 encoding that avoids ambiguous characters like I, L, O, and U."
    },
    {
      question: "Can I use ULIDs as database primary keys?",
      answer:
        "Yes. ULIDs are ideal for database keys because they are sortable and reduce index fragmentation compared to random UUIDs."
    },
    {
      question: "What is the timestamp precision in ULID?",
      answer:
        "ULIDs use millisecond precision for the timestamp portion."
    }
  ],

  howItWorks:
    "Generate ULIDs instantly using a timestamp and random component encoded in Base32. You can also inspect any ULID to extract its creation time and randomness.",

  relatedTools: [
    "uuid-generator",
    "nano-id-generator",
    "base32-encoder"
  ],

  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-28",
};