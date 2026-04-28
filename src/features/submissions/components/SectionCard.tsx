import type { ReactNode } from "react";

type SectionCardProps = {
    title: string;
    children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
}