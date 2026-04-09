import { api } from "./baseApi";

export type Conference = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  participantsCount?: number;
  settings?: ConferenceSettings | null;
};

export type ImportantDateStatus = "Normal" | "Shortened" | "Extended";

export type ImportantDate = {
  id: number;
  label: string;
  normalDate: string;
  updatedDate?: string | null;
  importantDatesStatus: ImportantDateStatus;
};

export type ConferenceSettings = {
  importantDates?: ImportantDate[] | null;
};

export type ConferenceCreatePayload = {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
};

export type ConferenceUpdatePayload = {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive?: boolean;
};

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

export const getAllConferences = () =>
  api<Conference[]>("/api/conference");

export const getActiveConferences = () =>
  api<Conference[]>("/api/conference/active");

export const getConferenceById = (id: number) =>
  api<Conference>(`/api/conference/${id}`);

export const createConference = (data: ConferenceCreatePayload) =>
  api<Conference>("/api/conference", {
    method: "POST",
    json: data
  });

export const updateConference = (id: number, data: ConferenceUpdatePayload) =>
  api<Conference>(`/api/conference/${id}`, {
    method: "PUT",
    json: data
  });

export const createConferenceSettings = (id: number, data: ConferenceSettingsPayload) =>
  api(`/api/conference/${id}/conference-settings`, {
    method: "POST",
    json: data
  });

export const updateConferenceImportantDate = (
  conferenceId: number,
  importantDateId: number,
  data: ImportantDateUpdatePayload
) =>
  api<ImportantDate>(`/api/conference/${conferenceId}/conference-settings/${importantDateId}`, {
    method: "PUT",
    json: data
  });

export const deleteConference = (id: number) =>
  api<void>(`/api/conference/${id}`, {
    method: "DELETE"
  });
