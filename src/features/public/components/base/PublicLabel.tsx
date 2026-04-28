import type { ReactNode } from "react";

type PublicLabelProps = {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
};

export function PublicLabel({
                                htmlFor,
                                children,
                                className = "",
                            }: PublicLabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={[
                "text-sm font-semibold text-gray-800",
                className,
            ].join(" ")}
        >
            {children}
        </label>
    );
}