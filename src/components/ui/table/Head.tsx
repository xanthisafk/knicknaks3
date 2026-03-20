import React from "react";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className = "", children, ...props }, ref) => (
        <th
            ref={ref}
            className={`h-10 px-3 text-start align-middle text-xs font-medium tracking-wide uppercase text-(--text-secondary) [&:has([role=checkbox])]:pr-0 ${className}`}
            {...props}
        >
            {children}
        </th>
    )
);
TableHead.displayName = "TableHead";