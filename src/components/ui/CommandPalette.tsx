import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Types =====

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  emoji?: string;
  group?: string;
  keywords?: string[];
  tags?: string[];
  onSelect: () => void;
  disabled?: boolean;
}

interface CommandPaletteProps {
  items: CommandItem[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  /** Optional header above the input */
  header?: ReactNode;
}

// ===== Helpers =====

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

/**
 * Score a single field against the query.
 * Returns 0 if no match, positive number if matched.
 */
function scoreField(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!t) return 0;

  // Exact full match
  if (t === q) return 100;
  // Starts with query
  if (t.startsWith(q)) return 80;
  // Contains query as a substring
  if (t.includes(q)) return 60;

  // Fuzzy sequential character match
  let score = 0;
  let qi = 0;
  let lastMatch = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastMatch === ti - 1 ? 10 : 5;
      lastMatch = ti;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

/**
 * Priority weights for each field.
 * label > tags > keywords > description (and everything else)
 */
const FIELD_WEIGHTS = {
  label: 1000,
  tags: 100,
  keywords: 10,
  description: 1,
} as const;

/**
 * Compute the total weighted score for an item against the query.
 * Higher = better match.
 */
function scoreItem(query: string, item: CommandItem): number {
  const labelScore = scoreField(query, item.label) * FIELD_WEIGHTS.label;

  const tagsScore =
    (item.tags ?? []).reduce(
      (best, tag) => Math.max(best, scoreField(query, tag)),
      0
    ) * FIELD_WEIGHTS.tags;

  const keywordsScore =
    (item.keywords ?? []).reduce(
      (best, kw) => Math.max(best, scoreField(query, kw)),
      0
    ) * FIELD_WEIGHTS.keywords;

  const descScore =
    scoreField(query, item.description ?? "") * FIELD_WEIGHTS.description;

  return labelScore + tagsScore + keywordsScore + descScore;
}

/**
 * Return true if the item has any match across all searchable fields.
 */
function itemMatches(query: string, item: CommandItem): boolean {
  const fields = [
    item.label,
    item.description ?? "",
    ...(item.tags ?? []),
    ...(item.keywords ?? []),
  ];
  return fields.some((f) => fuzzyMatch(query, f));
}

function renderItemVisual(icon?: LucideIcon, emoji?: string) {
  const Icon = icon;
  if (Icon) {
    return (
      <Icon
        size={16}
        aria-hidden="true"
        className="shrink-0 text-(--text-tertiary)"
      />
    );
  }
  if (emoji) {
    return (
      <span
        className="font-emoji text-base leading-none shrink-0"
        aria-hidden="true"
      >
        {emoji}
      </span>
    );
  }
  return <span className="w-4 h-4 shrink-0" aria-hidden="true" />;
}

// ===== Component =====

export function CommandPalette({
  items,
  isOpen,
  onClose,
  placeholder = "Type a command…",
  emptyMessage = "No results found.",
  className,
  header,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter & score with priority: label > tags > keywords > description
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.filter((i) => !i.disabled);

    return items
      .filter((item) => !item.disabled && itemMatches(query, item))
      .sort((a, b) => scoreItem(query, b) - scoreItem(query, a));
  }, [items, query]);

  // Group items
  const grouped = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of filteredItems) {
      const group = item.group ?? "";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group)!.push(item);
    }
    return groups;
  }, [filteredItems]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Keep active index in bounds
  useEffect(() => {
    if (activeIndex >= filteredItems.length) {
      setActiveIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[activeIndex]) {
            filteredItems[activeIndex].onSelect();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredItems, activeIndex, onClose]
  );

  // Click handler for backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-(--surface-overlay) backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-label="Command palette"
        className={cn(
          "relative z-10 w-full max-w-xl",
          "bg-(--surface-elevated)",
          "border border-(--border-default)",
          "rounded-xl shadow-2xl",
          "overflow-hidden",
          "flex flex-col max-h-[clamp(300px,60vh,500px)]",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Optional header */}
        {header && (
          <div className="px-4 py-2 border-b border-(--border-default) text-xs text-(--text-tertiary)">
            {header}
          </div>
        )}

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-(--border-default)">
          <Search
            size={18}
            className="shrink-0 text-(--text-tertiary)"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            className={cn(
              "flex-1 bg-transparent text-sm text-(--text-primary)",
              "placeholder:text-(--text-tertiary)",
              "outline-none border-none"
            )}
            aria-label="Search commands"
            aria-autocomplete="list"
            role="combobox"
            aria-expanded={true}
            aria-controls="command-list"
            aria-activedescendant={
              filteredItems[activeIndex]
                ? `command-item-${filteredItems[activeIndex].id}`
                : undefined
            }
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-(--text-tertiary) bg-(--surface-secondary) border border-(--border-default) rounded-sm">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-list"
          role="listbox"
          className="overflow-y-auto flex-1 p-2"
        >
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-(--text-tertiary)">
              {emptyMessage}
            </div>
          ) : (
            Array.from(grouped.entries()).map(([group, groupItems]) => (
              <div key={group}>
                {group && (
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary)">
                    {group}
                  </div>
                )}
                {groupItems.map((item) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={item.id}
                      id={`command-item-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      data-index={idx}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md",
                        "cursor-pointer select-none",
                        "transition-colors duration-(--duration-fast)",
                        isActive
                          ? "bg-primary-500 text-white"
                          : "text-(--text-primary) hover:bg-(--surface-secondary)"
                      )}
                    >
                      {renderItemVisual(item.icon, item.emoji)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.label}
                        </div>
                        {item.description && (
                          <div
                            className={cn(
                              "text-xs truncate mt-0.5",
                              isActive
                                ? "text-white/70"
                                : "text-(--text-tertiary)"
                            )}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <CornerDownLeft
                          size={14}
                          className="shrink-0 opacity-60"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-(--border-default) text-[10px] text-(--text-tertiary)">
          <span className="inline-flex items-center gap-1">
            <ArrowUp size={10} aria-hidden="true" />
            <ArrowDown size={10} aria-hidden="true" />
            Navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft size={10} aria-hidden="true" />
            Select
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-(--surface-secondary) border border-(--border-default) rounded-sm text-[9px]">
              ESC
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== Hook for keyboard shortcut =====

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((o) => !o),
  };
}