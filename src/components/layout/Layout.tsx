import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ===== Box =====
interface BoxProps {
  children: ReactNode;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
}

export function Box({ children, className, as: Tag = "div" }: BoxProps) {
  return <Tag className={className}>{children}</Tag>;
}

// ===== Container =====
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const containerSizes: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({ children, className, size = "xl" }: ContainerProps) {
  return (
    <div className={cn("w-full mx-auto px-4 md:px-6 lg:px-8", containerSizes[size], className)}>
      {children}
    </div>
  );
}

// ===== Panel =====
interface PanelProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const panelPadding: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

export function Panel({ children, className, padding = "md" }: PanelProps) {
  return (
    <div
      className={cn(
        "bg-[var(--surface-elevated)] rounded-[var(--radius-lg)]",
        "border border-[var(--border-default)]",
        panelPadding[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ===== Card =====
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  const interactive = hoverable || !!onClick;
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "bg-[var(--surface-elevated)] rounded-[var(--radius-lg)]",
        "border border-[var(--border-default)]",
        "p-4 md:p-5",
        interactive && [
          "cursor-pointer transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          "hover:border-[var(--border-hover)] hover:shadow-md",
          "hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-sm",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}

// ===== Section =====
interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Section({ children, className, title, description }: SectionProps) {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      {(title || description) && (
        <div className="mb-6 md:mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text(--text-primary)">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text(--text-secondary) max-w-2xl">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// ===== Grid =====
interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const gridGap: Record<string, string> = {
  sm: "gap-3",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
};

export function Grid({ children, className, cols = 3, gap = "md" }: GridProps) {
  return (
    <div className={cn("grid", gridCols[cols], gridGap[gap], className)}>
      {children}
    </div>
  );
}
