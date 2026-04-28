import { AdminBadge } from "../base/index.ts";

type InvoiceStatusBadgeProps = {
    status: number;
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    if (status === 1) {
        return <AdminBadge variant="success">Zaplatená</AdminBadge>;
    }

    if (status === 2) {
        return <AdminBadge variant="danger">Zrušená</AdminBadge>;
    }

    return <AdminBadge variant="warning">Čaká na úhradu</AdminBadge>;
}