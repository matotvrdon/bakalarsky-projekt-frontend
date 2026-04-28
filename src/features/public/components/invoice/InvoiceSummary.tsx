import type { PublicDashboardContext } from "../../types/publicTypes.ts";

type InvoiceSummaryProps = {
    dashboard: PublicDashboardContext;
};

const formatMoney = (value: number) => {
    return `${Number(value).toFixed(2)} €`;
};

export function InvoiceSummary({
                                   dashboard,
                               }: InvoiceSummaryProps) {
    if (dashboard.invoice) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-gray-900">
                        Súhrn faktúry
                    </h3>

                    <span className="text-sm text-gray-500">
                        {dashboard.invoice.invoiceNumber}
                    </span>
                </div>

                {dashboard.invoice.participants.length > 1 ? (
                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
                        Zdieľaná faktúra obsahuje{" "}
                        <strong>{dashboard.invoice.participants.length}</strong>{" "}
                        účastníkov.
                    </div>
                ) : null}

                <div className="space-y-2 text-sm">
                    {dashboard.invoice.items.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex justify-between gap-4 border-b py-2"
                        >
                            <div className="min-w-0">
                                <span className="block break-words font-medium text-gray-900">
                                    {item.name}
                                </span>

                                {item.quantity > 1 ? (
                                    <span className="text-xs text-gray-500">
                                        {item.quantity} ×{" "}
                                        {formatMoney(item.unitPrice)}
                                    </span>
                                ) : null}
                            </div>

                            <span className="whitespace-nowrap font-semibold">
                                {formatMoney(item.totalPrice)}
                            </span>
                        </div>
                    ))}

                    <div className="flex justify-between border-t-2 py-3 text-base font-bold sm:text-lg">
                        <span>Celkom</span>
                        <span>{formatMoney(dashboard.invoice.totalAmount)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
                Súhrn nákladov
            </h3>

            <div className="space-y-2 text-sm">
                {dashboard.selectedConferenceEntryId ? (
                    <div className="flex justify-between gap-4 border-b py-2">
                        <span>
                            Registračný poplatok (
                            {dashboard.summary.conferenceEntryLabel})
                        </span>

                        <span className="whitespace-nowrap font-semibold">
                            {formatMoney(dashboard.selectedConferenceEntry?.price ?? 0)}
                        </span>
                    </div>
                ) : null}

                {dashboard.selectedAccommodation ? (
                    <div className="flex justify-between gap-4 border-b py-2">
                        <span className="break-words">
                            {dashboard.selectedAccommodation.name}
                        </span>

                        <span className="whitespace-nowrap font-semibold">
                            {formatMoney(dashboard.selectedAccommodation.price)}
                        </span>
                    </div>
                ) : null}

                {dashboard.catering.map((id) => {
                    const option = dashboard.cateringOptions.find(
                        (cateringOption) => cateringOption.id === id
                    );

                    if (!option) {
                        return null;
                    }

                    return (
                        <div
                            key={id}
                            className="flex justify-between gap-4 border-b py-2"
                        >
                            <span className="break-words">
                                {option.name}
                            </span>

                            <span className="whitespace-nowrap font-semibold">
                                {formatMoney(option.price)}
                            </span>
                        </div>
                    );
                })}

                <div className="flex justify-between border-t-2 py-3 text-base font-bold sm:text-lg">
                    <span>Celkom</span>
                    <span>{formatMoney(dashboard.total)}</span>
                </div>
            </div>
        </div>
    );
}