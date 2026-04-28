import { BASE_URL } from "./baseApi.ts";

export type SubmissionPayload = {
  id: number;
  participantId: number;
  conferenceId: number;
  submissionIdentifier: string;
  title: string;
  isPresenting: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type UpsertSubmissionPayload = {
  participantId: number;
  conferenceId: number;
  submissionIdentifier: string;
  title: string;
  isPresenting: boolean;
};

type BusinessErrorResponse = {
  code?: string;
  message?: string;
  field?: string | null;
};

type ValidationErrorResponse = {
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
};

export class SubmissionApiError extends Error {
  code?: string;
  field?: string | null;
  status: number;
  validationErrors?: Record<string, string[]>;

  constructor(message: string, status: number, options?: {
    code?: string;
    field?: string | null;
    validationErrors?: Record<string, string[]>;
  }) {
    super(message);
    this.name = "SubmissionApiError";
    this.status = status;
    this.code = options?.code;
    this.field = options?.field;
    this.validationErrors = options?.validationErrors;
  }
}

const isValidationErrorResponse = (value: unknown): value is ValidationErrorResponse =>
  Boolean(value && typeof value === "object" && "errors" in value);

const isBusinessErrorResponse = (value: unknown): value is BusinessErrorResponse =>
  Boolean(value && typeof value === "object" && ("message" in value || "code" in value || "field" in value));

const requestSubmission = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Accept": "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let parsedBody: unknown = null;
    let rawText = "";

    try {
      rawText = await response.text();
      parsedBody = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsedBody = rawText || null;
    }

    if (isValidationErrorResponse(parsedBody) && parsedBody.errors) {
      throw new SubmissionApiError(
        parsedBody.title || "Validation failed",
        response.status,
        { validationErrors: parsedBody.errors }
      );
    }

    if (isBusinessErrorResponse(parsedBody)) {
      throw new SubmissionApiError(
        parsedBody.message || "Request failed",
        response.status,
        {
          code: parsedBody.code,
          field: parsedBody.field ?? null,
        }
      );
    }

    if (typeof parsedBody === "string" && parsedBody.trim()) {
      throw new SubmissionApiError(parsedBody, response.status);
    }

    throw new SubmissionApiError("Request failed", response.status);
  }

  return response.json() as Promise<T>;
};

export const getSubmissionByParticipant = (participantId: number) =>
  requestSubmission<SubmissionPayload>(`/api/submission/by-participant/${participantId}`, {
    method: "GET",
  });

export const createSubmission = (payload: UpsertSubmissionPayload) =>
  requestSubmission<SubmissionPayload>("/api/submission", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateSubmission = (id: number, payload: UpsertSubmissionPayload) =>
  requestSubmission<SubmissionPayload>(`/api/submission/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
