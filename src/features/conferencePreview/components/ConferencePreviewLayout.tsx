import { Outlet } from "react-router";

import { AdminPreviewBanner } from "./AdminPreviewBanner.tsx";

export function ConferencePreviewLayout() {
    return (
        <div>
            <AdminPreviewBanner />

            <Outlet />
        </div>
    );
}