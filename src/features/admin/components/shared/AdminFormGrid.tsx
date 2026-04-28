import type { ReactNode } from "react";

type AdminFormGridProps = {
    children: ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
};

export function AdminFormGrid({
                                  children,
                                  columns = 2,
                                  className = "",
                              }: AdminFormGridProps) {
    const columnClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
    }[columns];

    return (
        <div className={`grid min-w-0 gap-4 ${columnClass} ${className}`}>
            {children}
        </div>
    );
}