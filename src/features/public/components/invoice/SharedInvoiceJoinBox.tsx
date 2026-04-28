import { KeyRound } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicInput,
    PublicLabel,
} from "../base/index.ts";

type SharedInvoiceJoinBoxProps = {
    dashboard: PublicDashboardContext;
};

export function SharedInvoiceJoinBox({
                                         dashboard,
                                     }: SharedInvoiceJoinBoxProps) {
    if (dashboard.invoiceType !== "join-shared") {
        return null;
    }

    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <KeyRound className="h-4 w-4 text-blue-700" />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                        <PublicLabel htmlFor="joinCode">
                            Kód zdieľanej faktúry
                        </PublicLabel>

                        <p className="text-sm text-blue-800">
                            Zadajte kód, ktorý vám poskytol účastník vytvárajúci
                            spoločnú faktúru.
                        </p>
                    </div>

                    <PublicInput
                        id="joinCode"
                        value={dashboard.joinCode}
                        onChange={(event) =>
                            dashboard.setJoinCode(event.target.value.toUpperCase())
                        }
                        placeholder="Napr. CONF-AB12CD"
                        className="bg-white font-mono uppercase tracking-wide"
                    />

                    <p className="text-xs text-blue-700">
                        Po kliknutí na hlavné tlačidlo nižšie sa vaše vybrané
                        položky pripoja k tejto zdieľanej faktúre.
                    </p>
                </div>
            </div>
        </div>
    );
}