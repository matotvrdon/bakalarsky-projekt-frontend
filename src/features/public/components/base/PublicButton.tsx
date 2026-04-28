import type { ButtonHTMLAttributes } from "react";

type PublicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
};

export function PublicButton({
                                 variant = "primary",
                                 size = "md",
                                 className = "",
                                 children,
                                 ...props
                             }: PublicButtonProps) {
    const variantClassName = {
        primary:
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600",
        outline:
            "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:hover:bg-white",
        danger:
            "border-red-600 bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600",
    }[variant];

    const sizeClassName = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
    }[size];

    return (
        <button
            {...props}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
                variantClassName,
                sizeClassName,
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}