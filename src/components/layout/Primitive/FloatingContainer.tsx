import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { alignMap, bgClasses, edgeBorder, edgeClasses, edgeOrientation, gapMap, justifyMap, type Align, type FloatBackground, type FloatEdge, type Gap, type Justify } from "./types";
import { cn } from "@/lib";


export interface FloatingContainerProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Which edge of the nearest positioned ancestor to dock to.
     * Defaults to "bottom".
     */
    edge?: FloatEdge;
    /**
     * Background treatment.
     * - "blur"         semi-transparent + frosted glass (default)
     * - "opaque"       fully opaque surface colour
     * - "transparent"  no background
     */
    background?: FloatBackground;
    /** Gap between children. Defaults to "2". */
    gap?: Gap;
    /** Align items along the cross-axis. */
    align?: Align;
    /** Justify items along the main axis. */
    justify?: Justify;
    /** z-index utility class. Defaults to "z-10". */
    zIndex?: string;
    /**
     * Draw a border on the inward edge (between float and main content).
     * Defaults to true.
     */
    bordered?: boolean;
    /** Padding applied to the container. Defaults to "px-4 py-3". */
    padding?: string;
    children?: ReactNode;
    className?: string;
}

export const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(
    (
        {
            edge = "bottom",
            background = "blur",
            gap = "2",
            align,
            justify,
            zIndex = "z-10",
            bordered = true,
            padding = "px-4 py-3",
            className,
            children,
            ...rest
        },
        ref
    ) => {
        const orientation = edgeOrientation[edge];

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute",
                    edgeClasses[edge],
                    bgClasses[background],
                    zIndex,
                    bordered && edgeBorder[edge],
                    padding,
                    "flex",
                    orientation === "horizontal" ? "flex-row" : "flex-col",
                    gapMap[gap],
                    align && alignMap[align],
                    justify && justifyMap[justify],
                    className
                )}
                {...rest}
            >
                {children}
            </div>
        );
    }
);
FloatingContainer.displayName = "FloatingContainer";