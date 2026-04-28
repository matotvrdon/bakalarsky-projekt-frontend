import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
    BookingOption,
    FoodOption,
} from "../../../api/conferenceApi.ts";

import type { ParticipantPayload } from "../../../api/participantApi.ts";

import {
    createInvoice,
    downloadInvoicePdf,
    getInvoiceById,
    getParticipantInvoices,
    joinSharedInvoice,
    type Invoice,
} from "../../../api/invoiceApi.ts";

import {
    getActiveSupplier,
    type Supplier,
} from "../../../api/supplierApi.ts";

import type {
    BillingInfo,
    InvoiceCustomerType,
    InvoiceStatus,
    InvoiceType,
} from "../types/publicTypes.ts";

const emptyBillingInfo: BillingInfo = {
    customerType: "person",
    customerName: "",
    companyName: "",
    street: "",
    postalCode: "",
    city: "",
    country: "Slovensko",
    ico: "",
    dic: "",
    vatId: "",
};

type UseParticipantInvoiceInput = {
    participantDraft: ParticipantPayload | null;
    selectedAccommodation: BookingOption | null;
    catering: number[];
    cateringOptions: FoodOption[];
};

const mapInvoiceTypeToApi = (invoiceType: InvoiceType): 0 | 1 => {
    if (invoiceType === "create-shared") {
        return 1;
    }

    return 0;
};

const mapCustomerTypeToApi = (customerType: InvoiceCustomerType): 0 | 1 => {
    if (customerType === "company") {
        return 1;
    }

    return 0;
};

const mapInvoiceStatusFromApi = (status: number): InvoiceStatus => {
    if (status === 1) {
        return "paid";
    }

    return "pending";
};

const getParticipantFullName = (participantDraft: ParticipantPayload | null) => {
    if (!participantDraft) {
        return "";
    }

    return `${participantDraft.firstName ?? ""} ${participantDraft.lastName ?? ""}`.trim();
};

const buildBillingAddress = (billingInfo: BillingInfo) => {
    return [
        billingInfo.street.trim(),
        `${billingInfo.postalCode.trim()} ${billingInfo.city.trim()}`.trim(),
        billingInfo.country.trim(),
    ]
        .filter(Boolean)
        .join(", ");
};

export function useParticipantInvoice({
                                          participantDraft,
                                          selectedAccommodation,
                                          catering,
                                          cateringOptions,
                                      }: UseParticipantInvoiceInput) {
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [supplierLoading, setSupplierLoading] = useState(false);
    const [invoiceGenerated, setInvoiceGenerated] = useState(false);
    const [invoiceStatus, setInvoiceStatus] =
        useState<InvoiceStatus>("pending");
    const [invoiceType, setInvoiceType] =
        useState<InvoiceType>("individual");

    const [sharedInvoiceCode, setSharedInvoiceCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [hasCustomBilling, setHasCustomBilling] = useState(false);

    const [billingInfo, setBillingInfo] =
        useState<BillingInfo>(emptyBillingInfo);

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [invoiceError, setInvoiceError] = useState("");

    const applyInvoiceState = (nextInvoice: Invoice | null) => {
        setInvoice(nextInvoice);
        setInvoiceGenerated(Boolean(nextInvoice));

        if (!nextInvoice) {
            setInvoiceStatus("pending");
            setSharedInvoiceCode("");
            return;
        }

        setInvoiceStatus(mapInvoiceStatusFromApi(nextInvoice.status));
        setSharedInvoiceCode(nextInvoice.sharedCode ?? "");

        if (nextInvoice.type === 1 && nextInvoice.sharedCode) {
            setInvoiceType("create-shared");
        }

        if (nextInvoice.type === 0) {
            setInvoiceType("individual");
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadSupplier = async () => {
            try {
                setSupplierLoading(true);

                const loadedSupplier = await getActiveSupplier();

                if (cancelled) {
                    return;
                }

                setSupplier(loadedSupplier);
            } catch (error) {
                console.error("Failed to load supplier", error);

                if (!cancelled) {
                    setSupplier(null);
                }
            } finally {
                if (!cancelled) {
                    setSupplierLoading(false);
                }
            }
        };

        loadSupplier();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!participantDraft?.id) {
            applyInvoiceState(null);
            return;
        }

        setBillingInfo((current) => ({
            ...current,
            customerName:
                current.customerName ||
                getParticipantFullName(participantDraft),
            country: current.country || "Slovensko",
        }));

        let cancelled = false;

        const loadInvoices = async () => {
            try {
                const invoices = await getParticipantInvoices(participantDraft.id);

                if (cancelled) {
                    return;
                }

                const activeInvoice =
                    invoices.find((invoice) => invoice.status !== 2) ?? null;

                applyInvoiceState(activeInvoice);
            } catch (error) {
                console.error("Failed to load invoices", error);
            }
        };

        loadInvoices();

        return () => {
            cancelled = true;
        };
    }, [participantDraft?.id]);

    const getFoodOptionIds = () => {
        return catering.filter((id) =>
            cateringOptions.some((option) => option.id === id)
        );
    };

    const validateBillingInfo = () => {
        if (invoiceType === "join-shared") {
            return true;
        }

        if (!billingInfo.street.trim()) {
            setInvoiceError("Ulica a číslo sú povinné.");
            return false;
        }

        if (!billingInfo.postalCode.trim()) {
            setInvoiceError("PSČ je povinné.");
            return false;
        }

        if (!billingInfo.city.trim()) {
            setInvoiceError("Mesto je povinné.");
            return false;
        }

        if (!billingInfo.country.trim()) {
            setInvoiceError("Štát je povinný.");
            return false;
        }

        if (billingInfo.customerType === "person") {
            const customerName =
                billingInfo.customerName.trim() ||
                getParticipantFullName(participantDraft);

            if (!customerName) {
                setInvoiceError("Meno odberateľa je povinné.");
                return false;
            }

            return true;
        }

        if (!billingInfo.companyName.trim()) {
            setInvoiceError("Názov firmy je povinný.");
            return false;
        }

        if (!billingInfo.ico.trim()) {
            setInvoiceError("IČO je povinné pri fakturácii na firmu.");
            return false;
        }

        return true;
    };

    const handleGenerateInvoice = async () => {
        if (!participantDraft?.id) {
            setInvoiceError("Participant nebol načítaný.");
            return;
        }

        if (invoiceType === "join-shared" && !joinCode.trim()) {
            setInvoiceError("Zadajte kód zdieľanej faktúry.");
            return;
        }

        setInvoiceError("");

        if (!validateBillingInfo()) {
            return;
        }

        setInvoiceLoading(true);

        try {
            const bookingOptionId = selectedAccommodation?.id ?? null;
            const foodOptionIds = getFoodOptionIds();

            const customerName =
                billingInfo.customerName.trim() ||
                getParticipantFullName(participantDraft);

            const savedInvoice =
                invoiceType === "join-shared"
                    ? await joinSharedInvoice({
                        participantId: participantDraft.id,
                        sharedCode: joinCode.trim().toUpperCase(),
                        bookingOptionId,
                        foodOptionIds,
                    })
                    : await createInvoice({
                        participantId: participantDraft.id,
                        type: mapInvoiceTypeToApi(invoiceType),

                        customerType: mapCustomerTypeToApi(
                            billingInfo.customerType
                        ),
                        customerName,
                        companyName:
                            billingInfo.customerType === "company"
                                ? billingInfo.companyName.trim()
                                : null,
                        billingAddress: buildBillingAddress(billingInfo),
                        ico:
                            billingInfo.customerType === "company"
                                ? billingInfo.ico.trim()
                                : null,
                        dic:
                            billingInfo.customerType === "company"
                                ? billingInfo.dic.trim() || null
                                : null,
                        vatId:
                            billingInfo.customerType === "company"
                                ? billingInfo.vatId.trim() || null
                                : null,

                        bookingOptionId,
                        foodOptionIds,
                    });

            const freshInvoice = await getInvoiceById(savedInvoice.id);

            applyInvoiceState(freshInvoice);

            toast.success(
                invoiceType === "join-shared"
                    ? "Pripojenie k faktúre bolo uložené."
                    : "Faktúra bola vygenerovaná."
            );
        } catch (error) {
            setInvoiceError(
                error instanceof Error
                    ? error.message
                    : "Vygenerovanie faktúry zlyhalo."
            );
        } finally {
            setInvoiceLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!invoice?.id) {
            setInvoiceError("Faktúra nebola načítaná.");
            return;
        }

        try {
            const { blob, fileName } = await downloadInvoicePdf(invoice.id);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            setInvoiceError(
                error instanceof Error
                    ? error.message
                    : "Stiahnutie faktúry zlyhalo."
            );
        }
    };

    const copySharedInvoiceCode = async () => {
        if (!sharedInvoiceCode) {
            return;
        }

        await navigator.clipboard.writeText(sharedInvoiceCode);
        toast.success("Kód bol skopírovaný.");
    };

    return {
        invoiceGenerated,
        invoiceStatus,
        invoiceType,
        sharedInvoiceCode,
        joinCode,
        hasCustomBilling,
        billingInfo,

        invoice,
        invoiceLoading,
        invoiceError,

        supplier,
        supplierLoading,

        setInvoiceType,
        setJoinCode,
        setHasCustomBilling,
        setBillingInfo,

        handleGenerateInvoice,
        handleDownloadInvoice,
        copySharedInvoiceCode,
    };
}