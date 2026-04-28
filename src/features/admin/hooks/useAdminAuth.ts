import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type CurrentUser = {
    name: string;
    email: string;
    role: string;
};

export function useAdminAuth() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");

        if (!user) {
            navigate("/login");
            return;
        }

        const userData = JSON.parse(user) as CurrentUser;

        if (userData.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        setCurrentUser(userData);
    }, [navigate]);

    return currentUser;
}