import type { InputHTMLAttributes } from "react";

type AdminCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function AdminCheckbox({ className = "", ...props }: AdminCheckboxProps) {
    return (
        <input
            type="checkbox"
            className={[
                "h-4 w-4 rounded border-gray-300 text-blue-600",
                "focus:ring-2 focus:ring-blue-100",
                className,
            ].join(" ")}
            {...props}
        />
    );
}