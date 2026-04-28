import type { RootNavigationItem, RootUser } from "../types/rootTypes.ts";

import { NavigationLink } from "./NavigationLink.tsx";
import { UserActions } from "./UserActions.tsx";

type DesktopNavigationProps = {
    navigationItems: RootNavigationItem[];
    currentUser: RootUser | null;
    onLogout: () => void;
    isActive: (href: string) => boolean;
};

export function DesktopNavigation({
                                      navigationItems,
                                      currentUser,
                                      onLogout,
                                      isActive,
                                  }: DesktopNavigationProps) {
    return (
        <nav className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => (
                <NavigationLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    variant="desktop"
                />
            ))}

            <UserActions
                currentUser={currentUser}
                onLogout={onLogout}
                variant="desktop"
            />
        </nav>
    );
}