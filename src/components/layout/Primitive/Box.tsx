import { cn } from "@/lib";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
    /** flex: 1; min-width: 0  — fills remaining space without overflowing. */
    grow?: boolean;
    /**
     * flex-shrink: 0 — prevent this box from shrinking below its natural size.
     * Pass `shrink={false}` to apply; omitting the prop leaves default behaviour.
     */
    shrink?: boolean;
    /** Turn the box into a flex centering wrapper (items + justify = center). */
    center?: boolean;
    children?: ReactNode;
    className?: string;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
    ({ grow, shrink, center, className, children, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                grow && "flex-1 min-w-0",
                shrink === false && "shrink-0",
                center && "flex items-center justify-center",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
);
Box.displayName = "Box";