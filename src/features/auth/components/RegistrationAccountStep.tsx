import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

import type {
    AccountMode,
    AuthFieldErrors,
    RegistrationForm,
} from "../types/authTypes.ts";

import {
    AuthAlert,
    AuthButton,
    AuthCard,
    AuthCardContent,
    AuthCardDescription,
    AuthCardHeader,
    AuthCardTitle,
} from "./base/index.ts";

import { AccountModeSelector } from "./AccountModeSelector.tsx";
import { AuthFormField } from "./AuthFormField.tsx";
import { ParticipantSummaryCard } from "./ParticipantSummaryCard.tsx";

type RegistrationAccountStepProps = {
    formData: RegistrationForm;
    accountMode: AccountMode;
    accountError: string;
    accountFieldErrors: AuthFieldErrors;
    accountLoading: boolean;
    onAccountModeChange: (mode: AccountMode) => void;
    onFieldChange: (field: keyof RegistrationForm, value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

export function RegistrationAccountStep({
                                            formData,
                                            accountMode,
                                            accountError,
                                            accountFieldErrors,
                                            accountLoading,
                                            onAccountModeChange,
                                            onFieldChange,
                                            onSubmit,
                                        }: RegistrationAccountStepProps) {
    return (
        <AuthCard>
            <AuthCardHeader className="pb-6 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-9 w-9 text-green-600" />
                    </div>
                </div>

                <AuthCardTitle className="text-3xl">
                    Základná registrácia dokončená
                </AuthCardTitle>

                <AuthCardDescription className="text-base">
                    Pokračujte vytvorením účtu
                </AuthCardDescription>
            </AuthCardHeader>

            <AuthCardContent className="space-y-6">
                <AuthAlert message={accountError} />

                <AuthAlert message={accountFieldErrors.participantId ?? ""} />

                <ParticipantSummaryCard formData={formData} />

                <form onSubmit={onSubmit} className="space-y-6">
                    <AccountModeSelector
                        accountMode={accountMode}
                        onChange={onAccountModeChange}
                    />

                    <div className="space-y-4">
                        <AuthFormField
                            id="email"
                            label="Email *"
                            type="email"
                            value={formData.email}
                            onChange={(event) =>
                                onFieldChange("email", event.target.value)
                            }
                            error={accountFieldErrors.email}
                            required
                        />

                        <AuthFormField
                            id="password"
                            label="Heslo *"
                            type="password"
                            value={formData.password}
                            onChange={(event) =>
                                onFieldChange("password", event.target.value)
                            }
                            error={accountFieldErrors.password}
                            required
                        />

                        {accountMode === "create" ? (
                            <AuthFormField
                                id="confirmPassword"
                                label="Potvrdenie hesla *"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(event) =>
                                    onFieldChange(
                                        "confirmPassword",
                                        event.target.value
                                    )
                                }
                                error={accountFieldErrors.confirmPassword}
                                required
                            />
                        ) : null}
                    </div>

                    <AuthButton
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={accountLoading}
                    >
                        {accountLoading
                            ? accountMode === "create"
                                ? "Vytváram účet..."
                                : "Prihlasujem..."
                            : accountMode === "create"
                                ? "Vytvoriť účet"
                                : "Prihlásiť sa a pokračovať"}
                    </AuthButton>
                </form>
            </AuthCardContent>
        </AuthCard>
    );
}