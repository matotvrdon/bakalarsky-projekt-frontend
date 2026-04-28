import type { LoginUser } from "../../../api/authApi.ts";
import type {
    AccountField,
    AuthFieldErrors,
    DetailsField,
    StoredAuthUser,
} from "../types/authTypes.ts";
import { AuthApiError } from "../../../api/authApi.ts";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const normalizeFieldKey = (field: string) => {
    if (!field) {
        return field;
    }

    return field.charAt(0).toLowerCase() + field.slice(1);
};

export const normalizeUserRole = (role: number | string) => {
    if (typeof role === "number") {
        return role === 0 ? "admin" : "participant";
    }

    return (role || "participant").toString().toLowerCase() === "admin"
        ? "admin"
        : "participant";
};

export const mapLoginUserToStoredUser = (apiUser: LoginUser): StoredAuthUser => {
    const role = normalizeUserRole(apiUser.role);

    return {
        id: apiUser.id,
        email: apiUser.email,
        role,
        name: apiUser.email.split("@")[0],
    };
};

export const saveCurrentUser = (user: StoredAuthUser) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getPendingParticipantId = () => {
    const rawValue = localStorage.getItem("pendingRegistrationParticipantId");
    const parsedValue = rawValue ? Number(rawValue) : undefined;

    return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export const clearPendingParticipantId = () => {
    localStorage.removeItem("pendingRegistrationParticipantId");
};

export const setPendingParticipantId = (participantId: number) => {
    localStorage.setItem("pendingRegistrationParticipantId", String(participantId));
};

export const applyAuthApiError = (
    error: unknown,
    allowedFields: Array<DetailsField | AccountField>,
    setFieldErrors: (errors: AuthFieldErrors) => void,
    setGeneralError: (message: string) => void
) => {
    if (!(error instanceof AuthApiError)) {
        setGeneralError(
            error instanceof Error ? error.message : "Operácia zlyhala"
        );
        return;
    }

    const nextErrors: AuthFieldErrors = {};

    if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([key, messages]) => {
            const normalizedKey = normalizeFieldKey(
                key
            ) as DetailsField | AccountField;

            if (allowedFields.includes(normalizedKey) && messages.length > 0) {
                nextErrors[normalizedKey] = messages[0];
            }
        });
    }

    if (error.field) {
        const normalizedField = normalizeFieldKey(
            error.field
        ) as DetailsField | AccountField;

        if (
            allowedFields.includes(normalizedField) &&
            !nextErrors[normalizedField]
        ) {
            nextErrors[normalizedField] = error.message;
        }
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
        setGeneralError(error.message);
    }
};