import { BASE_URL, api } from "./baseApi.ts";
import type { FileManagerPayload } from "./participantApi.ts";

export type ApiInvoiceType = 0 | 1;
export type ApiInvoiceStatus = 0 | 1 | 2;
export type ApiInvoiceItemType = 0 | 1 | 2;
export type ApiInvoiceCustomerType = 0 | 1;

export type InvoiceItem = {
    id: number;
    participantId?: number | null;
    type: ApiInvoiceItemType;
    sourceId?: number | null;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
};

export type InvoiceParticipant = {
    participantId: number;
    fullName: string;
};

export type Invoice = {
    id: number;
    conferenceId: number;
    invoiceNumber: string;
    type: ApiInvoiceType;
    isShared: boolean;
    status: ApiInvoiceStatus;
    sharedCode?: string | null;
    totalAmount: number;

    customerType: ApiInvoiceCustomerType;
    customerName: string;
    companyName?: string | null;
    billingAddress: string;
    ico?: string | null;
    dic?: string | null;
    vatId?: string | null;

    createdAtUtc: string;
    dueDateUtc: string;
    paidAtUtc?: string | null;

    fileManagerId?: number | null;
    fileManager?: FileManagerPayload | null;

    items: InvoiceItem[];
    participants: InvoiceParticipant[];
};

export type InvoiceCreateRequest = {
    participantId: number;
    type: ApiInvoiceType;

    customerType: ApiInvoiceCustomerType;
    customerName?: string | null;
    companyName?: string | null;
    billingAddress: string;
    ico?: string | null;
    dic?: string | null;
    vatId?: string | null;

    bookingOptionId?: number | null;
    foodOptionIds: number[];
};

export type JoinSharedInvoiceRequest = {
    participantId: number;
    sharedCode: string;
    bookingOptionId?: number | null;
    foodOptionIds: number[];
};

export type InvoiceStatusUpdateRequest = {
    status: ApiInvoiceStatus;
};

export const getInvoices = () => api<Invoice[]>("/api/invoices");

export const getInvoiceById = (invoiceId: number) =>
    api<Invoice>(`/api/invoices/${invoiceId}`);

export const getParticipantInvoices = (participantId: number) =>
    api<Invoice[]>(`/api/invoices/participant/${participantId}`);

export const createInvoice = (payload: InvoiceCreateRequest) =>
    api<Invoice>("/api/invoices", {
        method: "POST",
        json: payload,
    });

export const joinSharedInvoice = (payload: JoinSharedInvoiceRequest) =>
    api<Invoice>("/api/invoices/join-shared", {
        method: "POST",
        json: payload,
    });

export const updateInvoiceStatus = (
    invoiceId: number,
    payload: InvoiceStatusUpdateRequest
) =>
    api<Invoice>(`/api/invoices/${invoiceId}/status`, {
        method: "PATCH",
        json: payload,
    });

export const downloadInvoicePdf = async (
    invoiceId: number
): Promise<{ blob: Blob; fileName: string }> => {
    const response = await fetch(`${BASE_URL}/api/invoices/${invoiceId}/pdf`);

    if (!response.ok) {
        throw new Error("Stiahnutie faktúry zlyhalo.");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);

    return {
        blob: await response.blob(),
        fileName: fileNameMatch?.[1] ?? `invoice-${invoiceId}.pdf`,
    };
};