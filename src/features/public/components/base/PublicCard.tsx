import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type PublicCardProps = {
    title?: ReactNode;
    description?: ReactNode;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
};

export function PublicCard({
                               title,
                               description,
                               icon: Icon,
                               children,
                               className = "",
                           }: PublicCardProps) {
    return (
        <section
            className={[
                "rounded-2xl border border-gray-200 bg-white shadow-sm",
                className,
            ].join(" ")}
        >
            {title || description ? (
                <div className="border-b border-gray-100 px-6 py-5">
                    {title ? (
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            {Icon ? <Icon className="h-5 w-5" /> : null}
                            {title}
                        </h2>
                    ) : null}

                    {description ? (
                        <p className="mt-1 text-sm text-gray-600">
                            {description}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className="p-6">{children}</div>
        </section>
    );
}