import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JWT Decoder",
  slug: "jwt-decoder",
  description: "Decode and inspect JSON Web Tokens in your browser",
  longDescription: "Debug authentication issues efficiently with our secure JWT Decoder. Instantly unpack Base64Url-encoded tokens to read their header metadata algorithms and inspect sensitive payload claims. All decoding is processed strictly client-side to guarantee your session tokens remain private.",
  category: "dev",
  icon: "🎫",
  keywords: ["jwt decoder online", "json web token parser", "decode jwt payload", "inspect jwt header", "read jwt claims", "secure token reader", "auth token debugger"],
  tags: ["jwt", "auth", "developer"],
  component: () => import("./JwtDecoderTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "Is my session token kept safe?", answer: "Yes, 100% safe. This tool simply base64-decodes the string entirely inside your own browser window. No data is ever transmitted across a network, ensuring your active session cannot be hijacked." },
    { question: "Can this verify the JWT cryptographic signature?", answer: "No, this utility decodes the structural header and readable payload only. Verifying the signature portion to prove authenticity requires access to a private backend secret key, which should never be exposed to front-end tools." },
    { question: "Can I edit the payload to forge a new token?", answer: "While you can read the payload, you cannot forge a valid replacement token without the server's private signing key. Any manipulation of the decoded payload will invalidate the original cryptographic signature." }
  ],
  howItWorks: "Paste your raw JWT string into the input box. The tool automatically detects the three distinct sections (Header, Payload, and Signature) separated by dots, Base64-decodes them, and instantly formats the output as clean, colorized JSON.",
  relatedTools: ["base64", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
