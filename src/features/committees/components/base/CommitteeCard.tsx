import type { ReactNode } from "react";

type CommitteeCardProps = {
    children: ReactNode;
    className?: string;
};

export function CommitteeCard({
                                  children,
                                  className = "",
                              }: CommitteeCardProps) {
    return (
        <section
            className={[
                "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
                className,
            ].join(" ")}
        >
            {children}
        </section>
    );
}