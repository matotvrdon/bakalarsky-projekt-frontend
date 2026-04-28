import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicCard,
} from "../base/index.ts";

import { BillingInfoForm } from "./BillingInfoForm.tsx";
import { GeneratedInvoicePanel } from "./GeneratedInvoicePanel.tsx";
import { GenerateInvoiceButton } from "./GenerateInvoiceButton.tsx";
import { InvoiceSummary } from "./InvoiceSummary.tsx";
import { InvoiceTypeSelector } from "./InvoiceTypeSelector.tsx";
import { SharedInvoiceJoinBox } from "./SharedInvoiceJoinBox.tsx";

type InvoiceTabProps = {
    dashboard: PublicDashboardContext;
};

export function InvoiceTab({
                               dashboard,
                           }: InvoiceTabProps) {
    return (
        <PublicCard
            title="Faktúra"
            description="Prehľad nákladov a vygenerovanie faktúry"
        >
            <div className="space-y-6">
                {!dashboard.invoiceGenerated ? (
                    <div className="space-y-4">
                        <InvoiceTypeSelector dashboard={dashboard} />
                        <SharedInvoiceJoinBox dashboard={dashboard} />
                        <BillingInfoForm dashboard={dashboard} />
                    </div>
                ) : null}

                {dashboard.invoiceError ? (
                    <PublicAlert variant="danger">
                        {dashboard.invoiceError}
                    </PublicAlert>
                ) : null}

                <InvoiceSummary dashboard={dashboard} />

                {!dashboard.invoiceGenerated ? (
                    <GenerateInvoiceButton dashboard={dashboard} />
                ) : (
                    <GeneratedInvoicePanel dashboard={dashboard} />
                )}
            </div>
        </PublicCard>
    );
}