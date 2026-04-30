import { Link } from "react-router";
import { ShieldUser } from "lucide-react";

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
import { useAdminLoginForm } from "../hooks/useAdminLoginForm.ts";

export function AdminLoginCard() {
    const {
        form,
        error,
        loading,
        updateField,
        handleSubmit,
    } = useAdminLoginForm();

    return (
        <AuthCard className="w-full max-w-md">
            <AuthCardHeader className="space-y-1 text-center">
                <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <ShieldUser className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <AuthCardTitle className="text-center text-2xl">
                    Admin prihlásenie
                </AuthCardTitle>

                <AuthCardDescription className="text-center">
                    Táto stránka je určená iba pre administrátora.
                </AuthCardDescription>
            </AuthCardHeader>

            <AuthCardContent>
                <AuthAlert message={error} className="mb-6" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AuthFormField
                        id="admin-email"
                        label="Admin email"
                        type="email"
                        placeholder="admin@conference.sk"
                        value={form.email}
                        onChange={(event) =>
                            updateField("email", event.target.value)
                        }
                        required
                    />

                    <AuthFormField
                        id="admin-password"
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
                        {loading ? "Prihlasovanie..." : "Prihlásiť ako admin"}
                    </AuthButton>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link to="/selection" className="text-blue-600 hover:underline">
                        Späť na výber konferencie
                    </Link>
                </div>
            </AuthCardContent>
        </AuthCard>
    );
}