import { BASE_URL } from "./baseApi.ts";

export type Supplier = {
    id: number;
    name: string;
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
    ico?: string | null;
    dic?: string | null;
    icDph?: string | null;
    bank?: string | null;
    bankAccount?: string | null;
    swift?: string | null;
    iban?: string | null;
    phone?: string | null;
};

export const getActiveSupplier = async (): Promise<Supplier> => {
    const response = await fetch(`${BASE_URL}/api/suppliers/active`);

    if (!response.ok) {
        throw new Error("Failed to load supplier.");
    }

    return response.json();
};