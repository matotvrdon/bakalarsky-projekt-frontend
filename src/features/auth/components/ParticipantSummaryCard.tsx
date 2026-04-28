import { User } from "lucide-react";

import type { RegistrationForm } from "../types/authTypes.ts";

type ParticipantSummaryCardProps = {
    formData: RegistrationForm;
};

export function ParticipantSummaryCard({
                                           formData,
                                       }: ParticipantSummaryCardProps) {
    return (
        <div className="rounded-xl border bg-gray-50 p-4">
            <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Vaše údaje</h3>
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
                <span className="text-gray-600">Meno:</span>
                <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                </span>

                <span className="text-gray-600">Telefón:</span>
                <span className="font-medium">
                    {formData.phone || "-"}
                </span>

                <span className="text-gray-600">Inštitúcia:</span>
                <span className="font-medium">
                    {formData.affiliation || "-"}
                </span>
            </div>
        </div>
    );
}