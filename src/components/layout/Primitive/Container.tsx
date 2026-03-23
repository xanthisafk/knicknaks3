import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gapMap, alignMap, justifyMap, wrapMap, type Gap, type Align, type Justify, type Wrap } from "./types";


export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    /** Layout direction. Defaults to "vertical" (flex-col). */
    orientation?: "horizontal" | "vertical";
    /** Gap between children. Defaults to "2". */
    gap?: Gap;
    /** Align items along the cross-axis. */
    align?: Align;
    /** Justify items along the main axis. */
    justify?: Justify;
    /** Flex wrapping behaviour. Defaults to "nowrap". */
    wrap?: Wrap;
    /** Make the container full-width. */
    full?: boolean;
    children?: ReactNode;
    className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    (
        {
            orientation = "vertical",
            gap = "2",
            align,
            justify,
            wrap = "nowrap",
            full,
            className,
            children,
            ...rest
        },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "flex",
                orientation === "horizontal" ? "flex-row" : "flex-col",
                gapMap[gap],
                align && alignMap[align],
                justify && justifyMap[justify],
                wrapMap[wrap],
                full && "w-full",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
);
Container.displayName = "Container";