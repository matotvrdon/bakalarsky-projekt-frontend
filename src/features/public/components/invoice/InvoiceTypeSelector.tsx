import { Users } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicLabel,
    PublicOptionCard,
} from "../base/index.ts";

type InvoiceTypeSelectorProps = {
    dashboard: PublicDashboardContext;
};

export function InvoiceTypeSelector({
                                        dashboard,
                                    }: InvoiceTypeSelectorProps) {
    const locked = dashboard.invoiceGenerated;

    return (
        <div className="space-y-3">
            <PublicLabel className="text-base">
                Typ faktúry
            </PublicLabel>

            <div className="space-y-3">
                <PublicOptionCard
                    htmlFor="individual"
                    selected={dashboard.invoiceType === "individual"}
                    disabled={locked}
                >
                    <input
                        id="individual"
                        type="radio"
                        name="invoiceType"
                        value="individual"
                        checked={dashboard.invoiceType === "individual"}
                        disabled={locked}
                        onChange={() => dashboard.setInvoiceType("individual")}
                        className="mt-1 h-4 w-4"
                    />

                    <div className="flex-1">
                        <PublicLabel
                            htmlFor="individual"
                            className="cursor-pointer"
                        >
                            Samostatná faktúra
                        </PublicLabel>

                        <p className="mt-1 text-sm text-gray-600">
                            Faktúra len pre vás.
                        </p>
                    </div>
                </PublicOptionCard>

                <PublicOptionCard
                    htmlFor="create-shared"
                    selected={dashboard.invoiceType === "create-shared"}
                    disabled={locked}
                >
                    <input
                        id="create-shared"
                        type="radio"
                        name="invoiceType"
                        value="create-shared"
                        checked={dashboard.invoiceType === "create-shared"}
                        disabled={locked}
                        onChange={() => dashboard.setInvoiceType("create-shared")}
                        className="mt-1 h-4 w-4"
                    />

                    <div className="flex-1">
                        <PublicLabel
                            htmlFor="create-shared"
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            Vytvoriť zdieľanú faktúru
                        </PublicLabel>

                        <p className="mt-1 text-sm text-gray-600">
                            Vygenerujete kód, ktorý môžu použiť ostatní
                            účastníci.
                        </p>
                    </div>
                </PublicOptionCard>

                <PublicOptionCard
                    htmlFor="join-shared"
                    selected={dashboard.invoiceType === "join-shared"}
                    disabled={locked}
                >
                    <input
                        id="join-shared"
                        type="radio"
                        name="invoiceType"
                        value="join-shared"
                        checked={dashboard.invoiceType === "join-shared"}
                        disabled={locked}
                        onChange={() => dashboard.setInvoiceType("join-shared")}
                        className="mt-1 h-4 w-4"
                    />

                    <div className="flex-1">
                        <PublicLabel
                            htmlFor="join-shared"
                            className="cursor-pointer"
                        >
                            Pripojiť sa k zdieľanej faktúre
                        </PublicLabel>

                        <p className="mt-1 text-sm text-gray-600">
                            Zadajte kód od iného účastníka.
                        </p>
                    </div>
                </PublicOptionCard>
            </div>
        </div>
    );
}