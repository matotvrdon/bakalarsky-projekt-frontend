import { BASE_URL, api } from "./baseApi";

export type RegisterBasicPayload = {
  firstName: string;
  lastName: string;
  phone?: string | null;
  affiliation?: string | null;
  country?: string | null;
  conferenceId: number;
};

export type RegisterBasicResponse = {
  participantId: number;
  status: "basic_created";
  message: string;
};

export type RegisterAccountPayload = {
  participantId: number;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterAccountResponse = {
  participantId: number;
  user: {
    id: number;
    email: string;
    role: "Participant" | string;
  };
  message: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  participantId?: number;
};

export type LoginUser = {
  id: number;
  email: string;
  role: number | string;
};

export type LoginResponse = {
  user: LoginUser;
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

export class AuthApiError extends Error {
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
    this.name = "AuthApiError";
    this.status = status;
    this.code = options?.code;
    this.field = options?.field;
    this.validationErrors = options?.validationErrors;
  }
}

const isValidationErrorResponse = (value: unknown): value is ValidationErrorResponse => {
  return Boolean(value && typeof value === "object" && "errors" in value);
};

const isBusinessErrorResponse = (value: unknown): value is BusinessErrorResponse => {
  return Boolean(value && typeof value === "object" && ("message" in value || "code" in value || "field" in value));
};

const postAuth = async <T>(path: string, payload: unknown): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
      throw new AuthApiError(
        parsedBody.title || "Validation failed",
        response.status,
        { validationErrors: parsedBody.errors }
      );
    }

    if (isBusinessErrorResponse(parsedBody)) {
      throw new AuthApiError(
        parsedBody.message || "Request failed",
        response.status,
        {
          code: parsedBody.code,
          field: parsedBody.field ?? null,
        }
      );
    }

    if (typeof parsedBody === "string" && parsedBody.trim()) {
      throw new AuthApiError(parsedBody, response.status);
    }

    throw new AuthApiError("Request failed", response.status);
  }

  return response.json() as Promise<T>;
};

export const registerBasic = (data: RegisterBasicPayload) =>
  postAuth<RegisterBasicResponse>("/api/auth/register-basic", data);

export const registerAccount = (data: RegisterAccountPayload) =>
  postAuth<RegisterAccountResponse>("/api/auth/register-account", data);

export const login = (data: LoginRequest) =>
  postAuth<LoginResponse>("/api/auth/login", data);
