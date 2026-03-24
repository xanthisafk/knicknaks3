import { forwardRef } from "react"
import { cn } from "@/lib"

export interface FloatingContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    background?: "blur" | "opaque" | "transparent";
    gap?: number;
    align?: "start" | "center" | "end";
    justify?: "start" | "center" | "end";
    zIndex?: string;
    padding?: string;
    distanceFromEdge?: number;
}

export const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(
    (
        {
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

        return (
            <div
                ref={ref}
                className={cn(
                    "flex sticky rounded-lg",

                    `bottom-${distanceFromEdge} left-0 right-0`,

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