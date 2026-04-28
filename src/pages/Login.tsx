import { LoginCard } from "../features/auth/components";
import { AuthPageShell } from "../features/auth/components";

export function Login() {
    return (
        <AuthPageShell maxWidth="sm">
            <div className="flex justify-center">
                <LoginCard />
            </div>
        </AuthPageShell>
    );
}