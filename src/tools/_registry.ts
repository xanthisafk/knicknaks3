/**
 * Tool Registry — Auto-discovery system
 *
 * Uses import.meta.glob to discover all tools at build time.
 * Each tool must export a `definition` from its index.ts file.
 *
 * Adding a new tool:
 * 1. Create a folder in src/tools/{slug}/
 * 2. Add index.ts exporting `definition` (ToolDefinition)
 * 3. Add your React component
 * 4. Build — the tool appears automatically everywhere
 */

import { toolDefinitionSchema, type ToolDefinition, type ToolCategory } from "./_types";

// Auto-discover all tool definition files at build time
// Each tool folder must have an index.ts that exports `definition`
const toolModules = import.meta.glob<{ definition: ToolDefinition }>("./*/index.ts", {
  eager: true,
});

// Validate and collect all tools
const tools: ToolDefinition[] = [];
const slugSet = new Set<string>();

for (const [path, module] of Object.entries(toolModules)) {
  if (!module.definition) {
    console.warn(`[Knicknaks] Tool at ${path} does not export a "definition". Skipping.`);
    continue;
  }

  const result = toolDefinitionSchema.safeParse(module.definition);

  if (!result.success) {
    console.error(
      `[Knicknaks] Tool at ${path} has invalid definition:`,
      result.error.format()
    );
    continue;
  }

  if (slugSet.has(module.definition.slug)) {
    console.error(
      `[Knicknaks] Duplicate slug "${module.definition.slug}" found at ${path}. Skipping.`
    );
    continue;
  }

  slugSet.add(module.definition.slug);
  tools.push(module.definition);
}

// Sort alphabetically by name
tools.sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get all registered tools
 */
export function getAllTools(): ToolDefinition[] {
  return tools;
}

/**
 * Get a single tool by slug
 */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

/**
 * Get all tools in a specific category
 */
export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

/**
 * Get all unique categories that have at least one tool
 */
export function getActiveCategories(): ToolCategory[] {
  const categories = new Set(tools.map((t) => t.category));
  return Array.from(categories);
}

/**
 * Get tools related to a given tool
 */
export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  if (!tool.relatedTools?.length) {
    // Fallback: return other tools in the same category
    return tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);
  }
  return tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => t !== undefined);
}
