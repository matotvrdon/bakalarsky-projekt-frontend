import type { ReactNode } from "react";
import { AdminLabel } from "../base";

type AdminFormFieldProps = {
    label: string;
    htmlFor?: string;
    description?: string;
    required?: boolean;
    children: ReactNode;
};

export function AdminFormField({
                                   label,
                                   htmlFor,
                                   description,
                                   required,
                                   children,
                               }: AdminFormFieldProps) {
    return (
        <div className="space-y-2">
            <AdminLabel htmlFor={htmlFor} required={required}>
                {label}
            </AdminLabel>

            {children}

            {description && (
                <p className="text-xs text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}