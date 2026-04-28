import type {
    ConferenceHighlight,
    ConferenceScope,
    ConferenceStat,
    HomeImportantDate,
} from "../types/homeTypes.ts";

export const conferenceHighlights: ConferenceHighlight[] = [
    {
        text: "INFORMATICS prepája výskum, aplikovaný vývoj a akademickú spoluprácu.",
    },
    {
        text: "Program je postavený na krátkych odborných vystúpeniach, diskusii a prezentácii aktuálnych výsledkov.",
    },
    {
        text: "Obsah domovskej stránky je pripravený na napojenie na dáta spravované z admin rozhrania.",
    },
];

export const conferenceScopes: ConferenceScope[] = [
    { name: "Artificial Intelligence and Machine Learning" },
    { name: "Software Engineering and Information Systems" },
    { name: "Computer Networks and Cybersecurity" },
    { name: "Data Science and Knowledge Discovery" },
    { name: "Human-Computer Interaction" },
    { name: "Educational Technologies and Digital Learning" },
];

export const conferenceStats: ConferenceStat[] = [
    {
        title: "40+ Prednášajúcich",
        description: "Renomovaní vedci a odborníci z celého sveta",
        icon: "users",
        tone: "blue",
    },
    {
        title: "100+ Príspevkov",
        description: "Najnovší výskum z rôznych vedeckých oblastí",
        icon: "fileText",
        tone: "green",
    },
    {
        title: "3 Dni programu",
        description: "Prednášky, workshopy a networkingové podujatia",
        icon: "calendar",
        tone: "purple",
    },
];

export const fallbackImportantDates: HomeImportantDate[] = [
    {
        id: 1,
        label: "Uzávierka abstraktov",
        normalDate: "2026-03-01",
        updatedDate: null,
        importantDatesStatus: "Normal",
    },
    {
        id: 2,
        label: "Odovzdanie finálnych príspevkov",
        normalDate: "2026-04-01",
        updatedDate: "2026-04-10",
        importantDatesStatus: "Extended",
    },
    {
        id: 3,
        label: "Early bird registrácia",
        normalDate: "2026-04-15",
        updatedDate: "2026-04-10",
        importantDatesStatus: "Shortened",
    },
];