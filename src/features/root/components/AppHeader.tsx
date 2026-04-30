import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { LogOut, Menu, X } from "lucide-react";

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

    return rootNavigationItems.filter((item) => item.href !== "register");
};

const createConferencePath = (
    basePath: string,
    itemPath: string
) => {
    if (!itemPath) {
        return basePath;
    }

    return `${basePath}/${itemPath}`;
};

const shouldHideHeader = (pathname: string) => {
    return pathname === "/selection" || pathname === "/";
};

const isAdminUser = (currentUser: RootUser | null) => {
    if (!currentUser) {
        return false;
    }

    return currentUser.role === "admin";
};

export function AppHeader({
                              currentUser,
                              onLogout,
                          }: AppHeaderProps) {
    const location = useLocation();
    const params = useParams();

    const activeConference = useRootActiveConference();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const conferenceId = params.conferenceId;
    const isPreview = location.pathname.startsWith("/admin/conferences/");
    const hideHeader = shouldHideHeader(location.pathname);
    const isAdmin = isAdminUser(currentUser);

    const baseConferencePath = useMemo(() => {
        if (conferenceId && isPreview) {
            return `/admin/conferences/${conferenceId}/preview`;
        }

        if (conferenceId) {
            return `/conference/${conferenceId}`;
        }

        return "/selection";
    }, [conferenceId, isPreview]);

    const visibleNavigation = getVisibleNavigation(currentUser).map((item) => ({
        ...item,
        href: createConferencePath(baseConferencePath, item.href),
    }));

    const conferenceName = activeConference?.name || "Konferencia";

    const logoHref = conferenceId
        ? baseConferencePath
        : "/selection";

    const isActive = (href: string) => {
        if (href === baseConferencePath) {
            return location.pathname === baseConferencePath;
        }

        return location.pathname.startsWith(href);
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    if (hideHeader) {
        return null;
    }

    if (isAdmin && !isPreview) {
        return (
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/selection" className="text-xl font-bold">
                            Konferencia
                        </Link>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                        >
                            <LogOut className="h-4 w-4" />
                            Odhlásiť
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to={logoHref} className="text-xl font-bold">
                        {isPreview ? conferenceName : conferenceName}
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