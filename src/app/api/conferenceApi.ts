import { api } from "./baseApi";

export type Conference = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  participantsCount?: number;
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

export const deleteConference = (id: number) =>
  api<void>(`/api/conference/${id}`, {
    method: "DELETE"
  });
