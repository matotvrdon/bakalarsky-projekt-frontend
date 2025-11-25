export interface Attendee {
    id: number;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    customerId?: number | null;
    registeredAt?: string | null;
    sessions: (Session | null)[];
}

export interface Conference {
    id: number;
    name: string;
    description?: string | null;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    days: (Day | null)[];
    themes: (Theme | null)[];
}

export interface Customer {
    id: number;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    ico?: string | null;
    dic?: string | null;
    icDph?: string | null;
    attendee: (Attendee | null)[];
}

export interface Day {
    id: number;
    conferenceId: number;
    date: string;
    sessions: (Session | null)[];
}

export interface Invoice {
    id: number;
    number: string;
    date: string;
    dueDate?: string | null;
    customerId: number;
    supplierId?: number | null;
    total: number;
    items: (InvoiceItem | null)[];
}

export interface InvoiceItem {
    id: number;
    invoiceId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    vat?: number | null;
}

export interface Session {
    id: number;
    title: string;
    abstract?: string | null;
    talkId?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    room?: string | null;
    talk?: Talk | null;
    attendees: (Attendee | null)[];
}

export interface Supplier {
    id: number;
    name: string;
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
    ico?: string | null;
    dic?: string | null;
    icDph?: string | null;
}

export interface Talk {
    id: number;
    title: string;
    description?: string | null;
    durationMinutes?: number | null;
    speaker?: string | null;
    theme?: Theme | null;
}

export interface Theme {
    id: number;
    name: string;
    description?: string | null;
    talks: (Talk | null)[];
}
