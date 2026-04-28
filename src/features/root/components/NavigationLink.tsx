import { Link } from "react-router";

import type { RootNavigationItem } from "../types/rootTypes.ts";

type NavigationLinkProps = {
    item: RootNavigationItem;
    active: boolean;
    variant: "desktop" | "mobile";
};

export function NavigationLink({
                                   item,
                                   active,
                                   variant,
                               }: NavigationLinkProps) {
    if (variant === "mobile") {
        return (
            <Link
                to={item.href}
                className={[
                    "block rounded-lg px-4 py-3 font-medium transition-colors",
                    active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
            >
                {item.name}
            </Link>
        );
    }

    return (
        <Link
            to={item.href}
            className={[
                "text-sm font-medium transition-colors hover:text-blue-600",
                active ? "text-blue-600" : "text-gray-600",
            ].join(" ")}
        >
            {item.name}
        </Link>
    );
}