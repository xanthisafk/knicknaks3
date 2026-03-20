import * as React from "react";

// ─── Table ────────────────────────────────────────────────────────────────────

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className = "", children, ...props }, ref) => (
        <div className="w-full overflow-x-auto">
            <table
                ref={ref}
                className={`w-full caption-bottom text-sm ${className}`}
                {...props}
            >
                {children}
            </table>
        </div>
    )
);
Table.displayName = "Table";
