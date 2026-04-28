import type { ReactNode } from "react";

type TextBlockProps = {
    children: ReactNode;
    className?: string;
};

export function TextBlock({ children, className = "" }: TextBlockProps) {
    return (
        <p className={["leading-7 text-gray-700", className].join(" ")}>
            {children}
        </p>
    );
}