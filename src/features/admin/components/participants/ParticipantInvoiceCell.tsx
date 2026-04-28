import type { Participant } from "../../types/adminTypes.ts";

import { ParticipantStatusBadge } from "./ParticipantStatusBadge.tsx";

type ParticipantInvoiceCellProps = {
    participant: Participant;
};

export function ParticipantInvoiceCell({
                                           participant,
                                       }: ParticipantInvoiceCellProps) {
    return (
        <div className="space-y-1">
            <ParticipantStatusBadge
                variant="invoice"
                value={participant.invoiceStatusLabel}
            />

            {participant.invoiceNumber ? (
                <div className="text-xs text-gray-500">
                    {participant.invoiceNumber}
                </div>
            ) : null}
        </div>
    );
}