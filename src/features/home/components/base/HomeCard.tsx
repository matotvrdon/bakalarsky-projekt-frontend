import type { ReactNode } from "react";

type HomeCardProps = {
    children: ReactNode;
    className?: string;
};

type HomeCardHeaderProps = {
    children: ReactNode;
    className?: string;
};

type HomeCardTitleProps = {
    children: ReactNode;
    className?: string;
};

type HomeCardContentProps = {
    children: ReactNode;
    className?: string;
};

export function HomeCard({
                             children,
                             className = "",
                         }: HomeCardProps) {
    return (
        <div
            className={[
                "rounded-2xl border border-gray-200 bg-white shadow-sm",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export function HomeCardHeader({
                                   children,
                                   className = "",
                               }: HomeCardHeaderProps) {
    return (
        <div className={["px-6 pt-6", className].join(" ")}>
            {children}
        </div>
    );
}

export function HomeCardTitle({
                                  children,
                                  className = "",
                              }: HomeCardTitleProps) {
    return (
        <h3
            className={[
                "text-2xl font-bold tracking-tight text-gray-900",
                className,
            ].join(" ")}
        >
            {children}
        </h3>
    );
}

export function HomeCardContent({
                                    children,
                                    className = "",
                                }: HomeCardContentProps) {
    return (
        <div className={["p-6", className].join(" ")}>
            {children}
        </div>
    );
}