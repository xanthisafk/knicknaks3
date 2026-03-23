import { forwardRef } from "react"
import { cn } from "@/lib"

export interface FloatingContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    edge?: "top" | "bottom" | "left" | "right";
    background?: "blur" | "opaque" | "transparent";
    gap?: number;
    align?: "start" | "center" | "end";
    justify?: "start" | "center" | "end";
    zIndex?: string;
    bordered?: boolean;
    padding?: string;
    distanceFromEdge?: number;
}

export const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(
    (
        {
            edge = "bottom",
            background = "blur",
            gap = 2,
            align,
            justify,
            zIndex = "z-10",
            padding = "px-4 py-3",
            distanceFromEdge = 2,
            className,
            children,
            ...rest
        }: FloatingContainerProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const isHorizontal = edge === "top" || edge === "bottom"

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute flex",

                    // edge positioning
                    edge === "top" && `top-${distanceFromEdge} left-0 right-0`,
                    edge === "bottom" && `bottom-${distanceFromEdge} left-0 right-0`,
                    edge === "left" && `left-${distanceFromEdge} top-0 bottom-0`,
                    edge === "right" && `right-${distanceFromEdge} top-0 bottom-0`,

                    // direction
                    isHorizontal ? "flex-row" : "flex-col",

                    // background
                    background === "blur" && "backdrop-blur bg-(--surface-elevated)/70",
                    background === "opaque" && "bg-(--surface-elevated)",
                    background === "transparent" && "bg-transparent",

                    // spacing
                    `gap-${gap}`,
                    align && `items-${align}`,
                    justify && `justify-${justify}`,

                    zIndex,
                    padding,
                    className
                )}
                {...rest}
            >
                {children}
            </div>
        )
    }
)

FloatingContainer.displayName = "FloatingContainer"