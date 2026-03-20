import React from "react";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className = "", children, ...props }, ref) => (
        <tr
            ref={ref}
            className={`border-b border-(--border-default)/50 transition-colors hover:bg-(--bg-subtle)/50 data-[state=selected]:bg-(--bg-subtle) ${className}`}
            {...props}
        >
            {children}
        </tr>
    )
);
TableRow.displayName = "TableRow";