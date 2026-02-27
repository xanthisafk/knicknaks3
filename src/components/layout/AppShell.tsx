import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Layout";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== HEADER ===== */}
      <header
        className={cn(
          "sticky top-0 z-40",
          "bg-[var(--surface-bg)]/80 backdrop-blur-lg",
          "border-b border-[var(--border-default)]"
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 text-[var(--text-primary)] no-underline group"
            >
              <span className="text-2xl">🧩</span>
              <span className="text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight">
                <span className="doodle-underline">Knicknaks</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <a
                href="/"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                All Tools
              </a>
              <a
                href="/#categories"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Categories
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                type="button"
                className={cn(
                  "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)]",
                  "bg-[var(--surface-secondary)] text-[var(--text-tertiary)]",
                  "border border-[var(--border-default)]",
                  "hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "text-sm"
                )}
                aria-label="Search tools"
              >
                <span>🔍</span>
                <span>Search...</span>
                <kbd className="ml-4 px-1.5 py-0.5 text-xs bg-[var(--surface-bg)] rounded border border-[var(--border-default)]">
                  ⌘K
                </kbd>
              </button>

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  "hover:bg-[var(--surface-secondary)]",
                  "transition-colors duration-[var(--duration-fast)]"
                )}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  "hover:bg-[var(--surface-secondary)]",
                  "transition-colors duration-[var(--duration-fast)]"
                )}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-default)] bg-[var(--surface-bg)]">
            <Container>
              <nav className="flex flex-col py-4 gap-2" aria-label="Mobile navigation">
                <a
                  href="/"
                  className="px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  All Tools
                </a>
                <a
                  href="/#categories"
                  className="px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  Categories
                </a>
              </nav>
            </Container>
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[var(--border-default)] py-8 mt-12">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <span>🧩</span>
              <span className="text-sm">
                Knicknaks — Free tools, no nonsense.
              </span>
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">
              100% client-side. No data leaves your browser.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
