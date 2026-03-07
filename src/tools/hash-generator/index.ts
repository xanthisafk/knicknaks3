import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Hash Generator",
  slug: "hash-generator",
  description: "Securely generate SHA-1 to SHA-512 locally",
  longDescription:
    "Compute cryptographic data hashes securely using your browser's native SubtleCrypto API. Instantly generate standard SHA-1, SHA-256, " +
    "SHA-384 and SHA-512. Supports both raw text input and direct binary file hashing. All processing guarantees zero-knowledge local execution.",
  category: "crypto",
  icon: "🔐",
  keywords: ["hash generator online", "sha256 hash calculator", "md5 checksum generator", "text to sha512", "secure file hashing", "crypto digest generation", "local cryptography tool"],
  tags: ["crypto", "security", "hash"],

  component: () => import("./HashGeneratorTool"),

  capabilities: {
    supportsClipboard: true,
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is a cryptographic hash?",
      answer:
        "A hash is a mathematically fixed-size string produced by running a one-way cryptographic function on any amount of data. " +
        "The exact same input will always produce the exact same hash, but you cannot mathematically reverse a hash back to discover its original input.",
    },
    {
      question: "Is my data and file content kept safe?",
      answer: "Absolutely. All hashing computations are performed 100% locally inside your web browser leveraging the Web Crypto API. Absolutely no text or files are ever sent to our backend servers.",
    },
    {
      question: "Why should I hash a file?",
      answer: "Hashing a file generates a unique 'fingerprint' (checksum). You can compare this checksum against a provided trusted hash from a developer to mathematically verify that your downloaded file hasn't been corrupted or maliciously altered."
    }
  ],

  howItWorks:
    "Continuously type text into the input field to watch the tool generate hashes across all supported algorithms simultaneously in real-time. " +
    "Alternatively, you can drag-and-drop or manually select a file from your computer to securely hash its underlying binary content.",

  relatedTools: ["base64", "password-generator", "uuid-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
