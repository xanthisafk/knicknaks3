import { useState, useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "text" | "markdown" | "html";

interface AccordionProps {
  label: string;
  content: string | ReactNode;
  labelIcon?: LucideIcon;
  labelEmoji?: string;
  contentType?: ContentType;
  defaultOpen?: boolean;
  className?: string;
}

function renderLabelVisual(icon?: LucideIcon, emoji?: string) {
  const Icon = icon;
  if (Icon) {
    return <Icon size={16} aria-hidden="true" className="shrink-0" />;
  }
  if (emoji) {
    return (
      <span className="font-emoji text-base leading-none shrink-0" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return null;
}

function renderContent(content: string | ReactNode, contentType: ContentType) {
  if (typeof content !== "string") {
    return <>{content}</>;
  }

  switch (contentType) {
    case "markdown":
      return <MarkdownContent content={content} />;
    case "html":
      return (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case "text":
    default:
      return <p className="text-sm text-(--text-secondary) leading-relaxed">{content}</p>;
  }
}

/** Lazy markdown renderer — loads `marked` dynamically */
function MarkdownContent({ content }: { content: string }) {
  const [html, setHtml] = useState<string | null>(null);

  if (html === null) {
    import("marked").then(({ marked }) => {
      const result = marked.parse(content);
      if (typeof result === "string") {
        setHtml(result);
      } else {
        result.then((r) => setHtml(r));
      }
    });
    return (
      <p className="text-sm text-(--text-tertiary) italic">Loading...</p>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Accordion({
  label,
  content,
  labelIcon,
  labelEmoji,
  contentType = "text",
  defaultOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const headingId = `${id}-heading`;
  const panelId = `${id}-panel`;

  return (
    <div
      className={cn(
        "border border-(--border-default) rounded-lg",
        "bg-(--surface-elevated)",
        "overflow-hidden",
        "transition-shadow duration-(--duration-fast)",
        isOpen && "shadow-sm",
        className
      )}
    >
      {/* Trigger */}
      <button
        type="button"
        id={headingId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3",
          "text-left text-sm font-semibold",
          "text-(--text-primary)",
          "hover:bg-(--surface-secondary)",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--border-focus)",
          "cursor-pointer select-none",
          "transition-colors duration-(--duration-fast)"
        )}
      >
        {renderLabelVisual(labelIcon, labelEmoji)}
        <span className="flex-1">{label}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-(--text-tertiary)",
            "transition-transform duration-(--duration-normal)",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={cn(
          "grid transition-[grid-template-rows] duration-(--duration-normal) ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">
            {renderContent(content, contentType)}
          </div>
        </div>
      </div>
    </div>
  );
}
