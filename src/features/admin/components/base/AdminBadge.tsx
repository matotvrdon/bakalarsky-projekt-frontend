import type { ReactNode } from "react";

type AdminBadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "neutral"
    | "info"
    | "orange"
    | "outline";

type AdminBadgeProps = {
    children: ReactNode;
    variant?: AdminBadgeVariant;
    className?: string;
    onClick?: () => void;
};

export function AdminBadge({
                               children,
                               variant = "default",
                               className = "",
                               onClick,
                           }: AdminBadgeProps) {
    const variantClass = {
        default: "bg-blue-600 text-white border-blue-600",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        neutral: "bg-gray-100 text-gray-700 border-gray-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
        orange: "bg-orange-100 text-orange-800 border-orange-200",
        outline: "bg-white text-gray-700 border-gray-300",
    }[variant];

    return (
        <span
            onClick={onClick}
            className={[
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                onClick ? "cursor-pointer hover:opacity-80" : "",
                variantClass,
                className,
            ].join(" ")}
        >
      {children}
    </span>
    );
}