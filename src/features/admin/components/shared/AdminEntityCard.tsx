import type { ReactNode } from "react";

type AdminEntityCardProps = {
    title: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode;
    badges?: ReactNode;
    actions?: ReactNode;
    active?: boolean;
    children?: ReactNode;
};

export function AdminEntityCard({
                                    title,
                                    subtitle,
                                    meta,
                                    badges,
                                    actions,
                                    active,
                                    children,
                                }: AdminEntityCardProps) {
    return (
        <div
            className={`rounded-xl border p-4 ${
                active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
        >
            <div className="flex flex-col gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="break-words text-base font-semibold text-gray-900">
                            {title}
                        </h3>

                        {badges}
                    </div>

                    {subtitle && (
                        <p className="text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}

                    {meta && (
                        <p className="text-sm text-gray-500">
                            {meta}
                        </p>
                    )}

                    {children}
                </div>

                {actions && (
                    <div className="flex flex-wrap gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}