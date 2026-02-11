export interface Attendee {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    customerId?: number | null;
    customer?: (Customer | null);
    invoiceItem: (InvoiceItem | null)[];
}

export type IsActiveStatus = "Active" | "Inactive" | 0 | 1 | boolean;

export interface NavBarMenu {
    id: number;
    name: string;
    isActive: IsActiveStatus;
}

export interface PageContent {
    id: number;
    title?: string;
    markdown?: string;
    html?: string;
    Title?: string;
    Markdown?: string;
    Html?: string;
    navBarMenuId?: number;
    NavBarMenuId?: number;
    navBarMenu?: NavBarMenu | null;
    NavBarMenu?: NavBarMenu | null;
}

export interface Conference {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    day: (Day | null)[];
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
    attendee?: (Attendee | null)[];
}

export interface Day {
    id: number;
    conferenceId: number;
    conference: (Conference | null);
    date: string;
    session: (Session | null)[];
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    totalPrice: number;
    customerId: number;
    customer: (Customer | null);
    supplierId: number | null;
    supplier: (Supplier | null);
}

export interface InvoiceItem {
    id: number;
    name: string;
    unit: string
    unitPrice: number;
    quantity: number;
    price: number;
    attendeeId?: number | null;
    attendee?: (Attendee | null);
}

export interface Session {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    dayId: number | null;
    day: Day | null;
    theme: (Theme | null)[];
}

export interface Supplier {
    id: number;
    name: string;
    street: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    ico: string | null;
    dic: string | null;
    icDph: string | null;
    bank: string;
    address: string;
    addressPostalCode: string;
    addressCity: string;
    bankAccount: string;
    swift: string;
    iban: string;
    phone: string;
}

export interface Talk {
    id: number;
    title: string;
    content: string | null;
    startTime: string;
    endTime: string;
    themeId: number | null;
    theme: Theme | null;
}

export interface Theme {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    chair: string | null;
    sessionId: number | null;
    session: Session | null;
    talk: (Talk | null)[];
}
