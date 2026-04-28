import { RefreshCw } from "lucide-react";

import type {
    ApiInvoiceStatus,
    Invoice,
} from "../../../../api/invoiceApi.ts";

import {
    AdminActionButton,
    AdminEmptyState,
    AdminSectionCard,
} from "../shared/index.ts";

import { InvoicesErrorBox } from "./InvoicesErrorBox.tsx";
import { InvoicesLoadingState } from "./InvoicesLoadingState.tsx";
import { InvoicesTable } from "./InvoicesTable.tsx";

type InvoicesTabProps = {
    invoices: Invoice[];
    loading: boolean;
    error: string;
    onReload: () => Promise<Invoice[]>;
    onUpdateStatus: (
        invoiceId: number,
        status: ApiInvoiceStatus
    ) => Promise<Invoice>;
};

export function InvoicesTab({
                                invoices,
                                loading,
                                error,
                                onReload,
                                onUpdateStatus,
                            }: InvoicesTabProps) {
    return (
        <AdminSectionCard
            title="Faktúry"
            description="Prehľad samostatných a zdieľaných faktúr uložených cez FileManager"
            action={
                <AdminActionButton
                    label={loading ? "Načítavam..." : "Obnoviť"}
                    icon={RefreshCw}
                    variant="outline"
                    size="md"
                    disabled={loading}
                    hiddenLabelOnMobile={false}
                    onClick={onReload}
                />
            }
        >
            <div className="space-y-4">
                {error ? <InvoicesErrorBox message={error} /> : null}

                {loading ? <InvoicesLoadingState /> : null}

                {!loading && invoices.length === 0 ? (
                    <AdminEmptyState
                        title="Žiadne faktúry"
                        description="Zatiaľ nebola vygenerovaná žiadna faktúra."
                    />
                ) : null}

                {!loading && invoices.length > 0 ? (
                    <InvoicesTable
                        invoices={invoices}
                        onUpdateStatus={onUpdateStatus}
                    />
                ) : null}
            </div>
        </AdminSectionCard>
    );
}