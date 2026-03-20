import React from "react";

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
    children: React.ReactNode;
}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
    ({ className = "", children, ...props }, ref) => (
        <caption
            ref={ref}
            className={`mt-4 text-sm text-(--text-secondary) ${className}`}
            {...props}
        >
            {children}
        </caption>
    )
);
TableCaption.displayName = "TableCaption";