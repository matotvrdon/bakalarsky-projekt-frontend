import { Link } from "react-router";
import { LogIn } from "lucide-react";

import {
    AuthAlert,
    AuthButton,
    AuthCard,
    AuthCardContent,
    AuthCardDescription,
    AuthCardHeader,
    AuthCardTitle,
} from "./base/index.ts";

import { AuthFormField } from "./AuthFormField.tsx";
import { useLoginForm } from "../hooks/useLoginForm.ts";

export function LoginCard() {
    const {
        form,
        error,
        loading,
        updateField,
        handleSubmit,
    } = useLoginForm();

    return (
        <AuthCard className="w-full max-w-md">
            <AuthCardHeader className="space-y-1 text-center">
                <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <LogIn className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <AuthCardTitle className="text-center text-2xl">
                    Prihlásenie
                </AuthCardTitle>

                <AuthCardDescription className="text-center">
                    Zadajte vaše prihlasovacie údaje
                </AuthCardDescription>
            </AuthCardHeader>

            <AuthCardContent>
                <AuthAlert message={error} className="mb-6" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AuthFormField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="vas.email@example.com"
                        value={form.email}
                        onChange={(event) =>
                            updateField("email", event.target.value)
                        }
                        required
                    />

                    <AuthFormField
                        id="password"
                        label="Heslo"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(event) =>
                            updateField("password", event.target.value)
                        }
                        required
                    />

                    <AuthButton type="submit" className="w-full" disabled={loading}>
                        {loading ? "Prihlasovanie..." : "Prihlásiť sa"}
                    </AuthButton>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Nemáte účet?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Zaregistrujte sa
                        </Link>
                    </p>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                    <p className="mb-2 text-xs font-medium text-blue-900">
                        Demo prístup:
                    </p>

                    <p className="text-xs text-blue-700">
                        <strong>Admin:</strong> admin@conference.sk / admin123
                    </p>

                    <p className="mt-1 text-xs text-blue-700">
                        <strong>Účastník:</strong> Použite email a heslo z registračného emailu
                    </p>
                </div>
            </AuthCardContent>
        </AuthCard>
    );
}