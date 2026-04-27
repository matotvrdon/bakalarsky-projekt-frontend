import type {
    Committee,
    CommitteeMember,
    CommitteeRole,
} from "../../../app/api/committeeApi.ts";

import type {
    ConferenceEntry,
    ConferenceSettings,
    FoodOptionType,
    ProgramItemType,
} from "../../../app/api/conferenceApi.ts";

import type { FileManagerPayload } from "../../../app/api/participantApi.ts";

export type { FoodOptionType, ProgramItemType };

export type Conference = {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isActive: boolean;
    participantsCount: number;
    settings?: ConferenceSettings | null;
};

export type ImportantDateCreateForm = {
    label: string;
    normalDate: string;
};

export type ImportantDateUpdateForm = {
    id: number;
    label: string;
    normalDate: string;
    updatedDate: string;
};

export type ConferenceEntryCreateForm = {
    name: string;
    price: string;
};

export type ConferenceEntryUpdateForm = ConferenceEntryCreateForm & {
    id: number;
};

export type FoodOptionCreateForm = {
    name: string;
    description: string;
    date: string;
    price: string;
    foodOptionsType: FoodOptionType;
};

export type FoodOptionUpdateForm = FoodOptionCreateForm & {
    id: number;
};

export type BookingOptionCreateForm = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
};

export type BookingOptionUpdateForm = BookingOptionCreateForm & {
    id: number;
};

export type ProgramPresentationForm = {
    clientId: string;
    startTime: string;
    endTime: string;
    authors: string;
    title: string;
};

export type ProgramSessionForm = {
    clientId: string;
    sessionName: string;
    startTime: string;
    endTime: string;
    chair: string;
    presentations: ProgramPresentationForm[];
};

export type ProgramItemForm = {
    clientId: string;
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    speaker: string;
    chair: string;
    type: ProgramItemType;
    sessions: ProgramSessionForm[];
};

export type ProgramDayForm = {
    clientId: string;
    label: string;
    date: string;
    items: ProgramItemForm[];
};

export type Participant = {
    id: number;
    firstName: string;
    lastName: string;
    conferenceEntryId: number | null;
    conferenceEntry?: ConferenceEntry | null;
    isStudent: boolean;
    isPresenting?: boolean | null;
    fileManagers: FileManagerPayload[];
    email: string;
    phone: string;
    affiliation: string;
    country: string;
    type: string;
    registrationDate: string;
    invoiceStatus?: "pending" | "paid" | "none";
};

export type Invoice = {
    id: number;
    invoiceNumber: string;
    participantIds: number[];
    amount: number;
    status: "pending" | "paid";
    billingInfo: {
        companyName: string;
        ico: string;
        dic: string;
        address: string;
    };
    createdDate: string;
};

export type CommitteeForm = {
    id: number;
    clientId: string;
    name: string;
    description: string;
    order: string;
    roles: CommitteeRoleForm[];
};

export type CommitteeRoleForm = {
    id: number;
    clientId: string;
    name: string;
    order: string;
    members: CommitteeMemberForm[];
};

export type CommitteeMemberForm = {
    id: number;
    clientId: string;
    fullName: string;
    position: string;
    affiliation: string;
    country: string;
    order: string;
};

export type CommitteePayload = Committee;
export type CommitteeRolePayload = CommitteeRole;
export type CommitteeMemberPayload = CommitteeMember;