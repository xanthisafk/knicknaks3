import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Hash Generator",
  slug: "hash-generator",
  description: "Generate SHA-1, SHA-256, SHA-384, SHA-512, and MD5 hashes from text or files using SubtleCrypto.",
  longDescription:
    "Compute cryptographic hashes using browser-native SubtleCrypto API. Supports SHA-1, SHA-256, " +
    "SHA-384, and SHA-512 algorithms. Optionally hash file contents. All processing is local.",
  category: "crypto",
  icon: "🔐",
  keywords: ["hash", "sha", "md5", "sha256", "sha512", "checksum", "digest", "crypto"],
  tags: ["crypto", "security", "hash"],

  component: () => import("./HashGeneratorTool"),

  capabilities: {
    supportsClipboard: true,
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is a hash?",
      answer:
        "A hash is a fixed-size string produced by a one-way cryptographic function. " +
        "The same input always produces the same hash, but you can't reverse a hash back to its input.",
    },
    {
      question: "Is my data safe?",
      answer: "Yes. All hashing is done locally in your browser using the built-in SubtleCrypto API. No data is sent anywhere.",
    },
  ],

  howItWorks:
    "Enter text in the input field to generate hashes in all supported algorithms simultaneously. " +
    "You can also drag-and-drop or select a file to hash its binary content.",

  relatedTools: ["base64", "password-generator", "uuid-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
