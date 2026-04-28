import type { Invoice } from "../../../../api/invoiceApi.ts";

type InvoiceCustomerCellProps = {
    invoice: Invoice;
};

export function InvoiceCustomerCell({ invoice }: InvoiceCustomerCellProps) {
    const customerName =
        invoice.customerType === 1 && invoice.companyName
            ? invoice.companyName
            : invoice.customerName;

    return (
        <div>
            <div className="font-medium text-gray-900">
                {customerName || "-"}
            </div>

            {invoice.billingAddress ? (
                <div className="max-w-[260px] truncate text-xs text-gray-500">
                    {invoice.billingAddress}
                </div>
            ) : null}
        </div>
    );
}