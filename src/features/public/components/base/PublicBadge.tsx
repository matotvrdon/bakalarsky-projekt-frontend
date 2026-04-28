import type { ReactNode } from "react";

type PublicBadgeProps = {
    children: ReactNode;
    className?: string;
};

export function PublicBadge({ children, className = "" }: PublicBadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700",
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}