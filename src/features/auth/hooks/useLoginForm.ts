import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { login as loginRequest } from "../../../api/authApi.ts";
import type { LoginForm } from "../types/authTypes.ts";
import {
    clearPendingParticipantId,
    getPendingParticipantId,
    mapLoginUserToStoredUser,
    saveCurrentUser,
} from "../utils/authUtils.ts";

const initialForm: LoginForm = {
    email: "",
    password: "",
};

export function useLoginForm() {
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
            const response = await loginRequest({
                email: form.email,
                password: form.password,
                participantId: getPendingParticipantId(),
            });

            const user = mapLoginUserToStoredUser(response.user);

            saveCurrentUser(user);
            clearPendingParticipantId();

            navigate(user.role === "admin" ? "/admin" : "/dashboard");
        } catch {
            setError("Nesprávny email alebo heslo");
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