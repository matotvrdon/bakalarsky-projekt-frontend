import type { ReactNode } from "react";

type PublicOptionCardProps = {
    children: ReactNode;
    selected?: boolean;
    htmlFor?: string;
    className?: string;
};

export function PublicOptionCard({
                                     children,
                                     selected,
                                     htmlFor,
                                     className = "",
                                 }: PublicOptionCardProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:bg-gray-50",
                selected ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white",
                className,
            ].join(" ")}
        >
            {children}
        </label>
    );
}