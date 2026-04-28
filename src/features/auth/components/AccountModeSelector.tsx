import { AuthButton } from "./base/index.ts";

import type { AccountMode } from "../types/authTypes.ts";

type AccountModeSelectorProps = {
    accountMode: AccountMode;
    onChange: (mode: AccountMode) => void;
};

export function AccountModeSelector({
                                        accountMode,
                                        onChange,
                                    }: AccountModeSelectorProps) {
    return (
        <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Ďalší krok</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AuthButton
                    type="button"
                    variant={accountMode === "create" ? "primary" : "outline"}
                    onClick={() => onChange("create")}
                >
                    Vytvoriť účet
                </AuthButton>

                <AuthButton
                    type="button"
                    variant={accountMode === "existing" ? "primary" : "outline"}
                    onClick={() => onChange("existing")}
                >
                    Účet už mám
                </AuthButton>
            </div>

            <p className="text-gray-600">
                {accountMode === "create"
                    ? "Vytvorte si účet s emailom a heslom pre prihlásenie do systému."
                    : "Prihláste sa existujúcim účtom a participant sa priradí k aktuálnej konferencii."}
            </p>
        </div>
    );
}