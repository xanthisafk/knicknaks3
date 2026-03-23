import { cn } from "@/lib"
import React from "react"

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    colSpan?: number;
    rowSpan?: number;
    gap?: number;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    ({ colSpan, rowSpan, gap = 3, className, ...props }, ref) => {
        const colSpanClass = typeof colSpan === "number" ? `col-span-${colSpan}` : undefined;
        const rowSpanClass = typeof rowSpan === "number" ? `row-span-${rowSpan}` : undefined;
        const safeGap = typeof gap === "number" && gap > 0 ? gap : 3;
        const gapClass = `space-y-${safeGap}`;

        return (
            <div
                ref={ref}
                className={cn(
                    gapClass,
                    colSpanClass,
                    rowSpanClass,
                    className
                )}
                {...props}
            />
        )
    }
)

Box.displayName = "Box"