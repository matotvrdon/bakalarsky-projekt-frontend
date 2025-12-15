import { api } from "./baseApi";
import type { InvoiceItem } from "../types/types";

export const getInvoiceItem = (invoiceItemId: number): Promise<InvoiceItem> =>
    api(`/api/invoice-item/${invoiceItemId}`);

export const createInvoiceItem = (data: {
    name: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    attendeeId: number;
}): Promise<InvoiceItem> =>
    api("/api/invoice-item/create-invoice-item", {
        method: "POST",
        json: data
    });