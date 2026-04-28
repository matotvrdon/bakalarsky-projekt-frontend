import type {
    Committee,
    CommitteeMember,
    CommitteeRole,
} from "../../../api/committeeApi.ts";

import type {
    BookingOption,
    ConferenceEntry,
    FoodOption,
    FoodOptionType,
    ImportantDate,
    ProgramDay,
    ProgramItem,
    ProgramItemType,
    ProgramPresentation,
    ProgramSession,
} from "../../../api/conferenceApi.ts";

import type {
    BookingOptionCreateForm,
    BookingOptionUpdateForm,
    CommitteeForm,
    CommitteeMemberForm,
    CommitteeRoleForm,
    ConferenceEntryCreateForm,
    ConferenceEntryUpdateForm,
    FoodOptionCreateForm,
    FoodOptionUpdateForm,
    ImportantDateUpdateForm,
    ProgramDayForm,
    ProgramItemForm,
    ProgramPresentationForm,
    ProgramSessionForm,
} from "../types/adminTypes.ts";

export const parseDecimalValue = (value: string) => {
    const normalized = value.trim().replace(",", ".");

    if (!normalized) {
        return Number.NaN;
    }

    return Number.parseFloat(normalized);
};

export const createClientId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeTimeValue = (value?: string | null) => {
    if (!value) {
        return "";
    }

    return value.slice(0, 5);
};

export const normalizeFoodOptionType = (
    value?: FoodOptionType | string | null
): FoodOptionType => {
    const normalizedValue = typeof value === "string" ? Number(value) : value;

    if (normalizedValue === 1) {
        return 1;
    }

    if (normalizedValue === 2) {
        return 2;
    }

    return 0;
};

export const createEmptyConferenceEntryForm = (): ConferenceEntryCreateForm => ({
    name: "",
    price: "",
});

export const createEmptyFoodOptionForm = (): FoodOptionCreateForm => ({
    name: "",
    description: "",
    date: "",
    price: "",
    foodOptionsType: 0,
});

export const createEmptyBookingOptionForm = (): BookingOptionCreateForm => ({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
});

export const createEmptyProgramPresentation = (): ProgramPresentationForm => ({
    clientId: createClientId(),
    startTime: "",
    endTime: "",
    authors: "",
    title: "",
});

export const createEmptyProgramSession = (): ProgramSessionForm => ({
    clientId: createClientId(),
    sessionName: "",
    startTime: "",
    endTime: "",
    chair: "",
    presentations: [createEmptyProgramPresentation()],
});

export const createEmptyProgramItem = (): ProgramItemForm => ({
    clientId: createClientId(),
    title: "",
    startTime: "",
    endTime: "",
    location: "",
    speaker: "",
    chair: "",
    type: 0,
    sessions: [],
});

export const createEmptyProgramDay = (): ProgramDayForm => ({
    clientId: createClientId(),
    label: "",
    date: "",
    items: [],
});

export const mapImportantDatesToEditForm = (
    importantDates?: ImportantDate[] | null
): ImportantDateUpdateForm[] => {
    if (!importantDates || importantDates.length === 0) {
        return [];
    }

    return importantDates.map((importantDate) => ({
        id: importantDate.id,
        label: importantDate.label ?? "",
        normalDate: importantDate.normalDate,
        updatedDate: importantDate.updatedDate ?? "",
    }));
};

export const mapConferenceEntriesToEditForm = (
    conferenceEntries?: ConferenceEntry[] | null
): ConferenceEntryUpdateForm[] => {
    if (!conferenceEntries || conferenceEntries.length === 0) {
        return [];
    }

    return conferenceEntries.map((conferenceEntry) => ({
        id: conferenceEntry.id,
        name: conferenceEntry.name ?? "",
        price: String(conferenceEntry.price ?? ""),
    }));
};

export const mapFoodOptionsToEditForm = (
    foodOptions?: FoodOption[] | null
): FoodOptionUpdateForm[] => {
    if (!foodOptions || foodOptions.length === 0) {
        return [];
    }

    return foodOptions.map((foodOption) => ({
        id: foodOption.id,
        name: foodOption.name ?? "",
        description: foodOption.description ?? "",
        date: foodOption.date ?? "",
        price: String(foodOption.price ?? ""),
        foodOptionsType: normalizeFoodOptionType(foodOption.foodOptionsType),
    }));
};

export const mapBookingOptionsToEditForm = (
    bookingOptions?: BookingOption[] | null
): BookingOptionUpdateForm[] => {
    if (!bookingOptions || bookingOptions.length === 0) {
        return [];
    }

    return bookingOptions.map((bookingOption) => ({
        id: bookingOption.id,
        name: bookingOption.name ?? "",
        description: bookingOption.description ?? "",
        startDate: bookingOption.startDate ?? "",
        endDate: bookingOption.endDate ?? "",
        price: String(bookingOption.price ?? ""),
    }));
};

export const sortProgramPresentations = (
    presentations?: ProgramPresentation[] | null
) => [...(presentations ?? [])].sort((left, right) => left.order - right.order);

export const sortProgramSessions = (sessions?: ProgramSession[] | null) =>
    [...(sessions ?? [])].sort((left, right) => left.order - right.order);

export const sortProgramItems = (items?: ProgramItem[] | null) =>
    [...(items ?? [])].sort((left, right) => left.order - right.order);

export const sortProgramDays = (days?: ProgramDay[] | null) =>
    [...(days ?? [])].sort((left, right) => left.order - right.order);

export const mapProgramDaysToForm = (
    programDays?: ProgramDay[] | null
): ProgramDayForm[] => {
    const sortedDays = sortProgramDays(programDays);

    if (sortedDays.length === 0) {
        return [];
    }

    return sortedDays.map((programDay) => ({
        clientId: `day-${programDay.id}`,
        label: programDay.label ?? "",
        date: programDay.date ?? "",
        items: sortProgramItems(programDay.programItems).map((item) => ({
            clientId: `item-${item.id}`,
            title: item.title ?? "",
            startTime: normalizeTimeValue(item.startTime),
            endTime: normalizeTimeValue(item.endTime),
            location: item.location ?? "",
            speaker: item.speaker ?? "",
            chair: item.chair ?? "",
            type: item.type,
            sessions: sortProgramSessions(item.sessions).map((session) => ({
                clientId: `session-${session.id}`,
                sessionName: session.sessionName ?? "",
                startTime: normalizeTimeValue(session.startTime),
                endTime: normalizeTimeValue(session.endTime),
                chair: session.chair ?? "",
                presentations: sortProgramPresentations(session.presentations).map(
                    (presentation) => ({
                        clientId: `presentation-${presentation.id}`,
                        startTime: normalizeTimeValue(presentation.startTime),
                        endTime: normalizeTimeValue(presentation.endTime),
                        authors: presentation.authors ?? "",
                        title: presentation.title ?? "",
                    })
                ),
            })),
        })),
    }));
};

export const PROGRAM_ITEM_TYPE = {
    registration: 0,
    opening: 1,
    keynote: 2,
    parallel: 3,
    session: 4,
    workshop: 5,
    panel: 6,
    break: 7,
    social: 8,
    poster: 9,
    closing: 10,
} as const;

export type ProgramLegendItem = {
    type: ProgramItemType;
    label: string;
    valueLabel: string;
    dotClassName: string;
    itemClassName: string;
    badgeClassName: string;
    selectClassName: string;
};

export const programLegendItems: ProgramLegendItem[] = [
    {
        type: PROGRAM_ITEM_TYPE.registration,
        label: "Registrácia",
        valueLabel: "registration",
        dotClassName: "bg-indigo-500",
        itemClassName: "border-indigo-200 border-l-indigo-500 bg-indigo-50",
        badgeClassName: "border-indigo-200 bg-indigo-100 text-indigo-800",
        selectClassName:
            "border-indigo-300 bg-indigo-50 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.opening,
        label: "Otvorenie",
        valueLabel: "opening",
        dotClassName: "bg-lime-600",
        itemClassName: "border-lime-200 border-l-lime-600 bg-lime-50",
        badgeClassName: "border-lime-200 bg-lime-100 text-lime-800",
        selectClassName:
            "border-lime-300 bg-lime-50 text-lime-900 focus:border-lime-500 focus:ring-lime-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.keynote,
        label: "Pozvané prednášky",
        valueLabel: "keynote",
        dotClassName: "bg-blue-500",
        itemClassName: "border-blue-200 border-l-blue-500 bg-blue-50",
        badgeClassName: "border-blue-200 bg-blue-100 text-blue-800",
        selectClassName:
            "border-blue-300 bg-blue-50 text-blue-900 focus:border-blue-500 focus:ring-blue-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.parallel,
        label: "Paralelné sekcie",
        valueLabel: "parallel",
        dotClassName: "bg-emerald-500",
        itemClassName: "border-emerald-200 border-l-emerald-500 bg-emerald-50",
        badgeClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
        selectClassName:
            "border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.session,
        label: "Session",
        valueLabel: "session",
        dotClassName: "bg-green-500",
        itemClassName: "border-green-200 border-l-green-500 bg-green-50",
        badgeClassName: "border-green-200 bg-green-100 text-green-800",
        selectClassName:
            "border-green-300 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.workshop,
        label: "Workshopy",
        valueLabel: "workshop",
        dotClassName: "bg-purple-500",
        itemClassName: "border-purple-200 border-l-purple-500 bg-purple-50",
        badgeClassName: "border-purple-200 bg-purple-100 text-purple-800",
        selectClassName:
            "border-purple-300 bg-purple-50 text-purple-900 focus:border-purple-500 focus:ring-purple-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.panel,
        label: "Panelové diskusie",
        valueLabel: "panel",
        dotClassName: "bg-orange-500",
        itemClassName: "border-orange-200 border-l-orange-500 bg-orange-50",
        badgeClassName: "border-orange-200 bg-orange-100 text-orange-800",
        selectClassName:
            "border-orange-300 bg-orange-50 text-orange-900 focus:border-orange-500 focus:ring-orange-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.break,
        label: "Prestávky",
        valueLabel: "break",
        dotClassName: "bg-gray-400",
        itemClassName: "border-gray-200 border-l-gray-400 bg-gray-50",
        badgeClassName: "border-gray-200 bg-gray-100 text-gray-700",
        selectClassName:
            "border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-500 focus:ring-gray-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.social,
        label: "Spoločenské udalosti",
        valueLabel: "social",
        dotClassName: "bg-pink-500",
        itemClassName: "border-pink-200 border-l-pink-500 bg-pink-50",
        badgeClassName: "border-pink-200 bg-pink-100 text-pink-800",
        selectClassName:
            "border-pink-300 bg-pink-50 text-pink-900 focus:border-pink-500 focus:ring-pink-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.poster,
        label: "Poster sekcia",
        valueLabel: "poster",
        dotClassName: "bg-yellow-500",
        itemClassName: "border-yellow-200 border-l-yellow-500 bg-yellow-50",
        badgeClassName: "border-yellow-200 bg-yellow-100 text-yellow-800",
        selectClassName:
            "border-yellow-300 bg-yellow-50 text-yellow-900 focus:border-yellow-500 focus:ring-yellow-100",
    },
    {
        type: PROGRAM_ITEM_TYPE.closing,
        label: "Ukončenie",
        valueLabel: "closing",
        dotClassName: "bg-red-500",
        itemClassName: "border-red-200 border-l-red-500 bg-red-50",
        badgeClassName: "border-red-200 bg-red-100 text-red-800",
        selectClassName:
            "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-100",
    },
];

export const getProgramLegendItem = (type: ProgramItemType) => {
    return (
        programLegendItems.find((legendItem) => legendItem.type === type) ??
        programLegendItems[0]
    );
};

export const getProgramItemTypeLabel = (type: ProgramItemType) => {
    return getProgramLegendItem(type).valueLabel;
};

export const getProgramItemAdminClassName = (type: ProgramItemType) => {
    return getProgramLegendItem(type).itemClassName;
};

export const getProgramItemBadgeClassName = (type: ProgramItemType) => {
    return getProgramLegendItem(type).badgeClassName;
};

export const getProgramItemSelectClassName = (type: ProgramItemType) => {
    return getProgramLegendItem(type).selectClassName;
};

export const createEmptyCommitteeMemberForm = (): CommitteeMemberForm => ({
    id: 0,
    clientId: createClientId(),
    fullName: "",
    position: "",
    affiliation: "",
    country: "",
    order: "0",
});

export const createEmptyCommitteeRoleForm = (): CommitteeRoleForm => ({
    id: 0,
    clientId: createClientId(),
    name: "",
    order: "0",
    members: [],
});

export const createEmptyCommitteeForm = (): CommitteeForm => ({
    id: 0,
    clientId: createClientId(),
    name: "",
    description: "",
    order: "0",
    roles: [],
});

export const sortCommittees = (committees?: Committee[] | null) =>
    [...(committees ?? [])].sort((left, right) => left.order - right.order);

export const sortCommitteeRoles = (roles?: CommitteeRole[] | null) =>
    [...(roles ?? [])].sort((left, right) => left.order - right.order);

export const sortCommitteeMembers = (members?: CommitteeMember[] | null) =>
    [...(members ?? [])].sort((left, right) => left.order - right.order);

export const mapCommitteesToForm = (
    committees?: Committee[] | null
): CommitteeForm[] => {
    return sortCommittees(committees).map((committee) => ({
        id: committee.id,
        clientId: `committee-${committee.id}`,
        name: committee.name ?? "",
        description: committee.description ?? "",
        order: String(committee.order ?? 0),
        roles: sortCommitteeRoles(committee.roles).map((role) => ({
            id: role.id,
            clientId: `role-${role.id}`,
            name: role.name ?? "",
            order: String(role.order ?? 0),
            members: sortCommitteeMembers(role.members).map((member) => ({
                id: member.id,
                clientId: `member-${member.id}`,
                fullName: member.fullName ?? "",
                position: member.position ?? "",
                affiliation: member.affiliation ?? "",
                country: member.country ?? "",
                order: String(member.order ?? 0),
            })),
        })),
    }));
};

export const parseOrderValue = (value: string) => {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return parsed;
};