import { api } from "./baseApi";
import { toUtcIsoDate } from "../utils/date";

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
        json: {
            ...data,
            issueDate: toUtcIsoDate(data.issueDate),
            dueDate: toUtcIsoDate(data.dueDate)
        }
    });
