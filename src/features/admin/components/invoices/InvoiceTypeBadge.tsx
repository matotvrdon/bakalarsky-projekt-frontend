import { AdminBadge } from "../base/index.ts";

import type { Invoice } from "../../../../api/invoiceApi.ts";

type InvoiceTypeBadgeProps = {
    invoice: Invoice;
};

export function InvoiceTypeBadge({ invoice }: InvoiceTypeBadgeProps) {
    if (invoice.isShared || invoice.type === 1) {
        return <AdminBadge variant="info">Zdieľaná</AdminBadge>;
    }

    return <AdminBadge variant="neutral">Samostatná</AdminBadge>;
}