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

import {
  toolDefinitionSchema,
  CATEGORY_INFO,
  TOOL_STATUSES,
  type ToolDefinition,
  type ToolCategory,
  type ToolStatus,
  type CategoryDefinition,
} from "./_types";

// Auto-discover all tool definition files at build time
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

// ===== Status derivation =====

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

function isWithin14Days(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff >= 0 && diff < FOURTEEN_DAYS_MS;
}

/**
 * Derive the display status of a tool at runtime.
 * `featured` is NOT a status — it controls homepage selection priority only.
 */
export function getToolStatus(tool: ToolDefinition): ToolStatus | undefined {
  if (tool.status) {
    return tool.status;
  }
  if (isWithin14Days(tool.createdAt) && !tool.launchedAt) {
    return "beta";
  }
  if (
    (isWithin14Days(tool.createdAt) && tool.launchedAt) ||
    isWithin14Days(tool.launchedAt)
  ) {
    return "new";
  }
  if (isWithin14Days(tool.updatedAt)) {
    return "updated";
  }
  if (tool.popular === true) {
    return "popular";
  }
  // 5. no status
  return undefined;
}

// ===== Status priority for sorting =====
const STATUS_PRIORITY: Record<string, number> = {
  featured: 0,
  new: 1,
  popular: 2,
  updated: 3,
  beta: 4,
};

function getToolSortPriority(tool: ToolDefinition): number {
  if (tool.featured) return STATUS_PRIORITY.featured;
  const status = getToolStatus(tool);
  if (status && status in STATUS_PRIORITY) return STATUS_PRIORITY[status];
  return 99;
}

/**
 * Get up to `n` tools for a category, sorted by display priority:
 * featured > popular > new > updated > beta > no status
 */
export function getFeaturedToolsForCategory(
  category: ToolCategory,
  n: number
): ToolDefinition[] {
  const categoryTools = tools.filter((t) => t.category === category);
  categoryTools.sort((a, b) => getToolSortPriority(a) - getToolSortPriority(b));
  return categoryTools.slice(0, n);
}

/**
 * Get category metadata
 */
export function getCategoryMeta(category: ToolCategory): CategoryDefinition {
  return CATEGORY_INFO[category];
}

// ===== Existing exports =====

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
export function getRelatedTools(tool: ToolDefinition, limit: number = 3): ToolDefinition[] {
  const manualSlugs = new Set(tool.relatedTools || []);
  const manualTools = (tool.relatedTools || [])
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => t !== undefined);

  // If we already have enough manual tools, just return them
  if (manualTools.length >= limit) {
    return manualTools.slice(0, limit);
  }

  const currentTags = new Set(tool.tags || []);
  const currentKeywords = new Set(tool.keywords || []);

  // Score all other tools
  const scoredTools = tools
    .filter((t) => t.slug !== tool.slug && !manualSlugs.has(t.slug))
    .map((t) => {
      let score = 0;

      // 1. Tag Match (High Weight)
      if (t.tags) {
        for (const tag of t.tags) {
          if (currentTags.has(tag)) score += 5;
        }
      }

      // 2. Category Match
      if (t.category === tool.category) score += 2;

      // 3. Keyword Match (Detail Weight)
      if (t.keywords) {
        for (const kw of t.keywords) {
          if (currentKeywords.has(kw)) score += 1;
        }
      }

      // 4. Status Tie-breaker
      const status = getToolStatus(t);
      if (status === "popular" || status === "new") score += 0.5;

      return { tool: t, score };
    })
    .filter((item) => item.score > 0);

  // Sort by highest score first
  scoredTools.sort((a, b) => b.score - a.score);

  // Fill the remaining slots
  const algorithmicTools = scoredTools
    .slice(0, limit - manualTools.length)
    .map((item) => item.tool);

  return [...manualTools, ...algorithmicTools];
}
