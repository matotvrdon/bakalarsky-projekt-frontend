import { useEffect, useState } from "react";

import {
    getInvoices,
    updateInvoiceStatus,
    type ApiInvoiceStatus,
    type Invoice,
} from "../../../api/invoiceApi.ts";

export function useInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [invoicesError, setInvoicesError] = useState("");

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async (): Promise<Invoice[]> => {
        try {
            setInvoicesLoading(true);
            setInvoicesError("");

            const result = await getInvoices();

            setInvoices(result);
            return result;
        } catch (error) {
            console.error("Failed to load invoices", error);
            setInvoices([]);
            setInvoicesError("Faktúry sa nepodarilo načítať.");
            return [];
        } finally {
            setInvoicesLoading(false);
        }
    };

    const updateInvoiceStatusHandler = async (
        invoiceId: number,
        status: ApiInvoiceStatus
    ) => {
        const updatedInvoice = await updateInvoiceStatus(invoiceId, {
            status,
        });

        setInvoices((current) =>
            current.map((invoice) =>
                invoice.id === updatedInvoice.id ? updatedInvoice : invoice
            )
        );

        return updatedInvoice;
    };

    return {
        invoices,
        invoicesLoading,
        invoicesError,
        loadInvoices,
        updateInvoiceStatusHandler,
    };
}