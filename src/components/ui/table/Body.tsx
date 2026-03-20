import React from "react";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ className = "", children, ...props }, ref) => (
        <tbody
            ref={ref}
            className={`text-(--text-primary) [&_tr:last-child]:border-0 ${className}`}
            {...props}
        >
            {children}
        </tbody>
    )
);
TableBody.displayName = "TableBody";