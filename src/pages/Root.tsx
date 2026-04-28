import { Outlet, useLocation } from "react-router";

import { AppFooter, AppHeader } from "../features/root/components";
import { useRootUser } from "../features/root/hooks/useRootUser.ts";

export function Root() {
    const location = useLocation();

    const {
        currentUser,
        handleLogout,
    } = useRootUser(location);

    return (
        <div className="flex min-h-screen flex-col">
            <AppHeader
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            <main className="flex-1">
                <Outlet />
            </main>

            <AppFooter />
        </div>
    );
}