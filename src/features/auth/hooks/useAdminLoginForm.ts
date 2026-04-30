import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
    adminLogin,
    AuthApiError,
} from "../../../api/authApi.ts";

import type { LoginForm } from "../types/authTypes.ts";

import {
    clearPendingParticipantId,
    mapLoginUserToStoredUser,
    saveCurrentUser,
} from "../utils/authUtils.ts";

const initialForm: LoginForm = {
    email: "",
    password: "",
};

export function useAdminLoginForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateField = (field: keyof LoginForm, value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await adminLogin({
                email: form.email,
                password: form.password,
            });

            const user = mapLoginUserToStoredUser(response.user);

            if (user.role !== "admin") {
                setError("Prihlásenie je povolené iba administrátorovi.");
                return;
            }

            saveCurrentUser(user);
            clearPendingParticipantId();

            navigate("/admin");
        } catch (loginError) {
            if (loginError instanceof AuthApiError) {
                setError(loginError.message);
                return;
            }

            setError("Nesprávny email alebo heslo.");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        error,
        loading,
        updateField,
        handleSubmit,
    };
}