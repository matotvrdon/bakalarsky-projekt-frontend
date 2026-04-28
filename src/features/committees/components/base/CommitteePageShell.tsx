import type { ReactNode } from "react";

type CommitteePageShellProps = {
    children: ReactNode;
};

export function CommitteePageShell({
                                       children,
                                   }: CommitteePageShellProps) {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-6xl px-4">
                {children}
            </div>
        </main>
    );
}