import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type PublicAlertProps = {
    children: ReactNode;
    variant?: "default" | "info" | "success" | "warning" | "danger";
    icon?: LucideIcon;
    className?: string;
};

export function PublicAlert({
                                children,
                                variant = "default",
                                icon: Icon,
                                className = "",
                            }: PublicAlertProps) {
    const variantClassName = {
        default: "border-gray-200 bg-gray-50 text-gray-800",
        info: "border-blue-200 bg-blue-50 text-blue-900",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900",
        warning: "border-amber-200 bg-amber-50 text-amber-900",
        danger: "border-red-200 bg-red-50 text-red-900",
    }[variant];

    return (
        <div
            className={[
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
                variantClassName,
                className,
            ].join(" ")}
        >
            {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0" /> : null}
            <div>{children}</div>
        </div>
    );
}