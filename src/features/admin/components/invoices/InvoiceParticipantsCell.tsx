import type { Invoice } from "../../../../api/invoiceApi.ts";

type InvoiceParticipantsCellProps = {
    invoice: Invoice;
};

export function InvoiceParticipantsCell({
                                            invoice,
                                        }: InvoiceParticipantsCellProps) {
    if (!invoice.participants || invoice.participants.length === 0) {
        return <span>-</span>;
    }

    return (
        <div>
            <div className="max-w-[280px] truncate text-sm text-gray-900">
                {invoice.participants
                    .map((participant) => participant.fullName)
                    .join(", ")}
            </div>

            {invoice.participants.length > 1 ? (
                <div className="text-xs text-gray-500">
                    {invoice.participants.length} účastníci
                </div>
            ) : null}
        </div>
    );
}