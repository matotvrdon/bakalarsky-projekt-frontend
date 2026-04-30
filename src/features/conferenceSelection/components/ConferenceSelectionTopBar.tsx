import { Link } from "react-router";
import { LogOut, ShieldUser } from "lucide-react";

import type { RootUser } from "../../root/types/rootTypes.ts";

type ConferenceSelectionTopBarProps = {
    currentUser: RootUser | null;
    onLogout: () => void;
};

const isAdminUser = (currentUser: RootUser | null) => {
    if (!currentUser) {
        return false;
    }

    return currentUser.role === "admin";
};

export function ConferenceSelectionTopBar({
                                              currentUser,
                                              onLogout,
                                          }: ConferenceSelectionTopBarProps) {
    const isAdmin = isAdminUser(currentUser);

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/selection" className="text-xl font-bold text-gray-950">
                    Konferencia
                </Link>

                <div className="flex items-center gap-3">
                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin"
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                            >
                                <ShieldUser className="h-4 w-4" />
                                Admin panel
                            </Link>

                            <button
                                type="button"
                                onClick={onLogout}
                                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4" />
                                Odhlásiť
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/admin-login"
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                            <ShieldUser className="h-4 w-4" />
                            Admin login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}