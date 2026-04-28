import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

import { useRootActiveConference } from "../hooks/useRootActiveConference.ts";
import { rootNavigationItems } from "../constants/rootNavigation.ts";
import type { RootNavigationItem, RootUser } from "../types/rootTypes.ts";

import { DesktopNavigation } from "./DesktopNavigation.tsx";
import { MobileNavigation } from "./MobileNavigation.tsx";

type AppHeaderProps = {
    currentUser: RootUser | null;
    onLogout: () => void;
};

const getVisibleNavigation = (
    currentUser: RootUser | null
): RootNavigationItem[] => {
    if (!currentUser) {
        return rootNavigationItems;
    }

    return rootNavigationItems.filter((item) => item.href !== "/register");
};

export function AppHeader({
                              currentUser,
                              onLogout,
                          }: AppHeaderProps) {
    const location = useLocation();
    const activeConference = useRootActiveConference();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const visibleNavigation = getVisibleNavigation(currentUser);
    const conferenceName = activeConference?.name || "Conference.Name";

    const isActive = (href: string) => {
        if (href === "/") {
            return location.pathname === "/";
        }

        return location.pathname.startsWith(href);
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="text-xl font-bold">
                        {conferenceName}
                    </Link>

                    <DesktopNavigation
                        navigationItems={visibleNavigation}
                        currentUser={currentUser}
                        onLogout={onLogout}
                        isActive={isActive}
                    />

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((current) => !current)}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            <MobileNavigation
                open={mobileMenuOpen}
                navigationItems={visibleNavigation}
                currentUser={currentUser}
                onLogout={onLogout}
                isActive={isActive}
            />
        </header>
    );
}