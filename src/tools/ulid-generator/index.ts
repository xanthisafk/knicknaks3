import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "ULID Generator",
  slug: "ulid-generator",
  description: "Generate ULIDs securely in your browser",
  longDescription: "Create robust database primary keys with our local ULID Generator. Unlike random UUIDs, ULIDs natively embed a millisecond-precision UNIX timestamp, ensuring they can be naturally sorted chronologically. This tool generates mathematically valid, 26-character Crockford Base32 encoded identifiers entirely offline, meaning zero server round-trips for your IDs.",
  category: "generators",
  icon: "🆔",
  keywords: ["ulid generator online", "sortable unique identifier", "timestamp id generator", "uuid alternative", "crockford base32 id", "generate ulid database key", "lexicographically sortable id"],
  tags: ["developer", "id", "generator"],
  component: () => import("./UlidGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Why should I use a ULID over a UUID?", answer: "While standard UUIDs (v4) are completely random, making them terrible for database indexing, a ULID contains a baked-in timestamp. This allows databases to natively sort them chronologically without needing a separate 'created_at' column." },
    { question: "What is the ULID format?", answer: "A ULID is exactly 26 characters long, composed using Crockford's Base32 alphabet. The first 10 characters dictate the creation timestamp, and the final 16 characters provide the cryptographic randomness." },
    { question: "Is this tool generating IDs securely?", answer: "Yes. The randomness is sourced directly from your browser's native `Crypto.getRandomValues()` API, making them safe for production database keys and distributed systems." }
  ],
  howItWorks: "Click the 'Generate' button to immediately create a single ULID string, or use the batch feature to instantly spawn up to 100 unique identifiers at once. Simply click on any generated ID block to automatically copy it to your clipboard.",
  relatedTools: ["uuid-generator"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
