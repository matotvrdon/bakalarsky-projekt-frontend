import type {
    RegisterAccountResponse,
    RegisterBasicResponse,
} from "../../../api/authApi.ts";

export type AuthUserRole = "admin" | "participant";

export type StoredAuthUser = {
    id: number;
    email: string;
    role: AuthUserRole;
    name: string;
};

export type LoginForm = {
    email: string;
    password: string;
};

export type RegistrationStep = "details" | "account" | "complete";

export type AccountMode = "create" | "existing";

export type RegistrationForm = {
    firstName: string;
    lastName: string;
    phone: string;
    affiliation: string;
    country: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type DetailsField =
    | "firstName"
    | "lastName"
    | "phone"
    | "affiliation"
    | "country"
    | "conferenceId";

export type AccountField =
    | "email"
    | "password"
    | "confirmPassword"
    | "participantId";

export type AuthFieldErrors = Partial<
    Record<DetailsField | AccountField, string>
>;

export type RegistrationState = {
    step: RegistrationStep;
    accountMode: AccountMode;
    basicLoading: boolean;
    accountLoading: boolean;
    detailsError: string;
    accountError: string;
    detailsFieldErrors: AuthFieldErrors;
    accountFieldErrors: AuthFieldErrors;
    basicResult: RegisterBasicResponse | null;
    accountResult: RegisterAccountResponse | null;
    formData: RegistrationForm;
};