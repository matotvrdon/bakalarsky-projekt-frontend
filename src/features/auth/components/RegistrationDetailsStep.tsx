import type { FormEvent } from "react";

import type { AuthFieldErrors, RegistrationForm } from "../types/authTypes.ts";

import {
    AuthAlert,
    AuthButton,
    AuthCard,
    AuthCardContent,
    AuthCardDescription,
    AuthCardHeader,
    AuthCardTitle,
} from "./base/index.ts";

import { AuthFormField } from "./AuthFormField.tsx";

type RegistrationDetailsStepProps = {
    formData: RegistrationForm;
    detailsError: string;
    detailsFieldErrors: AuthFieldErrors;
    basicLoading: boolean;
    onFieldChange: (field: keyof RegistrationForm, value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

export function RegistrationDetailsStep({
                                            formData,
                                            detailsError,
                                            detailsFieldErrors,
                                            basicLoading,
                                            onFieldChange,
                                            onSubmit,
                                        }: RegistrationDetailsStepProps) {
    return (
        <AuthCard>
            <AuthCardHeader>
                <AuthCardTitle className="text-3xl">
                    Registrácia na konferenciu
                </AuthCardTitle>

                <AuthCardDescription className="text-base">
                    Vyplňte základné údaje. Prihlasovacie údaje si nastavíte v ďalšom kroku.
                </AuthCardDescription>
            </AuthCardHeader>

            <AuthCardContent>
                <AuthAlert message={detailsError} className="mb-6" />

                <AuthAlert
                    message={detailsFieldErrors.conferenceId ?? ""}
                    className="mb-6"
                />

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold">
                            Osobné údaje
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AuthFormField
                                id="firstName"
                                label="Meno *"
                                value={formData.firstName}
                                onChange={(event) =>
                                    onFieldChange("firstName", event.target.value)
                                }
                                error={detailsFieldErrors.firstName}
                                required
                            />

                            <AuthFormField
                                id="lastName"
                                label="Priezvisko *"
                                value={formData.lastName}
                                onChange={(event) =>
                                    onFieldChange("lastName", event.target.value)
                                }
                                error={detailsFieldErrors.lastName}
                                required
                            />
                        </div>

                        <AuthFormField
                            id="phone"
                            label="Telefón"
                            type="tel"
                            placeholder="+421 XXX XXX XXX"
                            value={formData.phone}
                            onChange={(event) =>
                                onFieldChange("phone", event.target.value)
                            }
                            error={detailsFieldErrors.phone}
                        />

                        <AuthFormField
                            id="affiliation"
                            label="Inštitúcia"
                            placeholder="Názov univerzity alebo inštitúcie"
                            value={formData.affiliation}
                            onChange={(event) =>
                                onFieldChange("affiliation", event.target.value)
                            }
                            error={detailsFieldErrors.affiliation}
                        />

                        <AuthFormField
                            id="country"
                            label="Krajina"
                            value={formData.country}
                            onChange={(event) =>
                                onFieldChange("country", event.target.value)
                            }
                            error={detailsFieldErrors.country}
                        />
                    </div>

                    <AuthAlert variant="info">
                        V ďalšom kroku si vytvoríte nový účet alebo sa prihlásite do existujúceho.
                    </AuthAlert>

                    <AuthButton
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={basicLoading}
                    >
                        {basicLoading ? "Pokračujem..." : "Pokračovať"}
                    </AuthButton>
                </form>
            </AuthCardContent>
        </AuthCard>
    );
}