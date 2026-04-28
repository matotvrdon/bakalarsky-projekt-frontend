import type { ReactNode } from "react";
import { X } from "lucide-react";

type AdminDialogSize = "sm" | "md" | "lg" | "xl" | "full";

type AdminDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    contentClassName?: string;
    size?: AdminDialogSize;
    onOpenChange: (open: boolean) => void;
};

export function AdminDialog({
                                open,
                                title,
                                description,
                                children,
                                footer,
                                className = "",
                                contentClassName = "",
                                size = "md",
                                onOpenChange,
                            }: AdminDialogProps) {
    if (!open) {
        return null;
    }

    const sizeClass = {
        sm: "max-w-xl",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-[min(96vw,1500px)]",
    }[size];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4">
            <div
                className={[
                    "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
                    sizeClass,
                    className,
                ].join(" ")}
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="break-words text-xl font-semibold text-gray-900">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 break-words text-sm text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Zatvoriť"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div
                    className={[
                        "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-5",
                        contentClassName,
                    ].join(" ")}
                >
                    {children}
                </div>

                {footer && (
                    <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}