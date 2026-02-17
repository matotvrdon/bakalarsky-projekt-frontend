import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Alert, AlertDescription } from "../components/ui/alert.tsx";
import { LogIn, AlertCircle } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate API call - replace with actual backend call
      // For demo: admin@conference.sk / admin123 is admin
      // Any other email with password from email gets participant role
      
      if (email === "admin@conference.sk" && password === "admin123") {
        const user = {
          email,
          role: "admin",
          name: "Administrator",
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/admin");
      } else {
        // Simulate participant login - in real app, check backend
        const user = {
          email,
          role: "participant",
          name: email.split("@")[0],
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Nesprávny email alebo heslo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Prihlásenie</CardTitle>
          <CardDescription className="text-center">
            Zadajte vaše prihlasovacie údaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vas.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Prihlasovanie..." : "Prihlásiť sa"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Nemáte účet?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Zaregistrujte sa
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-900 font-medium mb-2">Demo prístup:</p>
            <p className="text-xs text-blue-700">
              <strong>Admin:</strong> admin@conference.sk / admin123
            </p>
            <p className="text-xs text-blue-700 mt-1">
              <strong>Účastník:</strong> Použite email a heslo z registračného emailu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
