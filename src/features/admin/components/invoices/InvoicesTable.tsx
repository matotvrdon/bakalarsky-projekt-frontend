import type {
    ApiInvoiceStatus,
    Invoice,
} from "../../../../api/invoiceApi.ts";

import {
    AdminTable,
    AdminTableBody,
    AdminTableCell,
    AdminTableHead,
    AdminTableHeader,
    AdminTableRow,
} from "../base/index.ts";

import { InvoiceActionsCell } from "./InvoiceActionsCell.tsx";
import { InvoiceCustomerCell } from "./InvoiceCustomerCell.tsx";
import { InvoiceFileBadge } from "./InvoiceFileBadge.tsx";
import { InvoiceParticipantsCell } from "./InvoiceParticipantsCell.tsx";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge.tsx";
import { InvoiceTypeBadge } from "./InvoiceTypeBadge.tsx";

type InvoicesTableProps = {
    invoices: Invoice[];
    onUpdateStatus: (
        invoiceId: number,
        status: ApiInvoiceStatus
    ) => Promise<Invoice>;
};

const formatMoney = (value: number) => {
    return `${Number(value).toFixed(2)} €`;
};

const formatDate = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return value.split("T")[0] ?? value;
};

export function InvoicesTable({
                                  invoices,
                                  onUpdateStatus,
                              }: InvoicesTableProps) {
    return (
        <AdminTable>
            <AdminTableHeader>
                <AdminTableRow>
                    <AdminTableHead>Číslo</AdminTableHead>
                    <AdminTableHead>Odberateľ</AdminTableHead>
                    <AdminTableHead>Typ</AdminTableHead>
                    <AdminTableHead>Účastníci</AdminTableHead>
                    <AdminTableHead>Suma</AdminTableHead>
                    <AdminTableHead>Splatnosť</AdminTableHead>
                    <AdminTableHead>Stav</AdminTableHead>
                    <AdminTableHead>Súbor</AdminTableHead>
                    <AdminTableHead>Akcie</AdminTableHead>
                </AdminTableRow>
            </AdminTableHeader>

            <AdminTableBody>
                {invoices.map((invoice) => (
                    <AdminTableRow key={invoice.id}>
                        <AdminTableCell>
                            <div className="font-medium text-gray-900">
                                {invoice.invoiceNumber}
                            </div>

                            {invoice.sharedCode ? (
                                <div className="text-xs text-gray-500">
                                    {invoice.sharedCode}
                                </div>
                            ) : null}
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceCustomerCell invoice={invoice} />
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceTypeBadge invoice={invoice} />
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceParticipantsCell invoice={invoice} />
                        </AdminTableCell>

                        <AdminTableCell>
                            {formatMoney(invoice.totalAmount)}
                        </AdminTableCell>

                        <AdminTableCell>
                            {formatDate(invoice.dueDateUtc)}
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceStatusBadge status={invoice.status} />
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceFileBadge invoice={invoice} />
                        </AdminTableCell>

                        <AdminTableCell>
                            <InvoiceActionsCell
                                invoice={invoice}
                                onUpdateStatus={onUpdateStatus}
                            />
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTableBody>
        </AdminTable>
    );
}