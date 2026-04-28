import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

type AuthAlertProps = {
    children?: ReactNode;
    message?: string;
    variant?: "default" | "info" | "success" | "warning" | "danger";
    className?: string;
};

export function AuthAlert({
                              children,
                              message,
                              variant = "danger",
                              className = "",
                          }: AuthAlertProps) {
    const content = children ?? message;

    if (!content) {
        return null;
    }

    const variantClassName = {
        default: "border-gray-200 bg-gray-50 text-gray-800",
        info: "border-blue-200 bg-blue-50 text-blue-900",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900",
        warning: "border-amber-200 bg-amber-50 text-amber-900",
        danger: "border-red-200 bg-red-50 text-red-900",
    }[variant];

    const iconClassName = {
        default: "text-gray-600",
        info: "text-blue-600",
        success: "text-emerald-600",
        warning: "text-amber-600",
        danger: "text-red-600",
    }[variant];

    return (
        <div
            className={[
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
                variantClassName,
                className,
            ].join(" ")}
        >
            <AlertCircle className={["mt-0.5 h-4 w-4 shrink-0", iconClassName].join(" ")} />
            <div>{content}</div>
        </div>
    );
}