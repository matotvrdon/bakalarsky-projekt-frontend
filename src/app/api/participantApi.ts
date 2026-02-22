import { api } from "./baseApi";

export type FileTypeValue = 0 | 1 | "StudentVerification" | "Submission";
export type FileStatusValue = 0 | 1 | 2 | "WaitingForApproval" | "Approved" | "Rejected";

export type FileManagerPayload = {
  id: number;
  participantId: number;
  fileType: FileTypeValue;
  fileStatus: FileStatusValue;
  filePath: string;
  fileName: string;
  originalFileName: string;
  createdAt: string;
  reviewedAt?: string | null;
  reviewedByUserId?: number | null;
};

export type ParticipantPayload = {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  affiliation?: string | null;
  country?: string | null;
  registrationType: number | null;
  isStudent: boolean;
  fileManagers: FileManagerPayload[];
  userId: number;
  conferenceId: number;
};

export type ParticipantResponse = ParticipantPayload;
export type ParticipantListResponse = ParticipantPayload & {
  user?: {
    email?: string | null;
  } | null;
  createdAt?: string | null;
};

export const getParticipantByUserId = (userId: number) =>
  api<ParticipantResponse>(`/api/participant/by-user/${userId}`);

export const getParticipantsByActiveConference = () =>
  api<ParticipantListResponse[]>(`/api/participant`);

export const updateParticipant = (payload: ParticipantPayload) =>
  api<ParticipantResponse>(`/api/participant`, {
    method: "PUT",
    json: payload
  });
