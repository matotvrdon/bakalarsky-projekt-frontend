import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { PublicButton } from "../base/index.ts";

type GenerateInvoiceButtonProps = {
    dashboard: PublicDashboardContext;
};

const getButtonLabel = (dashboard: PublicDashboardContext) => {
    if (dashboard.invoiceLoading) {
        if (dashboard.invoiceType === "join-shared") {
            return "Pripájam k faktúre...";
        }

        return "Generujem faktúru...";
    }

    if (dashboard.invoiceType === "join-shared") {
        return "Pripojiť k faktúre";
    }

    if (dashboard.invoiceType === "create-shared") {
        return "Vytvoriť zdieľanú faktúru";
    }

    return "Vygenerovať faktúru";
};

export function GenerateInvoiceButton({
                                          dashboard,
                                      }: GenerateInvoiceButtonProps) {
    return (
        <PublicButton
            type="button"
            className="w-full"
            size="lg"
            onClick={dashboard.handleGenerateInvoice}
            disabled={
                dashboard.invoiceLoading ||
                !dashboard.selectedConferenceEntryId ||
                (dashboard.invoiceType === "join-shared" &&
                    !dashboard.joinCode.trim())
            }
        >
            {getButtonLabel(dashboard)}
        </PublicButton>
    );
}