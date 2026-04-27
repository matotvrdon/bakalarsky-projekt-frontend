import type { ReactNode } from "react";

type AdminEmptyStateProps = {
    title: string;
    description?: string;
    action?: ReactNode;
};

export function AdminEmptyState({
                                    title,
                                    description,
                                    action,
                                }: AdminEmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
            <h3 className="font-semibold text-gray-900">
                {title}
            </h3>

            {description && (
                <p className="mt-2 text-sm text-gray-600">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4 flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
}