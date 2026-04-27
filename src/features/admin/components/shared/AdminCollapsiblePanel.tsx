import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type AdminCollapsiblePanelProps = {
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    expanded: boolean;
    onToggle: () => void;
    variant?: "default" | "blue" | "white";
};

export function AdminCollapsiblePanel({
                                          title,
                                          subtitle,
                                          actions,
                                          children,
                                          expanded,
                                          onToggle,
                                          variant = "default",
                                      }: AdminCollapsiblePanelProps) {
    const variantClass = {
        default: "border-gray-200 bg-white",
        blue: "border-blue-100 bg-blue-50/70",
        white: "border-white bg-white/90",
    }[variant];

    return (
        <div className={`overflow-hidden rounded-2xl border ${variantClass}`}>
            <div className="flex items-start justify-between gap-4 px-6 py-5">
                <div className="flex min-w-0 items-start gap-4">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="mt-1 rounded-md p-1 text-gray-600 hover:bg-white"
                    >
                        {expanded ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>

                    <div className="min-w-0">
                        <h4 className="truncate text-lg font-semibold text-gray-900">
                            {title}
                        </h4>

                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {expanded && (
                <div className="space-y-4 px-6 pb-5">
                    {children}
                </div>
            )}
        </div>
    );
}