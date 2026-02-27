import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JWT Decoder",
  slug: "jwt-decoder",
  description: "Decode and inspect JSON Web Tokens (JWT) without sending data to any server.",
  category: "dev",
  icon: "🎫",
  keywords: ["jwt", "token", "decode", "json", "web", "auth", "header", "payload", "claims"],
  tags: ["jwt", "auth", "developer"],
  component: () => import("./JwtDecoderTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Is my JWT safe?", answer: "Yes. Decoding happens entirely in your browser. No data is sent anywhere." },
    { question: "Can this tool verify JWT signatures?", answer: "No, this tool only decodes and displays the header and payload. Signature verification requires the secret/public key and is typically done server-side." },
  ],
  howItWorks: "Paste a JWT token and its three parts (header, payload, signature) are decoded and displayed as formatted JSON.",
  relatedTools: ["base64", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
