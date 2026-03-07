#!/usr/bin/env node

/**
 * Tool Scaffolding Script
 * Usage: npm run new-tool
 *
 * Creates a new tool directory with index.ts and Component files
 * from templates, validates slug uniqueness.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { createInterface } from "readline";

const TOOLS_DIR = resolve(import.meta.dirname, "../src/tools");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const CATEGORIES = [
  "encoders", "generators", "converters", "formatters",
  "validators", "calculators", "text", "media",
  "network", "crypto", "dev", "health", "pdf", "other",
];

async function main() {
  console.log("\n🧩 Knicknaks — New Tool Scaffolder\n");

  const name = await ask("Tool name (e.g. 'URL Encoder'): ");
  if (!name.trim()) { console.log("❌ Name is required."); process.exit(1); }

  const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = (await ask(`Slug [${defaultSlug}]: `)).trim() || defaultSlug;

  // Validate slug format
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.log("❌ Slug must be lowercase alphanumeric with hyphens.");
    process.exit(1);
  }

  // Check for duplicate slugs
  const existing = readdirSync(TOOLS_DIR).filter(
    (d) => d !== "_types.ts" && d !== "_registry.ts"
  );
  if (existing.includes(slug)) {
    console.log(`❌ Tool with slug "${slug}" already exists.`);
    process.exit(1);
  }

  const description = await ask("Short description: ");
  console.log(`\nCategories: ${CATEGORIES.join(", ")}`);
  const category = await ask("Category: ");
  if (!CATEGORIES.includes(category)) {
    console.log(`❌ Invalid category. Must be one of: ${CATEGORIES.join(", ")}`);
    process.exit(1);
  }

  const icon = (await ask("Icon emoji [🔧]: ")).trim() || "🔧";
  const keywords = (await ask("Keywords (comma-separated): ")).split(",").map((k) => k.trim()).filter(Boolean);

  rl.close();

  // Create directory
  const toolDir = join(TOOLS_DIR, slug);
  mkdirSync(toolDir, { recursive: true });

  // PascalCase component name
  const componentName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  // Write index.ts
  const indexContent = `import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "${name}",
  slug: "${slug}",
  description: "${description}",
  category: "${category}",
  icon: "${icon}",
  status: "alpha",
  keywords: ${JSON.stringify(keywords)},

  component: () => import("./${componentName}Tool"),

  capabilities: {
    supportsOffline: true,
  },

  lastUpdated: "${new Date().toISOString().split("T")[0]}",
};
`;

  // Write component
  const componentContent = `export default function ${componentName}Tool() {
  return (
    <div className="space-y-4">
      <p className="text(--text-secondary)">
        ${componentName} tool — ready to build!
      </p>
    </div>
  );
}
`;

  writeFileSync(join(toolDir, "index.ts"), indexContent);
  writeFileSync(join(toolDir, `${componentName}Tool.tsx`), componentContent);

  console.log(`\n✅ Tool created at src/tools/${slug}/`);
  console.log(`   ├── index.ts`);
  console.log(`   └── ${componentName}Tool.tsx`);
  console.log(`\nRun \`npm run dev\` and visit /tools/${slug}\n`);
}

main().catch(console.error);
