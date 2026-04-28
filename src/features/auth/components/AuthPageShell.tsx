import type { ReactNode } from "react";

type AuthPageShellProps = {
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg";
};

export function AuthPageShell({
                                  children,
                                  maxWidth = "md",
                              }: AuthPageShellProps) {
    const maxWidthClassName = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
    }[maxWidth];

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12">
            <div className={["container mx-auto", maxWidthClassName].join(" ")}>
                {children}
            </div>
        </main>
    );
}