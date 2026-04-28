import type { ReactNode } from "react";

import type {
    BookingOption,
    Conference,
    ConferenceEntry,
    FoodOption,
} from "../../../api/conferenceApi.ts";

import type { Supplier } from "../../../api/supplierApi.ts";

import type {
    FileManagerPayload,
    ParticipantPayload,
} from "../../../api/participantApi.ts";

import type { SubmissionPayload } from "../../../api/submissionApi.ts";
import type { Invoice } from "../../../api/invoiceApi.ts";

export type CurrentUser = {
    id: number;
    name: string;
    email?: string;
    role: string;
    participantId?: number;
    conferenceId?: number;
};

export type PublicTabValue =
    | "participation"
    | "submission"
    | "services"
    | "invoice";

export type InvoiceType =
    | "individual"
    | "create-shared"
    | "join-shared";

export type InvoiceStatus =
    | "pending"
    | "paid";

export type InvoiceCustomerType =
    | "person"
    | "company";

export type BillingInfo = {
    customerType: InvoiceCustomerType;
    customerName: string;
    companyName: string;

    street: string;
    postalCode: string;
    city: string;
    country: string;

    ico: string;
    dic: string;
    vatId: string;
};

export type SubmissionForm = {
    submissionIdentifier: string;
    title: string;
};

export type SubmissionFieldErrors = Partial<
    Record<
        "submissionIdentifier" | "title" | "participantId" | "conferenceId",
        string
    >
>;

export type PublicSummary = {
    conferenceEntryLabel: string;
    studentStatusLabel: string;
    submissionStatusLabel: string;
};

export type PublicAuthState = {
    currentUser: CurrentUser | null;
    activeConference: Conference | null;
};

export type PublicParticipationState = {
    participantDraft: ParticipantPayload | null;

    selectedConferenceEntryId: string;
    selectedConferenceEntry: ConferenceEntry | null;
    conferenceEntryOptions: ConferenceEntry[];

    isStudent: boolean;
    isStudentStatusLocked: boolean;
    studentProofFile: File | null;
    studentVerificationFile: FileManagerPayload | null;
    studentVerificationFileName: string;
    studentVerificationStatus: number | null;
    savedIsStudent: boolean;

    savingParticipant: boolean;
    uploadingStudentProof: boolean;
    saveParticipantError: string;
    studentUploadError: string;
    hasParticipationChanges: boolean;
};

export type PublicParticipationActions = {
    setSelectedConferenceEntryId: (value: string) => void;
    setIsStudent: (value: boolean) => void;
    setStudentProofFile: (file: File | null) => void;

    handleSaveParticipation: () => Promise<void>;
    handleUploadStudentProof: () => Promise<void>;
};

export type PublicSubmissionState = {
    willPresent: boolean;
    presentationFile: File | null;

    submissionRecord: SubmissionPayload | null;
    submission: SubmissionForm;
    submissionLoading: boolean;
    savingSubmission: boolean;
    uploadingPresentation: boolean;

    saveSubmissionError: string;
    submissionFieldErrors: SubmissionFieldErrors;
    submissionSuccessMessage: string;

    latestSubmissionFile: FileManagerPayload | null;
    latestSubmissionFileName: string;
    latestSubmissionFileStatus: number | null;
    isSubmissionStatusLocked: boolean;
};

export type PublicSubmissionActions = {
    setWillPresent: (value: boolean) => void;
    setPresentationFile: (file: File | null) => void;
    setSubmission: (value: SubmissionForm) => void;

    handleSaveSubmission: () => Promise<void>;
    handleUploadSubmissionFile: () => Promise<void>;
};

export type PublicServicesState = {
    accommodation: number | null;
    accommodationOptions: BookingOption[];
    selectedAccommodation: BookingOption | null;

    catering: number[];
    cateringOptions: FoodOption[];

    total: number;
};

export type PublicServicesActions = {
    setAccommodation: (value: number | null) => void;
    setCatering: (value: number[]) => void;
};

export type PublicInvoiceState = {
    invoiceGenerated: boolean;
    invoiceStatus: InvoiceStatus;
    invoiceType: InvoiceType;
    sharedInvoiceCode: string;
    joinCode: string;
    hasCustomBilling: boolean;
    billingInfo: BillingInfo;

    invoice: Invoice | null;
    invoiceLoading: boolean;
    invoiceError: string;

    supplier: Supplier | null;
    supplierLoading: boolean;
};

export type PublicInvoiceActions = {
    setInvoiceType: (value: InvoiceType) => void;
    setJoinCode: (value: string) => void;
    setHasCustomBilling: (value: boolean) => void;
    setBillingInfo: (value: BillingInfo) => void;

    handleGenerateInvoice: () => Promise<void>;
    handleDownloadInvoice: () => Promise<void>;
    copySharedInvoiceCode: () => Promise<void>;
};

export type PublicFileActions = {
    getFileViewUrl: (fileManagerId: number) => string;
    getFileDownloadUrl: (fileManagerId: number) => string;
};

export type PublicDashboardContext =
    PublicAuthState &
    PublicParticipationState &
    PublicParticipationActions &
    PublicSubmissionState &
    PublicSubmissionActions &
    PublicServicesState &
    PublicServicesActions &
    PublicInvoiceState &
    PublicInvoiceActions &
    PublicFileActions & {
    summary: PublicSummary;
};

export type PublicTabItem = {
    value: PublicTabValue;
    label: string;
    shortLabel: string;
    icon: ReactNode;
};