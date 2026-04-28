import { useEffect, useState } from "react";
import type { Location } from "react-router";

import type { RootUser } from "../types/rootTypes.ts";

export function useRootUser(location: Location) {
    const [currentUser, setCurrentUser] = useState<RootUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");

        if (!storedUser) {
            setCurrentUser(null);
            return;
        }

        setCurrentUser(JSON.parse(storedUser) as RootUser);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        window.location.href = "/";
    };

    return {
        currentUser,
        handleLogout,
    };
}