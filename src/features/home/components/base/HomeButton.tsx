import { Link } from "react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type HomeButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type HomeButtonSize = "sm" | "md" | "lg";

type HomeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: HomeButtonVariant;
    size?: HomeButtonSize;
    children: ReactNode;
};

type HomeButtonLinkProps = {
    to: string;
    variant?: HomeButtonVariant;
    size?: HomeButtonSize;
    children: ReactNode;
    className?: string;
};

const getVariantClass = (variant: HomeButtonVariant) => {
    if (variant === "primary") {
        return "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700";
    }

    if (variant === "secondary") {
        return "border-white bg-white text-blue-700 hover:bg-blue-50";
    }

    if (variant === "outline") {
        return "border-white bg-transparent text-white hover:bg-white hover:text-blue-700";
    }

    return "border-transparent bg-transparent text-gray-700 hover:bg-gray-100";
};

const getSizeClass = (size: HomeButtonSize) => {
    if (size === "sm") {
        return "h-9 px-3 text-sm";
    }

    if (size === "lg") {
        return "h-12 px-6 text-base";
    }

    return "h-10 px-4 text-sm";
};

const getButtonClassName = (
    variant: HomeButtonVariant,
    size: HomeButtonSize,
    className = ""
) =>
    [
        "inline-flex items-center justify-center rounded-lg border font-semibold shadow-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-white/40",
        "disabled:pointer-events-none disabled:opacity-50",
        getVariantClass(variant),
        getSizeClass(size),
        className,
    ].join(" ");

export function HomeButton({
                               variant = "primary",
                               size = "md",
                               className = "",
                               type = "button",
                               children,
                               ...props
                           }: HomeButtonProps) {
    return (
        <button
            type={type}
            className={getButtonClassName(variant, size, className)}
            {...props}
        >
            {children}
        </button>
    );
}

export function HomeButtonLink({
                                   to,
                                   variant = "primary",
                                   size = "md",
                                   className = "",
                                   children,
                               }: HomeButtonLinkProps) {
    return (
        <Link
            to={to}
            className={getButtonClassName(variant, size, className)}
        >
            {children}
        </Link>
    );
}