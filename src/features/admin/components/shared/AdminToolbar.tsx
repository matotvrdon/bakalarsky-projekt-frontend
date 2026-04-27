import type { ReactNode } from "react";

type AdminToolbarProps = {
    description?: string;
    actions?: ReactNode;
};

export function AdminToolbar({
                                 description,
                                 actions,
                             }: AdminToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            {description ? (
                <p className="max-w-md text-sm text-gray-600">
                    {description}
                </p>
            ) : (
                <div />
            )}

            {actions && (
                <div className="flex flex-wrap gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}