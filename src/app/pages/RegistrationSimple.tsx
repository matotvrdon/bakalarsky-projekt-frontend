import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { getActiveConferences } from "../api/conferenceApi.ts";
import {
  AuthApiError,
  login as loginRequest,
  registerAccount,
  registerBasic,
  type RegisterAccountResponse,
  type RegisterBasicResponse,
} from "../api/authApi.ts";

type RegistrationStep = "details" | "account" | "complete";
type AccountMode = "create" | "existing";
type DetailsField = "firstName" | "lastName" | "phone" | "affiliation" | "country" | "conferenceId";
type AccountField = "email" | "password" | "confirmPassword" | "participantId";
type FieldErrors = Partial<Record<DetailsField | AccountField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const normalizeFieldKey = (field: string) => {
  if (!field) return field;
  return field.charAt(0).toLowerCase() + field.slice(1);
};

export function Registration() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>("details");
  const [accountMode, setAccountMode] = useState<AccountMode>("create");
  const [basicLoading, setBasicLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [detailsFieldErrors, setDetailsFieldErrors] = useState<FieldErrors>({});
  const [accountFieldErrors, setAccountFieldErrors] = useState<FieldErrors>({});
  const [basicResult, setBasicResult] = useState<RegisterBasicResponse | null>(null);
  const [accountResult, setAccountResult] = useState<RegisterAccountResponse | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    affiliation: "",
    country: "Slovensko",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyApiError = (
    error: unknown,
    allowedFields: Array<DetailsField | AccountField>,
    setFieldErrors: (errors: FieldErrors) => void,
    setGeneralError: (message: string) => void,
  ) => {
    if (!(error instanceof AuthApiError)) {
      setGeneralError(error instanceof Error ? error.message : "Operácia zlyhala");
      return;
    }

    const nextErrors: FieldErrors = {};

    if (error.validationErrors) {
      Object.entries(error.validationErrors).forEach(([key, messages]) => {
        const normalizedKey = normalizeFieldKey(key) as DetailsField | AccountField;
        if (allowedFields.includes(normalizedKey) && messages.length > 0) {
          nextErrors[normalizedKey] = messages[0];
        }
      });
    }

    if (error.field) {
      const normalizedField = normalizeFieldKey(error.field) as DetailsField | AccountField;
      if (allowedFields.includes(normalizedField) && !nextErrors[normalizedField]) {
        nextErrors[normalizedField] = error.message;
      }
    }

    setFieldErrors(nextErrors);

    const hasFieldErrors = Object.keys(nextErrors).length > 0;
    if (!hasFieldErrors) {
      setGeneralError(error.message);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError("");
    setDetailsFieldErrors({});

    const nextErrors: FieldErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = "Meno je povinné.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Priezvisko je povinné.";

    if (Object.keys(nextErrors).length > 0) {
      setDetailsFieldErrors(nextErrors);
      return;
    }

    setBasicLoading(true);
    try {
      const conferences = await getActiveConferences();
      const activeConference = conferences[0];

      if (!activeConference) {
        setDetailsFieldErrors({ conferenceId: "Aktívna konferencia nebola nájdená." });
        return;
      }

      const response = await registerBasic({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        affiliation: formData.affiliation.trim() || null,
        country: formData.country.trim() || null,
        conferenceId: activeConference.id,
      });

      setBasicResult(response);
      localStorage.setItem("pendingRegistrationParticipantId", String(response.participantId));
      setStep("account");
    } catch (error) {
      applyApiError(
        error,
        ["firstName", "lastName", "phone", "affiliation", "country", "conferenceId"],
        setDetailsFieldErrors,
        setDetailsError
      );
    } finally {
      setBasicLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError("");
    setAccountFieldErrors({});

    const nextErrors: FieldErrors = {};
    if (!basicResult?.participantId) nextErrors.participantId = "Participant ID nebol nájdený.";
    if (!formData.email.trim()) nextErrors.email = "Email je povinný.";
    else if (!EMAIL_RE.test(formData.email.trim())) nextErrors.email = "Zadajte platný email.";

    if (!formData.password) nextErrors.password = "Heslo je povinné.";
    else if (accountMode === "create" && !PASSWORD_RE.test(formData.password)) {
      nextErrors.password = "Heslo musí mať aspoň 8 znakov, veľké písmeno, malé písmeno a číslicu.";
    }

    if (accountMode === "create" && !formData.confirmPassword) nextErrors.confirmPassword = "Potvrdenie hesla je povinné.";
    else if (accountMode === "create" && formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Potvrdenie hesla sa musí zhodovať s heslom.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setAccountFieldErrors(nextErrors);
      return;
    }

    setAccountLoading(true);
    try {
      if (accountMode === "existing") {
        const response = await loginRequest({
          email: formData.email.trim(),
          password: formData.password,
          participantId: basicResult!.participantId,
        });

        const apiUser = response.user;
        const roleValue = apiUser.role;
        const roleNormalized =
          typeof roleValue === "number"
            ? (roleValue === 0 ? "admin" : "participant")
            : (roleValue || "participant").toString().toLowerCase();

        const user = {
          id: apiUser.id,
          email: apiUser.email,
          role: roleNormalized,
          name: apiUser.email.split("@")[0],
        };

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.removeItem("pendingRegistrationParticipantId");
        navigate(roleNormalized === "admin" ? "/admin" : "/dashboard");
        return;
      }

      const response = await registerAccount({
        participantId: basicResult!.participantId,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setAccountResult(response);
      localStorage.removeItem("pendingRegistrationParticipantId");
      setStep("complete");
    } catch (error) {
      if (
        accountMode === "existing" &&
        error instanceof AuthApiError &&
        error.status === 401
      ) {
        setAccountError("Nesprávny email alebo heslo.");
        return;
      }

      if (
        accountMode === "create" &&
        error instanceof AuthApiError &&
        error.code === "EMAIL_EXISTS"
      ) {
        setAccountMode("existing");
        setAccountFieldErrors((current) => ({
          ...current,
          email: "Tento email už má účet. Prihláste sa existujúcim heslom."
        }));
        setAccountError("Účet s týmto emailom už existuje. Dokončite registráciu prihlásením.");
        return;
      }

      applyApiError(
        error,
        ["participantId", "email", "password", "confirmPassword"],
        setAccountFieldErrors,
        setAccountError
      );
    } finally {
      setAccountLoading(false);
    }
  };

  const renderFieldError = (message?: string) =>
    message ? <p className="text-sm text-red-600">{message}</p> : null;

  if (step === "complete" && accountResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader className="pb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">Účet bol vytvorený</CardTitle>
              <CardDescription className="text-base">
                Registrácia aj vytvorenie účtu prebehli úspešne.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  {accountResult.message} Prihláste sa emailom <strong>{accountResult.user.email}</strong>.
                </AlertDescription>
              </Alert>

              <div className="rounded-xl border bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Vaše údaje</h3>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
                  <span className="text-gray-600">Meno:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  <span className="text-gray-600">Telefón:</span>
                  <span className="font-medium">{formData.phone || "-"}</span>
                  <span className="text-gray-600">Inštitúcia:</span>
                  <span className="font-medium">{formData.affiliation || "-"}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate("/login")}>
                Prihlásiť sa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "account" && basicResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader className="pb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">Základná registrácia dokončená!</CardTitle>
              <CardDescription className="text-base">
                Pokračujte vytvorením účtu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {accountError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{accountError}</AlertDescription>
                </Alert>
              )}

              {accountFieldErrors.participantId && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{accountFieldErrors.participantId}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-xl border bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Vaše údaje</h3>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
                  <span className="text-gray-600">Meno:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  <span className="text-gray-600">Telefón:</span>
                  <span className="font-medium">{formData.phone || "-"}</span>
                  <span className="text-gray-600">Inštitúcia:</span>
                  <span className="font-medium">{formData.affiliation || "-"}</span>
                </div>
              </div>

              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Ďalší krok</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant={accountMode === "create" ? "default" : "outline"}
                      onClick={() => {
                        setAccountMode("create");
                        setAccountError("");
                        setAccountFieldErrors({});
                      }}
                    >
                      Vytvoriť účet
                    </Button>
                    <Button
                      type="button"
                      variant={accountMode === "existing" ? "default" : "outline"}
                      onClick={() => {
                        setAccountMode("existing");
                        setAccountError("");
                        setAccountFieldErrors({});
                      }}
                    >
                      Účet už mám
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    {accountMode === "create"
                      ? "Vytvorte si účet s emailom a heslom pre prihlásenie do systému."
                      : "Prihláste sa existujúcim účtom a participant sa priradí k aktuálnej konferencii."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      aria-invalid={Boolean(accountFieldErrors.email)}
                      required
                    />
                    {renderFieldError(accountFieldErrors.email)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Heslo *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      aria-invalid={Boolean(accountFieldErrors.password)}
                      required
                    />
                    {renderFieldError(accountFieldErrors.password)}
                  </div>

                  {accountMode === "create" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Potvrdenie hesla *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        aria-invalid={Boolean(accountFieldErrors.confirmPassword)}
                        required
                      />
                      {renderFieldError(accountFieldErrors.confirmPassword)}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={accountLoading}>
                  {accountLoading
                    ? accountMode === "create" ? "Vytváram účet..." : "Prihlasujem..."
                    : accountMode === "create" ? "Vytvoriť účet" : "Prihlásiť sa a pokračovať"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Registrácia na konferenciu</CardTitle>
            <CardDescription className="text-base">
              Vyplňte základné údaje. Prihlasovacie údaje vám budú zaslané emailom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detailsError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{detailsError}</AlertDescription>
              </Alert>
            )}

            {detailsFieldErrors.conferenceId && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{detailsFieldErrors.conferenceId}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Osobné údaje</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Meno *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      aria-invalid={Boolean(detailsFieldErrors.firstName)}
                      required
                    />
                    {renderFieldError(detailsFieldErrors.firstName)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Priezvisko *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      aria-invalid={Boolean(detailsFieldErrors.lastName)}
                      required
                    />
                    {renderFieldError(detailsFieldErrors.lastName)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefón</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+421 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    aria-invalid={Boolean(detailsFieldErrors.phone)}
                  />
                  {renderFieldError(detailsFieldErrors.phone)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Inštitúcia</Label>
                  <Input
                    id="affiliation"
                    placeholder="Názov univerzity alebo inštitúcie"
                    value={formData.affiliation}
                    onChange={(e) => handleChange("affiliation", e.target.value)}
                    aria-invalid={Boolean(detailsFieldErrors.affiliation)}
                  />
                  {renderFieldError(detailsFieldErrors.affiliation)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Krajina</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    aria-invalid={Boolean(detailsFieldErrors.country)}
                  />
                  {renderFieldError(detailsFieldErrors.country)}
                </div>
              </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                  V ďalšom kroku si vytvoríte nový účet alebo sa prihlásite do existujúceho.
              </AlertDescription>
            </Alert>

              <Button type="submit" className="w-full" size="lg" disabled={basicLoading}>
                {basicLoading ? "Pokračujem..." : "Pokračovať"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
