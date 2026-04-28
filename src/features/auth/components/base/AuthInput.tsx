import type { InputHTMLAttributes } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement>;

export function AuthInput({ className = "", ...props }: AuthInputProps) {
    return (
        <input
            {...props}
            className={[
                "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500",
                className,
            ].join(" ")}
        />
    );
}