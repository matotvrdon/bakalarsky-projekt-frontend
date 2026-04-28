import type { ReactNode } from "react";

type AuthCardProps = {
    children: ReactNode;
    className?: string;
};

export function AuthCard({ children, className = "" }: AuthCardProps) {
    return (
        <section
            className={[
                "rounded-2xl border border-gray-200 bg-white shadow-sm",
                className,
            ].join(" ")}
        >
            {children}
        </section>
    );
}

type AuthCardHeaderProps = {
    children: ReactNode;
    className?: string;
};

export function AuthCardHeader({
                                   children,
                                   className = "",
                               }: AuthCardHeaderProps) {
    return (
        <div className={["border-b border-gray-100 px-6 py-6", className].join(" ")}>
            {children}
        </div>
    );
}

type AuthCardContentProps = {
    children: ReactNode;
    className?: string;
};

export function AuthCardContent({
                                    children,
                                    className = "",
                                }: AuthCardContentProps) {
    return <div className={["p-6", className].join(" ")}>{children}</div>;
}

type AuthCardTitleProps = {
    children: ReactNode;
    className?: string;
};

export function AuthCardTitle({ children, className = "" }: AuthCardTitleProps) {
    return (
        <h1 className={["text-2xl font-bold text-gray-900", className].join(" ")}>
            {children}
        </h1>
    );
}

type AuthCardDescriptionProps = {
    children: ReactNode;
    className?: string;
};

export function AuthCardDescription({
                                        children,
                                        className = "",
                                    }: AuthCardDescriptionProps) {
    return (
        <p className={["mt-2 text-sm text-gray-600", className].join(" ")}>
            {children}
        </p>
    );
}