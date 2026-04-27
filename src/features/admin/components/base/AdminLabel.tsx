import type { LabelHTMLAttributes, ReactNode } from "react";

type AdminLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
    children: ReactNode;
    required?: boolean;
};

export function AdminLabel({
                               children,
                               required,
                               className = "",
                               ...props
                           }: AdminLabelProps) {
    return (
        <label
            className={`text-sm font-medium text-gray-700 ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
}