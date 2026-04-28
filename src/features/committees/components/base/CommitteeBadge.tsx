import type { ReactNode } from "react";

type CommitteeBadgeVariant = "blue" | "gray";

type CommitteeBadgeProps = {
    children: ReactNode;
    variant?: CommitteeBadgeVariant;
};

const variantClassMap: Record<CommitteeBadgeVariant, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
};

export function CommitteeBadge({
                                   children,
                                   variant = "gray",
                               }: CommitteeBadgeProps) {
    return (
        <span
            className={[
                "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                variantClassMap[variant],
            ].join(" ")}
        >
            {children}
        </span>
    );
}