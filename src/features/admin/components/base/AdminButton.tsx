import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

type AdminButtonSize = "sm" | "md" | "lg" | "icon";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: AdminButtonVariant;
    size?: AdminButtonSize;
    icon?: ReactNode;
    children?: ReactNode;
};

export function AdminButton({
                                variant = "primary",
                                size = "md",
                                icon,
                                children,
                                className = "",
                                type = "button",
                                ...props
                            }: AdminButtonProps) {
    const variantClass = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-100",
        outline: "bg-white text-gray-800 hover:bg-gray-50 border-gray-300 shadow-sm",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-transparent",
        danger: "bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-sm",
    }[variant];

    const sizeClass = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "h-9 w-9 p-0",
    }[size];

    return (
        <button
            type={type}
            className={[
                "inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border font-semibold transition-colors",
                "disabled:pointer-events-none disabled:opacity-50",
                variantClass,
                sizeClass,
                className,
            ].join(" ")}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}