import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JWT Encoder",
  slug: "jwt-encoder",
  description: "Create and encode JSON Web Tokens directly in your browser",
  category: "dev",
  icon: "🎟",
  keywords: [
    "jwt encoder online",
    "json web token generator",
    "create jwt token",
    "jwt token builder",
    "secure token creator",
    "auth token generator",
    "jwt token maker"
  ],
  tags: ["jwt", "auth", "developer"],

  component: () => import("./JwtEncoderTool"),

  capabilities: {
    supportsOffline: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "Is my data kept private?",
      answer: "Yes. All encoding happens locally in your browser. No payloads, secrets, or tokens are sent to any server."
    },
    {
      question: "Can I generate a valid signed JWT?",
      answer: "Yes, if you provide a signing secret and choose a supported algorithm (e.g., HS256). The generated token will include a valid signature based on your input."
    },
    {
      question: "Which algorithms are supported?",
      answer: "Typically symmetric algorithms like HS256, HS384, and HS512 are supported. Asymmetric algorithms (e.g., RS256) require private keys and are not usually handled fully in browser-based tools."
    },
    {
      question: "Can I use this for production tokens?",
      answer: "This tool is intended for development, testing, and debugging. Production token issuance should always happen on a secure backend."
    },
    {
      question: "What happens if I leave the secret empty?",
      answer: "If no secret is provided, the tool may generate an unsigned token (alg: none) or fail to sign depending on implementation. Unsigned tokens are not secure and should not be used in real systems."
    },
    {
      question: "What is included in the JWT?",
      answer: "A JWT consists of three parts: Header (algorithm and type), Payload (claims), and Signature (used to verify integrity). This tool constructs all three."
    },
    {
      question: "What are standard JWT claims?",
      answer: "Common claims include 'iss' (issuer), 'sub' (subject), 'aud' (audience), 'exp' (expiration), 'iat' (issued at), and 'nbf' (not before). These help define token validity and context."
    },
    {
      question: "Can I customize the header?",
      answer: "Yes. You can modify fields like 'alg' and 'typ', but incorrect values may produce invalid or insecure tokens."
    },
    {
      question: "Does this tool validate my payload?",
      answer: "No strict validation is enforced. You are responsible for ensuring your payload structure and claims are correct."
    },
    {
      question: "Can I generate expired tokens for testing?",
      answer: "Yes. You can manually set the 'exp' claim to a past timestamp to simulate expired tokens."
    },
    {
      question: "Is this tool suitable for learning JWTs?",
      answer: "Yes. It's useful for understanding how headers, payloads, and signatures interact in a JWT structure."
    },
    // {
    //   question: "Does this work offline?",
    //   answer: "Yes. Once loaded, the encoder works entirely in your browser without requiring a network connection."
    // },
    {
      question: "Why does my generated token fail verification elsewhere?",
      answer: "Common reasons include mismatched secrets, incorrect algorithms, malformed payloads, or differences in encoding expectations."
    },
    {
      question: "Can this create encrypted JWTs (JWE)?",
      answer: "No. This tool generates signed tokens (JWS). Encryption (JWE) requires a different process and key management setup."
    }
  ],

  howItWorks:
    "Enter your desired payload as JSON, optionally adjust the header, and provide a signing secret if needed. The tool encodes the header and payload using base64url and generates a signature based on the selected algorithm, producing a complete JWT.",

  relatedTools: ["jwt-decoder", "base64", "json-formatter"],

  schemaType: "WebApplication",

  createdAt: "2026-03-20",
  launchedAt: "2026-03-20",
  updatedAt: "2026-03-20",
};