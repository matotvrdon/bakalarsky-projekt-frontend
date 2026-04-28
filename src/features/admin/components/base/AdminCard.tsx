import type { ReactNode } from "react";

type AdminCardProps = {
    children: ReactNode;
    className?: string;
};

type AdminCardHeaderProps = {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
};

type AdminCardContentProps = {
    children: ReactNode;
    className?: string;
};

export function AdminCard({ children, className = "" }: AdminCardProps) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function AdminCardHeader({
                                    title,
                                    description,
                                    action,
                                    children,
                                    className = "",
                                }: AdminCardHeaderProps) {
    return (
        <div className={`flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 ${className}`}>
            <div>
                {title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                )}

                {description && (
                    <p className="mt-1 text-sm text-gray-600">
                        {description}
                    </p>
                )}

                {children}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export function AdminCardContent({
                                     children,
                                     className = "",
                                 }: AdminCardContentProps) {
    return (
        <div className={`px-6 py-5 ${className}`}>
            {children}
        </div>
    );
}