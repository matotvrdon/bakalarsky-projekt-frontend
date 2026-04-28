import { Link } from "react-router";
import { LogIn, LogOut, UserCircle } from "lucide-react";

import type { RootUser } from "../types/rootTypes.ts";
import { RootButton } from "../base/index.ts";

type UserActionsProps = {
    currentUser: RootUser | null;
    onLogout: () => void;
    variant: "desktop" | "mobile";
};

export function UserActions({
                                currentUser,
                                onLogout,
                                variant,
                            }: UserActionsProps) {
    const isMobile = variant === "mobile";

    if (!currentUser) {
        return (
            <Link to="/login">
                <RootButton
                    variant="primary"
                    size="sm"
                    className={["gap-2", isMobile ? "w-full" : ""].join(" ")}
                >
                    <LogIn className="h-4 w-4" />
                    Prihlásiť
                </RootButton>
            </Link>
        );
    }

    const panelPath = currentUser.role === "admin" ? "/admin" : "/dashboard";
    const panelLabel = currentUser.role === "admin" ? "Admin Panel" : "Môj Panel";

    if (isMobile) {
        return (
            <>
                <Link to={panelPath}>
                    <RootButton
                        variant="outline"
                        className="w-full justify-start gap-2"
                    >
                        <UserCircle className="h-4 w-4" />
                        {panelLabel}
                    </RootButton>
                </Link>

                <RootButton
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-50"
                >
                    <LogOut className="h-4 w-4" />
                    Odhlásiť
                </RootButton>
            </>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link to={panelPath}>
                <RootButton variant="outline" size="sm" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    {panelLabel}
                </RootButton>
            </Link>

            <RootButton
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="gap-2"
            >
                <LogOut className="h-4 w-4" />
                Odhlásiť
            </RootButton>
        </div>
    );
}