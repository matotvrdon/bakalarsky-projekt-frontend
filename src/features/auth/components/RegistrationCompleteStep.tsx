import { CheckCircle2 } from "lucide-react";

import type { RegisterAccountResponse } from "../../../api/authApi.ts";
import type { RegistrationForm } from "../types/authTypes.ts";

import {
    AuthAlert,
    AuthButton,
    AuthCard,
    AuthCardContent,
    AuthCardDescription,
    AuthCardHeader,
    AuthCardTitle,
} from "./base/index.ts";

import { ParticipantSummaryCard } from "./ParticipantSummaryCard.tsx";

type RegistrationCompleteStepProps = {
    formData: RegistrationForm;
    accountResult: RegisterAccountResponse;
    onLoginClick: () => void;
};

export function RegistrationCompleteStep({
                                             formData,
                                             accountResult,
                                             onLoginClick,
                                         }: RegistrationCompleteStepProps) {
    return (
        <AuthCard>
            <AuthCardHeader className="pb-6 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-9 w-9 text-green-600" />
                    </div>
                </div>

                <AuthCardTitle className="text-3xl">
                    Účet bol vytvorený
                </AuthCardTitle>

                <AuthCardDescription className="text-base">
                    Registrácia aj vytvorenie účtu prebehli úspešne.
                </AuthCardDescription>
            </AuthCardHeader>

            <AuthCardContent className="space-y-6">
                <AuthAlert variant="info">
                    {accountResult.message} Prihláste sa emailom{" "}
                    <strong>{accountResult.user.email}</strong>.
                </AuthAlert>

                <ParticipantSummaryCard formData={formData} />

                <AuthButton className="w-full" size="lg" onClick={onLoginClick}>
                    Prihlásiť sa
                </AuthButton>
            </AuthCardContent>
        </AuthCard>
    );
}