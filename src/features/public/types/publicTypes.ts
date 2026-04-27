import type { ReactNode } from "react";

import type {
    BookingOption,
    Conference,
    ConferenceEntry,
    FoodOption,
} from "../../../app/api/conferenceApi.ts";

import type {
    FileManagerPayload,
    ParticipantPayload,
} from "../../../app/api/participantApi.ts";

import type { SubmissionPayload } from "../../../app/api/submissionApi.ts";

export type CurrentUser = {
    id: number;
    name: string;
    email?: string;
    role: string;
    participantId?: number;
    conferenceId?: number;
};

export type PublicTabValue = "participation" | "submission" | "services" | "invoice";

export type InvoiceType = "individual" | "create-shared" | "join-shared";
export type InvoiceStatus = "pending" | "paid";

export type BillingInfo = {
    companyName: string;
    ico: string;
    dic: string;
    address: string;
};

export type SubmissionForm = {
    submissionIdentifier: string;
    title: string;
};

export type SubmissionFieldErrors = Partial<
    Record<"submissionIdentifier" | "title" | "participantId" | "conferenceId", string>
>;

export type PublicSummary = {
    conferenceEntryLabel: string;
    studentStatusLabel: string;
    submissionStatusLabel: string;
};

export type PublicDashboardState = {
    currentUser: CurrentUser | null;
    activeConference: Conference | null;

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

    accommodation: number | null;
    accommodationOptions: BookingOption[];
    selectedAccommodation: BookingOption | null;
    catering: number[];
    cateringOptions: FoodOption[];

    invoiceGenerated: boolean;
    invoiceStatus: InvoiceStatus;
    invoiceType: InvoiceType;
    sharedInvoiceCode: string;
    joinCode: string;
    hasCustomBilling: boolean;
    billingInfo: BillingInfo;

    summary: PublicSummary;
    total: number;
};

export type PublicDashboardActions = {
    setSelectedConferenceEntryId: (value: string) => void;
    setIsStudent: (value: boolean) => void;
    setStudentProofFile: (file: File | null) => void;
    setWillPresent: (value: boolean) => void;
    setPresentationFile: (file: File | null) => void;
    setSubmission: (value: SubmissionForm) => void;
    setAccommodation: (value: number | null) => void;
    setCatering: (value: number[]) => void;
    setInvoiceType: (value: InvoiceType) => void;
    setJoinCode: (value: string) => void;
    setHasCustomBilling: (value: boolean) => void;
    setBillingInfo: (value: BillingInfo) => void;

    handleSaveParticipation: () => Promise<void>;
    handleUploadStudentProof: () => Promise<void>;
    handleSaveSubmission: () => Promise<void>;
    handleUploadSubmissionFile: () => Promise<void>;
    handleGenerateInvoice: () => void;
    handleDownloadInvoice: () => void;
    copySharedInvoiceCode: () => Promise<void>;
    getFileViewUrl: (fileManagerId: number) => string;
    getFileDownloadUrl: (fileManagerId: number) => string;
};

export type PublicDashboardContext = PublicDashboardState & PublicDashboardActions;

export type PublicTabItem = {
    value: PublicTabValue;
    label: string;
    shortLabel: string;
    icon: ReactNode;
};