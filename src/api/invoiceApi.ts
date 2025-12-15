import { api } from "./baseApi";

export const getInvoice = (invoiceId: number) =>
    api(`/api/invoice/${invoiceId}`);

export const createInvoice = (data: {
    supplierId: number;
    customerId: number;
    issueDate: string;
    dueDate: string;
}) =>
    api("/api/invoice/", {
        method: "POST",
        json: data
    });