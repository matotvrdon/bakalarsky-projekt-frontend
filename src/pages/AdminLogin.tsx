import {
    AdminLoginCard,
    AuthPageShell,
} from "../features/auth/components";

export function AdminLogin() {
    return (
        <AuthPageShell maxWidth="sm">
            <div className="flex justify-center">
                <AdminLoginCard />
            </div>
        </AuthPageShell>
    );
}