import { useEffect, useMemo } from "react";
import { CommandPalette, useCommandPalette, type CommandItem } from "@/components/ui/CommandPalette";
import { getAllTools } from "@/tools/_registry";

export interface SearchPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface GlobalPaletteProps {
  blogPosts?: SearchPost[];
  isBlog?: boolean;
}

export default function GlobalPalette({ blogPosts = [], isBlog = false }: GlobalPaletteProps) {
  const palette = useCommandPalette();

  useEffect(() => {
    const handleOpen = () => palette.open();
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, [palette]);

  const items = useMemo<CommandItem[]>(() => {
    if (isBlog) {
      return blogPosts.map((post) => ({
        id: post.id,
        label: post.title,
        description: post.description,
        emoji: "📝",
        group: "Blog Posts",
        keywords: post.tags,
        onSelect: () => {
          window.location.href = `/blog/${post.id}`;
        }
      }));
    }

    return getAllTools().map((t) => ({
      id: t.slug,
      label: t.name,
      description: t.description,
      emoji: t.icon,
      group: t.category,
      keywords: t.keywords,
      onSelect: () => {
        window.location.href = `/tools/${t.category}/${t.slug}`;
      }
    }));
  }, [isBlog, blogPosts]);

  return (
    <CommandPalette
      items={items}
      isOpen={palette.isOpen}
      onClose={palette.close}
      placeholder={isBlog ? "Search articles, guides, or tags..." : "Search for tools..."}
    />
  );
}
