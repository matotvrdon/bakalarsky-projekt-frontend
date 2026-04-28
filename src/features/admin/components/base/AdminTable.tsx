import type { ReactNode } from "react";

type AdminTableProps = {
    children: ReactNode;
};

type AdminTableCellProps = {
    children: ReactNode;
    className?: string;
};

export function AdminTable({ children }: AdminTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse bg-white text-sm">
                {children}
            </table>
        </div>
    );
}

export function AdminTableHeader({ children }: AdminTableProps) {
    return (
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
        {children}
        </thead>
    );
}

export function AdminTableBody({ children }: AdminTableProps) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function AdminTableRow({ children }: AdminTableProps) {
    return <tr>{children}</tr>;
}

export function AdminTableHead({
                                   children,
                                   className = "",
                               }: AdminTableCellProps) {
    return (
        <th className={`px-4 py-3 font-semibold ${className}`}>
            {children}
        </th>
    );
}

export function AdminTableCell({
                                   children,
                                   className = "",
                               }: AdminTableCellProps) {
    return (
        <td className={`px-4 py-3 text-gray-700 ${className}`}>
            {children}
        </td>
    );
}