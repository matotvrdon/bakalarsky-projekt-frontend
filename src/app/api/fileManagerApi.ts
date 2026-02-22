import { api } from "./baseApi";

export const uploadParticipantFile = (
  participantId: number,
  fileType: number,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return api<void>(`/api/file-manager/upload/${participantId}/${fileType}`, {
    method: "POST",
    body: formData
  });
};

export const approveFileManager = (fileManagerId: number, email: string) =>
  api<void>(`/api/file-manager/${fileManagerId}/${encodeURIComponent(email)}/approve`, {
    method: "PUT"
  });

export const rejectFileManager = (fileManagerId: number, email: string) =>
  api<void>(`/api/file-manager/${fileManagerId}/${encodeURIComponent(email)}/reject`, {
    method: "PUT"
  });
