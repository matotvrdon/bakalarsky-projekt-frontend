import type { ReactNode } from "react";

type PublicOptionCardProps = {
    children: ReactNode;
    selected?: boolean;
    htmlFor?: string;
    disabled?: boolean;
    className?: string;
};

export function PublicOptionCard({
                                     children,
                                     selected,
                                     htmlFor,
                                     disabled = false,
                                     className = "",
                                 }: PublicOptionCardProps) {
    return (
        <label
            htmlFor={disabled ? undefined : htmlFor}
            className={[
                "flex items-start gap-3 rounded-xl border p-4 transition",
                selected
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white",
                disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-gray-50",
                className,
            ].join(" ")}
        >
            {children}
        </label>
    );
}