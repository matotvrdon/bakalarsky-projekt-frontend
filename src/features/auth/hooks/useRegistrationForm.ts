import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { getActiveConferences } from "../../../api/conferenceApi.ts";
import {
    AuthApiError,
    login as loginRequest,
    registerAccount,
    registerBasic,
} from "../../../api/authApi.ts";

import type {
    AccountMode,
    AuthFieldErrors,
    RegistrationForm,
    RegistrationStep,
} from "../types/authTypes.ts";

import {
    applyAuthApiError,
    clearPendingParticipantId,
    EMAIL_RE,
    mapLoginUserToStoredUser,
    PASSWORD_RE,
    saveCurrentUser,
    setPendingParticipantId,
} from "../utils/authUtils.ts";

const initialFormData: RegistrationForm = {
    firstName: "",
    lastName: "",
    phone: "",
    affiliation: "",
    country: "Slovensko",
    email: "",
    password: "",
    confirmPassword: "",
};

export function useRegistrationForm() {
    const navigate = useNavigate();

    const [step, setStep] = useState<RegistrationStep>("details");
    const [accountMode, setAccountModeState] =
        useState<AccountMode>("create");

    const [basicLoading, setBasicLoading] = useState(false);
    const [accountLoading, setAccountLoading] = useState(false);

    const [detailsError, setDetailsError] = useState("");
    const [accountError, setAccountError] = useState("");

    const [detailsFieldErrors, setDetailsFieldErrors] =
        useState<AuthFieldErrors>({});

    const [accountFieldErrors, setAccountFieldErrors] =
        useState<AuthFieldErrors>({});

    const [basicResult, setBasicResult] =
        useState<Awaited<ReturnType<typeof registerBasic>> | null>(null);

    const [accountResult, setAccountResult] =
        useState<Awaited<ReturnType<typeof registerAccount>> | null>(null);

    const [formData, setFormData] =
        useState<RegistrationForm>(initialFormData);

    const updateField = (field: keyof RegistrationForm, value: string) => {
        setFormData((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const setAccountMode = (mode: AccountMode) => {
        setAccountModeState(mode);
        setAccountError("");
        setAccountFieldErrors({});
    };

    const handleDetailsSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setDetailsError("");
        setDetailsFieldErrors({});

        const nextErrors: AuthFieldErrors = {};

        if (!formData.firstName.trim()) {
            nextErrors.firstName = "Meno je povinné.";
        }

        if (!formData.lastName.trim()) {
            nextErrors.lastName = "Priezvisko je povinné.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setDetailsFieldErrors(nextErrors);
            return;
        }

        setBasicLoading(true);

        try {
            const conferences = await getActiveConferences();
            const activeConference = conferences[0];

            if (!activeConference) {
                setDetailsFieldErrors({
                    conferenceId: "Aktívna konferencia nebola nájdená.",
                });
                return;
            }

            const response = await registerBasic({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim() || null,
                affiliation: formData.affiliation.trim() || null,
                country: formData.country.trim() || null,
                conferenceId: activeConference.id,
            });

            setBasicResult(response);
            setPendingParticipantId(response.participantId);
            setStep("account");
        } catch (error) {
            applyAuthApiError(
                error,
                [
                    "firstName",
                    "lastName",
                    "phone",
                    "affiliation",
                    "country",
                    "conferenceId",
                ],
                setDetailsFieldErrors,
                setDetailsError
            );
        } finally {
            setBasicLoading(false);
        }
    };

    const handleAccountSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setAccountError("");
        setAccountFieldErrors({});

        const nextErrors: AuthFieldErrors = {};

        if (!basicResult?.participantId) {
            nextErrors.participantId = "Participant ID nebol nájdený.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email je povinný.";
        } else if (!EMAIL_RE.test(formData.email.trim())) {
            nextErrors.email = "Zadajte platný email.";
        }

        if (!formData.password) {
            nextErrors.password = "Heslo je povinné.";
        } else if (
            accountMode === "create" &&
            !PASSWORD_RE.test(formData.password)
        ) {
            nextErrors.password =
                "Heslo musí mať aspoň 8 znakov, veľké písmeno, malé písmeno a číslicu.";
        }

        if (accountMode === "create" && !formData.confirmPassword) {
            nextErrors.confirmPassword = "Potvrdenie hesla je povinné.";
        } else if (
            accountMode === "create" &&
            formData.confirmPassword !== formData.password
        ) {
            nextErrors.confirmPassword =
                "Potvrdenie hesla sa musí zhodovať s heslom.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setAccountFieldErrors(nextErrors);
            return;
        }

        setAccountLoading(true);

        try {
            if (accountMode === "existing") {
                const response = await loginRequest({
                    email: formData.email.trim(),
                    password: formData.password,
                    participantId: basicResult!.participantId,
                });

                const user = mapLoginUserToStoredUser(response.user);

                saveCurrentUser(user);
                clearPendingParticipantId();

                navigate(user.role === "admin" ? "/admin" : "/dashboard");
                return;
            }

            const response = await registerAccount({
                participantId: basicResult!.participantId,
                email: formData.email.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            setAccountResult(response);
            clearPendingParticipantId();
            setStep("complete");
        } catch (error) {
            if (
                accountMode === "existing" &&
                error instanceof AuthApiError &&
                error.status === 401
            ) {
                setAccountError("Nesprávny email alebo heslo.");
                return;
            }

            if (
                accountMode === "create" &&
                error instanceof AuthApiError &&
                error.code === "EMAIL_EXISTS"
            ) {
                setAccountModeState("existing");
                setAccountFieldErrors((currentErrors) => ({
                    ...currentErrors,
                    email: "Tento email už má účet. Prihláste sa existujúcim heslom.",
                }));
                setAccountError(
                    "Účet s týmto emailom už existuje. Dokončite registráciu prihlásením."
                );
                return;
            }

            applyAuthApiError(
                error,
                ["participantId", "email", "password", "confirmPassword"],
                setAccountFieldErrors,
                setAccountError
            );
        } finally {
            setAccountLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return {
        step,
        accountMode,
        basicLoading,
        accountLoading,
        detailsError,
        accountError,
        detailsFieldErrors,
        accountFieldErrors,
        basicResult,
        accountResult,
        formData,

        updateField,
        setAccountMode,
        handleDetailsSubmit,
        handleAccountSubmit,
        goToLogin,
    };
}