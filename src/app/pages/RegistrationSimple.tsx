import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Alert, AlertDescription } from "../components/ui/alert.tsx";
import { CheckCircle2, AlertCircle, Mail, User } from "lucide-react";

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
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate random password
      const password = Math.random().toString(36).slice(-8);

      // Simulate API call to backend
      // In real app: POST to /api/registration with formData
      
      // Simulate email being sent
      await new Promise(resolve => setTimeout(resolve, 1500));

      setGeneratedCredentials({
        email: formData.email,
        password: password,
      });
      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success && generatedCredentials) {
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
              <CardDescription>
                Vaše prihlasovacie údaje boli odoslané na email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Na adresu <strong>{generatedCredentials.email}</strong> bol odoslaný email s prihlasovacími údajmi.
                </AlertDescription>
              </Alert>

              {/*<div className="p-4 bg-gray-50 rounded-lg border">*/}
              {/*  <h3 className="font-semibold mb-3 flex items-center gap-2">*/}
              {/*    <User className="w-5 h-5" />*/}
              {/*    Vaše prihlasovacie údaje*/}
              {/*  </h3>*/}
              {/*  <div className="space-y-2 text-sm">*/}
              {/*    <div className="flex justify-between">*/}
              {/*      <span className="text-gray-600">Email:</span>*/}
              {/*      <span className="font-mono font-semibold">{generatedCredentials.email}</span>*/}
              {/*    </div>*/}
              {/*    <div className="flex justify-between">*/}
              {/*      <span className="text-gray-600">Heslo:</span>*/}
              {/*      <span className="font-mono font-semibold">{generatedCredentials.password}</span>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <p className="text-xs text-gray-500 mt-3">*/}
              {/*    Poznámka: Uložte si tieto údaje. Budete ich potrebovať na prihlásenie.*/}
              {/*  </p>*/}
              {/*</div>*/}

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
