import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type InfoSidebarCardProps = {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
};

export function InfoSidebarCard({
                                    title,
                                    icon: Icon,
                                    children,
                                }: InfoSidebarCardProps) {
    return (
        <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Icon className="h-5 w-5 text-blue-600" />
                    {title}
                </h2>
            </div>

            <div className="space-y-4 p-6 text-sm text-gray-700">
                {children}
            </div>
        </aside>
    );
}