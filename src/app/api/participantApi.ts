import { api } from "./baseApi";

export type ParticipantPayload = {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  affiliation?: string | null;
  country?: string | null;
  registrationType: 0 | 1 | 2;
  studentStatus: 0 | 1 | 2 | 3 | 4;
  userId: number;
  conferenceId: number;
};

export type ParticipantResponse = ParticipantPayload;

export const getParticipantByUserId = (userId: number) =>
  api<ParticipantResponse>(`/api/participant/by-user/${userId}`);

export const updateParticipant = (payload: ParticipantPayload) =>
  api<ParticipantResponse>(`/api/participant`, {
    method: "PUT",
    json: payload
  });
