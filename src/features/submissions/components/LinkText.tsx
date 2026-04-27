import type { ReactNode } from "react";

type LinkTextProps = {
    href: string;
    children: ReactNode;
};

export function LinkText({ href, children }: LinkTextProps) {
    return (
        <a
            href={href}
            className="font-medium text-blue-600 hover:underline"
        >
            {children}
        </a>
    );
}