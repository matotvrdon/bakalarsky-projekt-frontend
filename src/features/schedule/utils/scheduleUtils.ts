import type {
    ProgramDay,
    ProgramItem,
    ProgramItemType,
    ProgramPresentation,
    ProgramSession,
} from "../../../api/conferenceApi.ts";

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
    dotClassName: string;
    itemClassName: string;
};

export const programLegendItems: ProgramLegendItem[] = [
    {
        type: PROGRAM_ITEM_TYPE.registration,
        label: "Registrácia",
        dotClassName: "bg-indigo-500",
        itemClassName: "border-l-indigo-500 bg-indigo-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.opening,
        label: "Otvorenie",
        dotClassName: "bg-lime-600",
        itemClassName: "border-l-lime-600 bg-lime-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.keynote,
        label: "Pozvané prednášky",
        dotClassName: "bg-blue-500",
        itemClassName: "border-l-blue-500 bg-blue-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.parallel,
        label: "Paralelné sekcie",
        dotClassName: "bg-emerald-500",
        itemClassName: "border-l-emerald-500 bg-emerald-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.session,
        label: "Session",
        dotClassName: "bg-green-500",
        itemClassName: "border-l-green-500 bg-green-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.workshop,
        label: "Workshopy",
        dotClassName: "bg-purple-500",
        itemClassName: "border-l-purple-500 bg-purple-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.panel,
        label: "Panelové diskusie",
        dotClassName: "bg-orange-500",
        itemClassName: "border-l-orange-500 bg-orange-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.break,
        label: "Prestávky",
        dotClassName: "bg-gray-400",
        itemClassName: "border-l-gray-400 bg-gray-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.social,
        label: "Spoločenské udalosti",
        dotClassName: "bg-pink-500",
        itemClassName: "border-l-pink-500 bg-pink-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.poster,
        label: "Poster sekcia",
        dotClassName: "bg-yellow-500",
        itemClassName: "border-l-yellow-500 bg-yellow-50",
    },
    {
        type: PROGRAM_ITEM_TYPE.closing,
        label: "Ukončenie",
        dotClassName: "bg-red-500",
        itemClassName: "border-l-red-500 bg-red-50",
    },
];

export const formatDate = (value?: string | null) => {
    if (!value) {
        return "";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
        return value;
    }

    return `${day}.${month}.${year}`;
};

export const formatDayTab = (value?: string | null) => {
    if (!value) {
        return "";
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return formatDate(value);
    }

    return parsedDate.toLocaleDateString("sk-SK", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
    });
};

export const formatTime = (value?: string | null) => {
    if (!value) {
        return "";
    }

    return value.slice(0, 5);
};

export const formatTimeRange = (
    startTime?: string | null,
    endTime?: string | null
) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);

    if (start && end) {
        return `${start} - ${end}`;
    }

    return start || end || "";
};

export const getProgramItemClassName = (type: ProgramItemType) => {
    const legendItem = programLegendItems.find((item) => item.type === type);

    return legendItem?.itemClassName ?? "border-l-gray-300 bg-gray-50";
};

export const sortPresentations = (
    presentations?: ProgramPresentation[] | null
) => [...(presentations ?? [])].sort((left, right) => left.order - right.order);

export const sortSessions = (sessions?: ProgramSession[] | null) =>
    [...(sessions ?? [])].sort((left, right) => left.order - right.order);

export const sortProgramItems = (items?: ProgramItem[] | null) =>
    [...(items ?? [])].sort((left, right) => left.order - right.order);

export const sortProgramDays = (days?: ProgramDay[] | null) =>
    [...(days ?? [])].sort((left, right) => left.order - right.order);