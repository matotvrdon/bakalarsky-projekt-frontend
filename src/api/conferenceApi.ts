import { api, BASE_URL } from "./baseApi.ts";

export type ConferenceStatus = 0 | 1 | 2;

export const ConferenceStatusValue = {
  Preparation: 0,
  Active: 1,
  Ended: 2,
} as const satisfies Record<string, ConferenceStatus>;

export type Conference = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string | null;
  isPublished: boolean;
  status: ConferenceStatus;
  participantsCount?: number;
  settings?: ConferenceSettings | null;
};

export type ImportantDateStatus = "Normal" | "Shortened" | "Extended";
export type FoodOptionType = 0 | 1 | 2;
export type ProgramItemType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ConferenceEntry = {
  id: number;
  name: string;
  price: number;
};

export type ProgramPresentation = {
  id: number;
  startTime: string;
  endTime: string;
  authors: string;
  title: string;
  order: number;
};

export type ProgramSession = {
  id: number;
  sessionName: string;
  startTime: string;
  endTime: string;
  chair?: string | null;
  order: number;
  presentations?: ProgramPresentation[] | null;
};

export type ProgramItem = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  speaker?: string | null;
  chair?: string | null;
  type: ProgramItemType;
  order: number;
  sessions?: ProgramSession[] | null;
};

export type ProgramDay = {
  id: number;
  label: string;
  date: string;
  order: number;
  programItems?: ProgramItem[] | null;
};

export type ProgramPresentationPayload = {
  startTime: string;
  endTime: string;
  authors: string;
  title: string;
  order: number;
};

export type ProgramSessionPayload = {
  sessionName: string;
  startTime: string;
  endTime: string;
  chair?: string | null;
  order: number;
  presentations: ProgramPresentationPayload[];
};

export type ProgramItemPayload = {
  title: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  speaker?: string | null;
  chair?: string | null;
  type: ProgramItemType;
  order: number;
  sessions: ProgramSessionPayload[];
};

export type ProgramDayPayload = {
  label: string;
  date: string;
  order: number;
  programItems: ProgramItemPayload[];
};

export type ProgramReplacePayload = {
  programDays: ProgramDayPayload[];
};

export type ImportantDate = {
  id: number;
  label: string;
  normalDate: string;
  updatedDate?: string | null;
  importantDatesStatus: ImportantDateStatus;
};

export type ConferenceSettings = {
  conferenceEntries?: ConferenceEntry[] | null;
  importantDates?: ImportantDate[] | null;
  foodOptions?: FoodOption[] | null;
  bookingOptions?: BookingOption[] | null;
  programDays?: ProgramDay[] | null;
};

export type FoodOption = {
  id: number;
  name: string;
  description: string;
  date: string;
  price: number;
  foodOptionsType: FoodOptionType;
};

export type BookingOption = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
};

export type ConferenceCreatePayload = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isPublished: boolean;
  status: ConferenceStatus;
};

export type ConferenceUpdatePayload = ConferenceCreatePayload;

export type ImportantDateCreatePayload = {
  label: string;
  normalDate: string;
};

export type ImportantDateUpdatePayload = {
  label?: string;
  updatedDate: string | null;
};

export type ConferenceSettingsPayload = {
  importantDates: ImportantDateCreatePayload[];
};

export type ConferenceEntryCreatePayload = {
  name: string;
  price: number;
};

export type ConferenceEntryUpdatePayload = ConferenceEntryCreatePayload;

export type ConferenceEntriesSettingsPayload = {
  conferenceEntries: ConferenceEntryCreatePayload[];
};

export type FoodOptionCreatePayload = {
  name: string;
  description: string;
  date: string;
  price: number;
  foodOptionsType: FoodOptionType;
};

export type FoodOptionUpdatePayload = FoodOptionCreatePayload;

export type FoodOptionsSettingsPayload = {
  foodOptions: FoodOptionCreatePayload[];
};

export type BookingOptionCreatePayload = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
};

export type BookingOptionUpdatePayload = BookingOptionCreatePayload;

export type BookingOptionsSettingsPayload = {
  bookingOptions: BookingOptionCreatePayload[];
};

export const getActiveConference = async () => {
  const response = await fetch(`${BASE_URL}/api/conference/active`);

  if (!response.ok) {
    throw new Error("Failed to load active conference");
  }

  return response.json();
};

export const getAllConferences = () =>
    api<Conference[]>("/api/conference");

export const getActiveConferences = () =>
    api<Conference[]>("/api/conference/active");

export const getConferenceById = (id: number) =>
    api<Conference>(`/api/conference/${id}`);

export const getPublicConferenceById = (id: number) =>
    api<Conference>(`/api/conference/public/${id}`);

export const getConferencePreviewById = (id: number) =>
    api<Conference>(`/api/conference/${id}/preview`);

export const downloadConferenceProgramPdf = async (id: number) => {
  const response = await fetch(`${BASE_URL}/api/conference/${id}/program/pdf`, {
    headers: {
      Accept: "application/pdf",
    },
  });

  if (!response.ok) {
    let message = "Program PDF sa nepodarilo stiahnuť.";

    try {
      const text = await response.text();
      message = text || message;
    } catch {
      // ignore text parsing failure
    }

    throw new Error(message);
  }

  const contentDisposition = response.headers.get("Content-Disposition");
  const matchedFileName = contentDisposition?.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i)?.[1];
  const fileName = decodeURIComponent(matchedFileName ?? "program-konferencie.pdf").replaceAll("\"", "");
  const blob = await response.blob();

  return { blob, fileName };
};

export const createConference = (data: ConferenceCreatePayload) =>
    api<Conference>("/api/conference", {
      method: "POST",
      json: data,
    });

export const updateConference = (id: number, data: ConferenceUpdatePayload) =>
    api<Conference>(`/api/conference/${id}`, {
      method: "PUT",
      json: data,
    });

export const createConferenceSettings = (id: number, data: ConferenceSettingsPayload) =>
    api(`/api/conference/${id}/conference-settings`, {
      method: "POST",
      json: data,
    });

export const updateConferenceImportantDate = (
    conferenceId: number,
    importantDateId: number,
    data: ImportantDateUpdatePayload
) =>
    api<ImportantDate>(`/api/conference/${conferenceId}/conference-settings/${importantDateId}`, {
      method: "PUT",
      json: data,
    });

export const deleteConferenceImportantDate = (
    conferenceId: number,
    importantDateId: number
) =>
    api<void>(`/api/conference/${conferenceId}/conference-settings/${importantDateId}`, {
      method: "DELETE",
    });

export const createConferenceEntries = (
    conferenceId: number,
    data: ConferenceEntriesSettingsPayload
) =>
    api(`/api/conference/${conferenceId}/conference-settings/conference-entries`, {
      method: "POST",
      json: data,
    });

export const updateConferenceEntry = (
    conferenceId: number,
    conferenceEntryId: number,
    data: ConferenceEntryUpdatePayload
) =>
    api<ConferenceEntry>(`/api/conference/${conferenceId}/conference-settings/conference-entries/${conferenceEntryId}`, {
      method: "PUT",
      json: data,
    });

export const deleteConferenceEntry = (
    conferenceId: number,
    conferenceEntryId: number
) =>
    api<void>(`/api/conference/${conferenceId}/conference-settings/conference-entries/${conferenceEntryId}`, {
      method: "DELETE",
    });

export const createConferenceFoodOptions = (
    conferenceId: number,
    data: FoodOptionsSettingsPayload
) =>
    api(`/api/conference/${conferenceId}/conference-settings/food-options`, {
      method: "POST",
      json: data,
    });

export const updateConferenceFoodOption = (
    conferenceId: number,
    foodOptionId: number,
    data: FoodOptionUpdatePayload
) =>
    api<FoodOption>(`/api/conference/${conferenceId}/conference-settings/food-options/${foodOptionId}`, {
      method: "PUT",
      json: data,
    });

export const deleteConferenceFoodOption = (
    conferenceId: number,
    foodOptionId: number
) =>
    api<void>(`/api/conference/${conferenceId}/conference-settings/food-options/${foodOptionId}`, {
      method: "DELETE",
    });

export const createConferenceBookingOptions = (
    conferenceId: number,
    data: BookingOptionsSettingsPayload
) =>
    api(`/api/conference/${conferenceId}/conference-settings/booking-options`, {
      method: "POST",
      json: data,
    });

export const updateConferenceBookingOption = (
    conferenceId: number,
    bookingOptionId: number,
    data: BookingOptionUpdatePayload
) =>
    api<BookingOption>(`/api/conference/${conferenceId}/conference-settings/booking-options/${bookingOptionId}`, {
      method: "PUT",
      json: data,
    });

export const deleteConferenceBookingOption = (
    conferenceId: number,
    bookingOptionId: number
) =>
    api<void>(`/api/conference/${conferenceId}/conference-settings/booking-options/${bookingOptionId}`, {
      method: "DELETE",
    });

export const replaceConferenceProgram = (
    conferenceId: number,
    data: ProgramReplacePayload
) =>
    api<ConferenceSettings>(`/api/conference/${conferenceId}/conference-settings/program`, {
      method: "PUT",
      json: data,
    });

export const deleteConference = (id: number) =>
    api<void>(`/api/conference/${id}`, {
      method: "DELETE",
    });