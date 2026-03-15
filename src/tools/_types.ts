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
}

export const CATEGORY_INFO: Record<ToolCategory, CategoryDefinition> = {
  encoders: {
    label: "Encoders & Decoders",
    icon: "🔄",
    description: "Encode and decode data formats",
    seoTitle: "Free Encoders & Decoders | Base64, URL, HTML & More | Knicknaks",
    seoDescription: "Encode and decode strings, URLs, HTML entities, and Base64 instantly. Fast, offline-capable encoding tools running entirely in your browser.",
    heroTagline: "Data transformation made simple.",
    heroDescription: "Quickly convert text and data into different encodings or decode back into human-readable formats. Everything works locally in your browser for ultimate privacy.",
  },
  generators: {
    label: "Generators",
    icon: "⚡",
    description: "Generate data, IDs, and passwords",
    seoTitle: "Free Data, Hash, Password & ID Generators Online | Knicknaks",
    seoDescription: "Generate secure passwords, UUIDs, dummy text, and hashes instantly. Privacy-friendly generation directly in your browser without data collection.",
    heroTagline: "Instant data, ID, and secret generation.",
    heroDescription: "Create strong passwords, unique identifiers, or placeholder content with a single click. Everything is generated safely on your device.",
  },
  converters: {
    label: "Converters",
    icon: "🔀",
    description: "Convert between formats",
    seoTitle: "Free Format & Unit Converters | Text, Numbers & Bases | Knicknaks",
    seoDescription: "Convert easily between numbers, bases, and text cases. Simple, offline-ready converters that give you precise results instantly.",
    heroTagline: "Seamless data transformation.",
    heroDescription: "Bridge the gap between different data formats and types with our lightning-fast converters. No installation required.",
  },
  formatters: {
    label: "Formatters",
    icon: "✨",
    description: "Format and beautify data",
    seoTitle: "Free Code & Data Formatters | JSON, HTML & More | Knicknaks",
    seoDescription: "Instantly beautify, minify, and format your code and data. Offline formatting tools for JSON and more that run securely in your browser.",
    heroTagline: "Make your data readable again.",
    heroDescription: "Clean up messy code payloads, or compress them down for production. Get perfect indentation with zero server roundtrips.",
  },
  validators: {
    label: "Validators",
    icon: "✅",
    description: "Validate data and formats",
    seoTitle: "Free Data Validators & Syntax Checkers Online | Knicknaks",
    seoDescription: "Check syntax, validate payloads, and catch data errors quickly. Free browser-based tools to ensure your JSON and code structure is flawless.",
    heroTagline: "Catch structural errors instantly.",
    heroDescription: "Ensure your configurations and API payloads are completely valid before deploying. Immediate feedback running right in your browser memory.",
  },
  calculators: {
    label: "Calculators",
    icon: "🧮",
    description: "Calculate and compute values",
    seoTitle: "Free Online Calculators | Time, Dates, Tips & Finance | Knicknaks",
    seoDescription: "Calculate time differences, tip amounts, percentages, and financial metrics. A suite of fast, ad-free calculators for everyday math.",
    heroTagline: "Math without the headache.",
    heroDescription: "Solve both everyday math problems and specialized calculations quickly. Zero ads, zero tracking, just instant results.",
  },
  text: {
    label: "Text Tools",
    icon: "📝",
    description: "Text manipulation utilities",
    seoTitle: "Free Text Tools & Manipulation Utilities | Knicknaks",
    seoDescription: "Sort, reverse, diff, and sanitize text easily. Free browser text manipulation utilities that respect your privacy and clipboard.",
    heroTagline: "Wordsmithing for developers and writers.",
    heroDescription: "Analyze word counts, extract differences, and transform text cases or symbols. Powerful text operations handled directly in your browser tab.",
  },
  color: {
    label: "Colors",
    icon: "🎨",
    description: "Color tools for designers and developers",
    seoTitle: "Free Color Tools | Converters, Generators & Palettes | Knicknaks",
    seoDescription: "Convert HEX to RGB, pick colors from images, check contrast, and build gradients. Comprehensive color tools designed for rapid UI creation.",
    heroTagline: "A digital toolkit for vibrant designs.",
    heroDescription: "Build accessible palettes, convert between color spaces, and extract perfect shades from your images. Ready for any design workflow.",
  },
  media: {
    label: "Media",
    icon: "🎬",
    description: "Image, audio, and video tools",
    seoTitle: "Free Media Utilities | EXIF Viewers & Stream Players | Knicknaks",
    seoDescription: "Play streams or inspect image EXIF metadata securely. Simple web-based media handlers that never upload your personal files.",
    heroTagline: "Local processing for your media.",
    heroDescription: "Examine hidden metadata within your photos or play network media streams quickly and privately without downloading bulky apps.",
  },
  network: {
    label: "Network",
    icon: "🌐",
    description: "Network and web utilities",
    seoTitle: "Free Network & Web Developer Tools Online | Knicknaks",
    seoDescription: "Analyze URLs, headers, and IP addresses. Free web utilities tailored for network engineers and web developers.",
    heroTagline: "Understand the web's wiring.",
    heroDescription: "Quick tools to debug connectivity, parse complex URLs, or inspect browser environments. Instant network utility operations.",
  },
  crypto: {
    label: "Cryptography",
    icon: "🔐",
    description: "Hashing and encryption tools",
    seoTitle: "Free Cryptography & Hashing Tools Online | Knicknaks",
    seoDescription: "Generate MD5, SHA-256, and SHA-512 hashes instantly. Client-side cryptography tools to safely hash data without sending it over the network.",
    heroTagline: "Secure client-side cryptographic hashing.",
    heroDescription: "Verify file checksums and hash sensitive strings locally. Our encryption tools ensure your raw data never leaves your device.",
  },
  dev: {
    label: "Developer",
    icon: "💻",
    description: "Developer utilities",
    seoTitle: "Free Developer Tools | Cron, JWT, Regex & CSS | Knicknaks",
    seoDescription: "Decode JWTs, test RegEx, generate CSS, and parse Cron jobs. Essential browser-based utilities built for modern web developers.",
    heroTagline: "The Swiss Army knife for coders.",
    heroDescription: "Debug complex expressions, generate obscure code strings, and validate tokens with tools crafted for your daily development workflow.",
  },
  health: {
    label: "Health & Fitness",
    icon: "❤️",
    description: "Health and fitness calculators",
    seoTitle: "Free Health Calculators | BMI, BMR, Macros & Pace | Knicknaks",
    seoDescription: "Calculate your body mass index, basal metabolic rate, and custom running paces. Simple, private health tools to map out your fitness goals.",
    heroTagline: "Data-driven fitness planning.",
    heroDescription: "Track your baselines and plan your runs with precise health and fitness metrics. No account walls or personal data collection.",
  },
  pdf: {
    label: "PDF Tools",
    icon: "📄",
    description: "Merge, split, and edit PDFs in-browser",
    seoTitle: "Free PDF Tools | Merge, Split, Compress & Protect PDFs | Knicknaks",
    seoDescription: "Edit and merge PDF documents entirely in your browser tab. Powerful client-side PDF manipulation that never uploads your sensitive papers.",
    heroTagline: "Private document management.",
    heroDescription: "Add watermarks, remove passwords, rearrange pages, or dramatically compress massive PDF files without ever uploading your confidential files to a remote server.",
  },
  ai: {
    label: "AI Tools",
    icon: "🤖",
    description: "Use AI models to get stuff done - directly in browser!",
    seoTitle: "Free Browser AI Tools | TTS, Generation & Processing | Knicknaks",
    seoDescription: "Experience artificial intelligence running directly in your hardware. Free, completely serverless text-to-speech and AI engines powered by WebGPU.",
    heroTagline: "Local AI directly on your GPU.",
    heroDescription: "Harness powerful machine learning models straight from your browser without subscriptions, API keys, or cloud privacy concerns.",
  },
  other: {
    label: "Other",
    icon: "🧩",
    description: "Miscellaneous tools",
    seoTitle: "Misc Online Tools & Utilities | Free on Knicknaks",
    seoDescription: "A collection of handy miscellaneous web tools and generators. Simple browser-based utilities that solve unique edge-case problems.",
    heroTagline: "The odd jobs and edge cases.",
    heroDescription: "A miscellaneous collection of utilities that don't fit anywhere else, engineered with the same fast, simple, offline philosophy.",
  },
};

// ===== Tool Statuses (derived at runtime) =====
export const TOOL_STATUSES = [
  "new",
  "beta",
  "popular",
  "updated",
] as const;

export type ToolStatus = (typeof TOOL_STATUSES)[number];

export const STATUS_INFO: Record<ToolStatus, { label: string; icon: string }> = {
  popular: { label: "Popular", icon: "🔥" },
  new: { label: "New", icon: "✨" },
  updated: { label: "Updated", icon: "🔨" },
  beta: { label: "Beta", icon: "🧪" },
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
