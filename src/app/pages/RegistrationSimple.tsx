import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Alert, AlertDescription } from "../components/ui/alert.tsx";
import { CheckCircle2, AlertCircle, Mail, User } from "lucide-react";
import { getActiveConferences } from "../api/conferenceApi.ts";
import { registerSimple } from "../api/authApi.ts";

export function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    affiliation: "",
    country: "Slovensko",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [registrationResult, setRegistrationResult] = useState<{
    email: string;
    message: string;
    messageStatus: 0 | 1;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const conferences = await getActiveConferences();
      const activeConference = conferences[0];
      if (!activeConference) {
        throw new Error("Aktívna konferencia nebola nájdená.");
      }

      const response = await registerSimple({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        affiliation: formData.affiliation || undefined,
        country: formData.country || undefined,
        conferenceId: activeConference.id
      });

      const messageStatus =
        "messageStatus" in response
          ? response.messageStatus
          : ("messageStutus" in response ? (response as any).messageStutus : 1);

      if (messageStatus === 0) {
        setRegistrationResult(null);
        setError(response.message);
        setSuccess(false);
        return;
      }

      setRegistrationResult({
        email: response.email,
        message: response.message,
        messageStatus: 1,
      });
      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      const rawMessage = error instanceof Error ? error.message : "Registrácia zlyhala";
      let resolvedMessage = rawMessage;
      try {
        const parsed = JSON.parse(rawMessage);
        if (parsed && typeof parsed.message === "string") {
          resolvedMessage = parsed.message;
        }
      } catch { }
      setError(resolvedMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success && registrationResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Registrácia úspešná!</CardTitle>
            </CardHeader>
        <CardContent className="space-y-6">
          {registrationResult?.message && (
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                {registrationResult.message} {registrationResult.email}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-3">
            <h4 className="font-semibold">Ďalšie kroky:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Prihláste sa pomocou emailu a hesla</li>
                  <li>Vyplňte údaje o vašej účasti (typ účasti, ubytovanie, strava)</li>
                  <li>Vygenerujte si faktúru</li>
                  <li>Zaplaťte faktúru podľa pokynov</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => navigate("/login")} className="flex-1">
                  Prihlásiť sa teraz
                </Button>
                <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                  Späť na domov
                </Button>
              </div>
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
            <CardTitle className="text-2xl">Registrácia na konferenciu</CardTitle>
            <CardDescription>
              Vyplňte základné údaje. Prihlasovacie údaje vám budú zaslané emailom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Osobné údaje</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Meno *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Priezvisko *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Na tento email vám budú zaslané prihlasovacie údaje
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefón</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+421 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Inštitúcia</Label>
                  <Input
                    id="affiliation"
                    placeholder="Názov univerzity alebo inštitúcie"
                    value={formData.affiliation}
                    onChange={(e) => handleChange("affiliation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Krajina</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900 text-sm">
                  Po odoslaní formulára vám na email príde automaticky vygenerované heslo.
                  Následne sa budete môcť prihlásiť a dokončiť svoju registráciu (vybrať typ účasti, ubytovanie, stravu a vygenerovať faktúru).
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Spracovávam..." : "Zaregistrovať sa"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
