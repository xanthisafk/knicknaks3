import React from "react";

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
    ({ className = "", children, ...props }, ref) => (
        <tfoot
            ref={ref}
            className={`border-t border-(--border-default) text-(--text-secondary) font-medium [&_tr]:last:border-0 ${className}`}
            {...props}
        >
            {children}
        </tfoot>
    )
);
TableFooter.displayName = "TableFooter";