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
  "color",
  "media",
  "network",
  "crypto",
  "dev",
  "health",
  "pdf",
  "ai",
  "creative",
  "other",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

// ===== Category Definition =====
export interface CategoryDefinition {
  label: string;
  icon: string;
  description: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  // Hero
  heroTagline?: string;
  heroDescription?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroEmojis?: string[];
}

export const CATEGORY_INFO: Record<ToolCategory, CategoryDefinition> = {
  encoders: {
    label: "Encoders & Decoders",
    icon: "🔄",
    description: "Convert data between encoded and readable formats",
    seoTitle: "Encoders & Decoders Online | Base64, URL, HTML Tools",
    seoDescription: "Encode or decode Base64, URLs, and HTML entities instantly. Fast, browser-based tools with no data leaving your device.",
    heroTagline: "Convert data instantly",
    heroDescription: "Switch between encoded and human-readable formats in seconds. Everything runs locally, so your data stays private.",
  },
  generators: {
    label: "Generators",
    icon: "⚡",
    description: "Create random data, IDs, and passwords",
    seoTitle: "Online Generators | Passwords, UUIDs, Hashes & More",
    seoDescription: "Generate secure passwords, UUIDs, hashes, and sample data instantly using fast, privacy-friendly browser tools.",
    heroTagline: "Generate what you need, instantly",
    heroDescription: "Create strong passwords, unique IDs, and placeholder content in one click. No tracking, no server calls.",
  },
  converters: {
    label: "Converters",
    icon: "🔀",
    description: "Transform data between formats and units",
    seoTitle: "Format & Unit Converters Online | Fast & Simple",
    seoDescription: "Convert numbers, text formats, and units instantly with lightweight tools that run entirely in your browser.",
    heroTagline: "Convert without friction",
    heroDescription: "Quickly move between formats, bases, and units with precise results and zero setup.",
  },
  formatters: {
    label: "Formatters",
    icon: "✨",
    description: "Clean, beautify, or compress data",
    seoTitle: "Code & Data Formatters | JSON, HTML & More",
    seoDescription: "Format, beautify, or minify JSON, HTML, and other data instantly with secure, client-side tools.",
    heroTagline: "Make messy data usable",
    heroDescription: "Turn unreadable payloads into clean, structured output—or compress them for production use.",
  },
  validators: {
    label: "Validators",
    icon: "✅",
    description: "Check data for errors and correctness",
    seoTitle: "Data Validators & Syntax Checkers Online",
    seoDescription: "Validate JSON and other formats instantly. Catch structural errors early with fast, browser-based tools.",
    heroTagline: "Validate with confidence",
    heroDescription: "Ensure your data is correct before using it. Get immediate feedback without sending anything to a server.",
  },
  calculators: {
    label: "Calculators",
    icon: "🧮",
    description: "Perform everyday and advanced calculations",
    seoTitle: "Online Calculators | Time, Finance, Percentages & More",
    seoDescription: "Solve calculations for time, percentages, finance, and more using simple, fast tools.",
    heroTagline: "Quick answers, no clutter",
    heroDescription: "Handle both simple and complex calculations instantly with clean, distraction-free tools.",
  },
  text: {
    label: "Text Tools",
    icon: "📝",
    description: "Edit, analyze, and transform text",
    seoTitle: "Text Tools Online | Edit, Format & Analyze Text",
    seoDescription: "Manipulate text easily—sort, clean, compare, and transform strings with fast browser-based utilities.",
    heroTagline: "Work with text efficiently",
    heroDescription: "From quick edits to deeper analysis, handle text operations directly in your browser.",
  },
  color: {
    label: "Color Tools",
    icon: "🎨",
    description: "Work with colors, palettes, and formats",
    seoTitle: "Color Tools Online | Converters, Pickers & Palettes",
    seoDescription: "Convert color formats, generate palettes, and check contrast with fast, in-browser tools.",
    heroTagline: "Design with precision",
    heroDescription: "Create, convert, and refine colors for any UI or design workflow.",
  },
  creative: {
    label: "Creative Tools",
    icon: "🎨",
    description: "Draw and animate",
    seoTitle: "Creative Tools | Draw and animate",
    seoDescription: "Draw and animate with fast, in-browser tools.",
    heroTagline: "Create with your imagination",
    heroDescription: "Create, draw, and animate with fast, in-browser tools.",
  },
  media: {
    label: "Media Tools",
    icon: "🎬",
    description: "Inspect and work with media files",
    seoTitle: "Media Tools Online | Image, Audio & Video Utilities",
    seoDescription: "View metadata, inspect files, and handle media directly in your browser without uploads.",
    heroTagline: "Handle media locally",
    heroDescription: "Work with images, audio, and video securely without relying on external services.",
  },
  network: {
    label: "Network Tools",
    icon: "🌐",
    description: "Analyze and debug web data",
    seoTitle: "Network Tools Online | URL, Headers & IP Utilities",
    seoDescription: "Inspect URLs, headers, and network data with simple tools built for developers.",
    heroTagline: "Understand the web faster",
    heroDescription: "Break down and debug network data with tools designed for clarity and speed.",
  },
  crypto: {
    label: "Cryptography Tools",
    icon: "🔐",
    description: "Hash and secure data locally",
    seoTitle: "Cryptography Tools Online | Hash & Encryption Utilities",
    seoDescription: "Generate hashes like MD5 and SHA-256 instantly with secure, client-side processing.",
    heroTagline: "Security without compromise",
    heroDescription: "Hash and verify sensitive data locally so nothing leaves your device.",
  },
  dev: {
    label: "Developer Tools",
    icon: "💻",
    description: "Utilities for development workflows",
    seoTitle: "Developer Tools Online | JWT, Regex, Cron & More",
    seoDescription: "Test regex, decode JWTs, and work with developer utilities directly in your browser.",
    heroTagline: "Built for developers",
    heroDescription: "A focused set of tools to speed up debugging, testing, and everyday development tasks.",
  },
  health: {
    label: "Health & Fitness Tools",
    icon: "❤️",
    description: "Track and calculate fitness metrics",
    seoTitle: "Health Calculators Online | BMI, BMR & Fitness Tools",
    seoDescription: "Calculate BMI, BMR, and other health metrics quickly with simple tools.",
    heroTagline: "Measure what matters",
    heroDescription: "Get clear insights into your fitness metrics with straightforward calculations.",
  },
  pdf: {
    label: "PDF Tools",
    icon: "📄",
    description: "Edit and manage PDF files",
    seoTitle: "PDF Tools Online | Merge, Split & Compress PDFs",
    seoDescription: "Work with PDF files directly in your browser—merge, split, and compress without uploads.",
    heroTagline: "Simple PDF workflows",
    heroDescription: "Manage PDF documents quickly and privately with tools that run entirely on your device.",
  },
  ai: {
    label: "AI Tools",
    icon: "🤖",
    description: "Run AI features directly in your browser",
    seoTitle: "Browser AI Tools | Local AI Processing & Utilities",
    seoDescription: "Use AI-powered tools directly in your browser with no servers or external APIs.",
    heroTagline: "AI, without the cloud",
    heroDescription: "Run AI models locally for fast, private processing—no accounts or API keys required.",
  },
  other: {
    label: "Other Tools",
    icon: "🧩",
    description: "Miscellaneous utilities",
    seoTitle: "Online Utilities | Miscellaneous Tools",
    seoDescription: "Explore a collection of small, useful tools for edge cases and unique tasks.",
    heroTagline: "For everything else",
    heroDescription: "A set of practical tools that don't fit elsewhere but still get the job done.",
  },
};

// ===== Tool Statuses (derived at runtime) =====
export const TOOL_STATUSES = [
  "new",
  "beta",
  "popular",
  "updated",
  "pinned",
  "alpha",
] as const;

export type ToolStatus = (typeof TOOL_STATUSES)[number];

export const STATUS_INFO: Record<ToolStatus, { label: string; icon: string }> = {
  popular: { label: "Popular", icon: "🔥" },
  new: { label: "New", icon: "✨" },
  updated: { label: "Updated", icon: "🔨" },
  beta: { label: "Beta", icon: "🧪" },
  pinned: { label: "Pinned", icon: "📌" },
  alpha: { label: "Alpha", icon: "👷‍♀️" },
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
  supportsOffline?: boolean;
}

// ===== Tool License =====
export interface ToolLicense {
  licenseName: string;
  licenseUrl: string;
  originalAuthor?: string;
  originalProjectName?: string;
  originalProjectUrl?: string;
  isModified?: boolean;
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

  // Timestamp-driven status
  createdAt?: string;
  launchedAt?: string;
  updatedAt?: string;

  // Manual flags
  featured?: boolean;
  popular?: boolean;
  status?: ToolStatus;

  // Component (lazy-loaded)
  component: () => Promise<{ default: ComponentType }>;

  // SEO
  faq?: FAQItem[];
  howItWorks?: string;
  relatedTools?: string[];
  ogImage?: string;

  // Schema.org
  schemaType?: "WebApplication" | "SoftwareApplication";

  // Capabilities
  capabilities?: ToolCapabilities;

  // License
  license?: ToolLicense;

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
  createdAt: z.string().optional(),
  launchedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
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
  schemaType: z.enum(["WebApplication", "SoftwareApplication"]).optional(),
  capabilities: z
    .object({
      supportsWorker: z.boolean().optional(),
      supportsFileInput: z.boolean().optional(),
      supportsClipboard: z.boolean().optional(),
      supportsOffline: z.boolean().optional(),
    })
    .optional(),
  license: z
    .object({
      licenseName: z.string(),
      licenseUrl: z.string(),
      originalAuthor: z.string().optional(),
      originalProjectName: z.string().optional(),
      originalProjectUrl: z.string().optional(),
      isModified: z.boolean().optional(),
    })
    .optional(),
});
