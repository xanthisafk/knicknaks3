import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    mobileCols?: number
    cols?: number
    gap?: number
    customCols?: string
    mdCustomCols?: string
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    (
        {
            mobileCols = 1,
            cols = 1,
            gap = 2,
            customCols,
            mdCustomCols,
            className,
            style,
            ...props
        },
        ref
    ) => {
        // sanitize
        if (cols <= 0) cols = 1
        if (cols > 12) cols = 12
        if (mobileCols <= 0) mobileCols = 1
        if (mobileCols > 12) mobileCols = 12
        if (gap <= 0) gap = 2

        const gapClass = `gap-${gap}`

        const colsClass = !customCols ? `md:grid-cols-${cols}` : undefined
        const mobileColsClass = !customCols
            ? `grid-cols-${mobileCols}`
            : undefined

        const gridStyles: React.CSSProperties = {
            ...style,
            ...(customCols && {
                gridTemplateColumns: customCols,
            }),
        }

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
                style={gridStyles}
                {...props}
            />
        )
    }
)

Container.displayName = "Container"