import React from "react";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ className = "", children, ...props }, ref) => (
        <td
            ref={ref}
            className={`px-3 py-2.5 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
            {...props}
        >
            {children}
        </td>
    )
);
TableCell.displayName = "TableCell";