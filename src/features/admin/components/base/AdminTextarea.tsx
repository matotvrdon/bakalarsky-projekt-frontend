import type { TextareaHTMLAttributes } from "react";

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AdminTextarea({ className = "", ...props }: AdminTextareaProps) {
    return (
        <textarea
            className={[
                "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
                "text-gray-900 placeholder:text-gray-400",
                "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
                "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
                className,
            ].join(" ")}
            {...props}
        />
    );
}