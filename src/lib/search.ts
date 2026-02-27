import Fuse from "fuse.js";
import type { ToolDefinition } from "@/tools/_types";
import { getAllTools } from "@/tools/_registry";

let fuseInstance: Fuse<ToolDefinition> | null = null;

function getSearchIndex(): Fuse<ToolDefinition> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(getAllTools(), {
      keys: [
        { name: "name", weight: 4 },
        { name: "keywords", weight: 3 },
        { name: "category", weight: 2 },
        { name: "tags", weight: 2 },
        { name: "description", weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1,
      shouldSort: true,
      location: 0,
      distance: 100,
    });
  }
  return fuseInstance;
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query.trim()) return getAllTools();
  const results = getSearchIndex().search(query);
  return results.map((r) => r.item);
}
