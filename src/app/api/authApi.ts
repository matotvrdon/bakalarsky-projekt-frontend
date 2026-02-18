import { api } from "./baseApi";

export type RegistrationSimplePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  affiliation?: string;
  country?: string;
  conferenceId?: number;
};

export type RegistrationSimpleResponse = {
  message: string;
  email: string;
  messageStatus: 0 | 1;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  email: string;
  role: number | string;
};

export type LoginResponse = {
  user: LoginUser;
};

export const registerSimple = (data: RegistrationSimplePayload) =>
  api<RegistrationSimpleResponse>("/api/auth/register-simple", {
    method: "POST",
    json: data
  });

export const login = (data: LoginRequest) =>
  api<LoginResponse>("/api/auth/login", {
    method: "POST",
    json: data
  });
