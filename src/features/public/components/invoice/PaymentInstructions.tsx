import type { PublicDashboardContext } from "../../types/publicTypes.ts";

type PaymentInstructionsProps = {
    dashboard: PublicDashboardContext;
};

export function PaymentInstructions({
                                        dashboard,
                                    }: PaymentInstructionsProps) {
    if (dashboard.invoiceStatus !== "pending") {
        return null;
    }

    const variableSymbol = dashboard.invoice?.invoiceNumber ?? "2026001";
    const iban = dashboard.supplier?.iban ?? "IBAN nie je dostupný";
    const bank = dashboard.supplier?.bank;
    const swift = dashboard.supplier?.swift;

    return (
        <div className="rounded-xl bg-gray-50 p-4 text-sm">
            <h4 className="mb-2 font-semibold">
                Pokyny na zaplatenie:
            </h4>

            <p className="text-gray-600">
                Platbu prosím zašlite na účet:
                <br />

                {bank ? (
                    <>
                        Banka: <strong>{bank}</strong>
                        <br />
                    </>
                ) : null}

                IBAN: <strong>{iban}</strong>

                {swift ? (
                    <>
                        <br />
                        SWIFT: <strong>{swift}</strong>
                    </>
                ) : null}

                <br />
                Variabilný symbol: <strong>{variableSymbol}</strong>

                {dashboard.invoice?.sharedCode ? (
                    <>
                        <br />
                        <br />
                        <em>
                            Pri zdieľanej faktúre platí celú sumu jeden účastník.
                        </em>
                    </>
                ) : null}
            </p>
        </div>
    );
}