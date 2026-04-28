import type { RootNavigationItem, RootUser } from "../types/rootTypes.ts";

import { NavigationLink } from "./NavigationLink.tsx";
import { UserActions } from "./UserActions.tsx";

type MobileNavigationProps = {
    open: boolean;
    navigationItems: RootNavigationItem[];
    currentUser: RootUser | null;
    onLogout: () => void;
    isActive: (href: string) => boolean;
};

export function MobileNavigation({
                                     open,
                                     navigationItems,
                                     currentUser,
                                     onLogout,
                                     isActive,
                                 }: MobileNavigationProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="border-t bg-white md:hidden">
            <nav className="container mx-auto space-y-1 px-4 py-4">
                {navigationItems.map((item) => (
                    <NavigationLink
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                        variant="mobile"
                    />
                ))}

                <div className="mt-4 space-y-2 border-t pt-4">
                    <UserActions
                        currentUser={currentUser}
                        onLogout={onLogout}
                        variant="mobile"
                    />
                </div>
            </nav>
        </div>
    );
}