import {
    AuthPageShell,
    RegistrationAccountStep,
    RegistrationCompleteStep,
    RegistrationDetailsStep,
} from "../features/auth/components";
import { useRegistrationForm } from "../features/auth/hooks";

export function Registration() {
    const registration = useRegistrationForm();

    return (
        <AuthPageShell maxWidth="md">
            {registration.step === "complete" && registration.accountResult ? (
                <RegistrationCompleteStep
                    formData={registration.formData}
                    accountResult={registration.accountResult}
                    onLoginClick={registration.goToLogin}
                />
            ) : null}

            {registration.step === "account" && registration.basicResult ? (
                <RegistrationAccountStep
                    formData={registration.formData}
                    accountMode={registration.accountMode}
                    accountError={registration.accountError}
                    accountFieldErrors={registration.accountFieldErrors}
                    accountLoading={registration.accountLoading}
                    onAccountModeChange={registration.setAccountMode}
                    onFieldChange={registration.updateField}
                    onSubmit={registration.handleAccountSubmit}
                />
            ) : null}

            {registration.step === "details" ? (
                <RegistrationDetailsStep
                    formData={registration.formData}
                    detailsError={registration.detailsError}
                    detailsFieldErrors={registration.detailsFieldErrors}
                    basicLoading={registration.basicLoading}
                    onFieldChange={registration.updateField}
                    onSubmit={registration.handleDetailsSubmit}
                />
            ) : null}
        </AuthPageShell>
    );
}