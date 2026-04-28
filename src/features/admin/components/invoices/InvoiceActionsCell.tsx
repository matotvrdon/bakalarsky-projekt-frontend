import { CheckCircle2, Download, XCircle } from "lucide-react";

import {
    downloadInvoicePdf,
    type ApiInvoiceStatus,
    type Invoice,
} from "../../../../api/invoiceApi.ts";

import { AdminActionButton } from "../shared/index.ts";

type InvoiceActionsCellProps = {
    invoice: Invoice;
    onUpdateStatus: (
        invoiceId: number,
        status: ApiInvoiceStatus
    ) => Promise<Invoice>;
};

export function InvoiceActionsCell({
                                       invoice,
                                       onUpdateStatus,
                                   }: InvoiceActionsCellProps) {
    const handleDownload = async () => {
        const { blob, fileName } = await downloadInvoicePdf(invoice.id);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-wrap gap-2">
            <AdminActionButton
                label="PDF"
                icon={Download}
                size="sm"
                variant="outline"
                onClick={handleDownload}
            />

            {invoice.status !== 1 ? (
                <AdminActionButton
                    label="Zaplatiť"
                    icon={CheckCircle2}
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(invoice.id, 1)}
                    className="text-green-700 hover:border-green-300 hover:bg-green-50"
                />
            ) : null}

            {invoice.status !== 2 ? (
                <AdminActionButton
                    label="Zrušiť"
                    icon={XCircle}
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(invoice.id, 2)}
                    className="text-red-700 hover:border-red-300 hover:bg-red-50"
                />
            ) : null}
        </div>
    );
}