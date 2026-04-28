import type { InputHTMLAttributes } from "react";

import { AuthInput, AuthLabel } from "./base/index.ts";

type AuthFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export function AuthFormField({
                                  label,
                                  error,
                                  id,
                                  ...props
                              }: AuthFormFieldProps) {
    return (
        <div className="space-y-2">
            <AuthLabel htmlFor={id}>{label}</AuthLabel>

            <AuthInput
                id={id}
                aria-invalid={Boolean(error)}
                {...props}
            />

            {error ? (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            ) : null}
        </div>
    );
}