import { AdminBadge } from "../base/index.ts";

import type { Invoice } from "../../../../api/invoiceApi.ts";

type InvoiceFileBadgeProps = {
    invoice: Invoice;
};

export function InvoiceFileBadge({ invoice }: InvoiceFileBadgeProps) {
    if (invoice.fileManagerId || invoice.fileManager) {
        return <AdminBadge variant="success">Vo FileManageri</AdminBadge>;
    }

    return <AdminBadge variant="warning">Bez uloženého súboru</AdminBadge>;
}