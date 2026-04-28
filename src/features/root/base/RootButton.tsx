import type { ButtonHTMLAttributes } from "react";

type RootButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md";
};

export function RootButton({
                               variant = "primary",
                               size = "md",
                               className = "",
                               children,
                               ...props
                           }: RootButtonProps) {
    const variantClassName = {
        primary:
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600",
        outline:
            "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:hover:bg-white",
        ghost:
            "border-transparent bg-transparent text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent",
    }[variant];

    const sizeClassName = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-sm",
    }[size];

    return (
        <button
            {...props}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                variantClassName,
                sizeClassName,
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}