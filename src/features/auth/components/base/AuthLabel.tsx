import type { ReactNode } from "react";

type AuthLabelProps = {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
};

export function AuthLabel({ htmlFor, children, className = "" }: AuthLabelProps) {
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