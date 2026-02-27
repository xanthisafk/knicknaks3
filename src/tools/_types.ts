import { z } from "zod";
import type { ReactNode, ComponentType } from "react";

// ===== Tool Categories =====
export const TOOL_CATEGORIES = [
  "encoders",
  "generators",
  "converters",
  "formatters",
  "validators",
  "calculators",
  "text",
  "media",
  "network",
  "crypto",
  "dev",
  "health",
  "other",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

// ===== Category Display Info =====
export const CATEGORY_INFO: Record<ToolCategory, { label: string; icon: string; description: string }> = {
  encoders: { label: "Encoders & Decoders", icon: "🔄", description: "Encode and decode data formats" },
  generators: { label: "Generators", icon: "⚡", description: "Generate data, IDs, and passwords" },
  converters: { label: "Converters", icon: "🔀", description: "Convert between formats" },
  formatters: { label: "Formatters", icon: "✨", description: "Format and beautify data" },
  validators: { label: "Validators", icon: "✅", description: "Validate data and formats" },
  calculators: { label: "Calculators", icon: "🧮", description: "Calculate and compute values" },
  text: { label: "Text Tools", icon: "📝", description: "Text manipulation utilities" },
  media: { label: "Media", icon: "🎨", description: "Image, audio, and video tools" },
  network: { label: "Network", icon: "🌐", description: "Network and web utilities" },
  crypto: { label: "Cryptography", icon: "🔐", description: "Hashing and encryption tools" },
  dev: { label: "Developer", icon: "💻", description: "Developer utilities" },
  health: { label: "Health & Fitness", icon: "❤️", description: "Health and fitness calculators" },
  other: { label: "Other", icon: "🧩", description: "Miscellaneous tools" },
};

// ===== FAQ Schema =====
export interface FAQItem {
  question: string;
  answer: string;
}

// ===== Capability Flags =====
export interface ToolCapabilities {
  supportsWorker?: boolean;
  supportsFileInput?: boolean;
  supportsClipboard?: boolean;
  supportsOffline?: boolean; // default: true
}

// ===== Tool Definition Interface =====
export interface ToolDefinition {
  // Core
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  tags?: string[];

  // Component (lazy-loaded)
  component: () => Promise<{ default: ComponentType }>;

  // SEO
  faq?: FAQItem[];
  howItWorks?: string;
  relatedTools?: string[];
  ogImage?: string;
  lastUpdated?: string;

  // Schema.org
  schemaType?: "WebApplication" | "SoftwareApplication";

  // Capabilities
  capabilities?: ToolCapabilities;

  // Lifecycle hooks
  onMount?: () => void | Promise<void>;
  onUnmount?: () => void;
}

// ===== Zod Schema for Build-Time Validation =====
export const toolDefinitionSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().optional(),
  category: z.enum(TOOL_CATEGORIES),
  icon: z.string().min(1, "Icon is required"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  tags: z.array(z.string()).optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .optional(),
  howItWorks: z.string().optional(),
  relatedTools: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  lastUpdated: z.string().optional(),
  schemaType: z.enum(["WebApplication", "SoftwareApplication"]).optional(),
  capabilities: z
    .object({
      supportsWorker: z.boolean().optional(),
      supportsFileInput: z.boolean().optional(),
      supportsClipboard: z.boolean().optional(),
      supportsOffline: z.boolean().optional(),
    })
    .optional(),
});
