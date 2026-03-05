import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { useHotkeys } from "react-hotkeys-hook";

export type SearchPost = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

interface BlogSearchProps {
  posts: SearchPost[];
}

export default function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = React.useMemo(() => {
    return new Fuse(posts, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
    });
  }, [posts]);

  const results = query ? fuse.search(query).map(r => r.item).slice(0, 5) : [];

  // Hotkey to focus search (Ctrl+K or Cmd+K)
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    inputRef.current?.focus();
    setIsOpen(true);
  });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 z-50" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[--text-tertiary] group-focus-within:text-[--color-primary-500] transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-11 pr-14 py-4 border-2 border-[--border-default] rounded-[--radius-full] leading-5 bg-[--surface-elevated] text-[--text-primary] placeholder-[--text-tertiary] focus:outline-none focus:ring-0 focus:border-[--color-primary-500] sm:text-base transition-all shadow-sm hover:border-[--border-hover] doodle-border"
          placeholder="Search articles, guides, or tags... (Cmd+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
           <span className="text-xs font-bold text-[--text-tertiary] px-2 py-1 border border-[--border-default] rounded-[--radius-md] bg-[--surface-bg]">
             ⌘K
           </span>
        </div>
      </div>

      {isOpen && query && (
        <div className="absolute mt-3 w-full bg-[--surface-elevated] shadow-2xl rounded-[--radius-xl] border-2 border-[--border-default] overflow-hidden doodle-border transform transition-all">
          {results.length > 0 ? (
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((post) => (
                <li key={post.id} className="border-b border-[--border-default] last:border-b-0">
                  <a
                    href={`/blog/${post.id}`}
                    className="block px-6 py-4 hover:bg-[--surface-secondary] transition-colors group"
                  >
                    <h4 className="text-lg font-bold text-[--text-primary] mb-1 font-[family-name:var(--font-heading)] group-hover:text-[--color-primary-500] transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-[--text-secondary] line-clamp-2 mb-3 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 4).map(tag => (
                         <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[--surface-bg] text-[--text-secondary] border border-[--border-default] rounded-[--radius-sm]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center text-[--text-secondary]">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium text-[--text-primary] mb-1">No results found</p>
              <p className="text-sm">We couldn't find any articles matching "{query}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
