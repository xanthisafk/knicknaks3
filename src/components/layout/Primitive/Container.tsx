import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    mobileCols?: number;
    cols?: number;
    gap?: number;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
    mobileCols = 1,
    cols = 1,
    gap = 2,
    className,
    ...props
}, ref) => {
    if (cols <= 0) cols = 1;
    if (cols > 12) cols = 12;
    if (mobileCols <= 0) mobileCols = 1;
    if (mobileCols > 12) mobileCols = 12;
    if (gap <= 0) gap = 2;
    const gapClass = typeof gap === "number" ? `gap-${gap}` : undefined;
    const colsClass = typeof cols === "number" ? `md:grid-cols-${cols}` : undefined;
    const mobileColsClass = typeof mobileCols === "number" ? `grid-cols-${mobileCols}` : undefined;

    return (
        <div
            ref={ref}
            className={cn(
                "grid",
                gapClass,
                mobileColsClass,
                colsClass,
                className
            )}
            {...props}
        />
    )
}
)

Container.displayName = "Container"