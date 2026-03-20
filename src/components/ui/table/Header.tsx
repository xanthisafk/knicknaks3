import React from "react";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
    ({ className = "", children, ...props }, ref) => (
        <thead
            ref={ref}
            className={`border-b border-(--border-default) ${className}`}
            {...props}
        >
            {children}
        </thead>
    )
);
TableHeader.displayName = "TableHeader";