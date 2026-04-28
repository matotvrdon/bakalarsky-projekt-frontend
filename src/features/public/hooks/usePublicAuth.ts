import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import type { CurrentUser } from "../types/publicTypes.ts";

export function usePublicAuth() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser) as CurrentUser;

        if (parsedUser.role !== "participant") {
            navigate("/admin");
            return;
        }

        setCurrentUser(parsedUser);
    }, [navigate]);

    return currentUser;
}