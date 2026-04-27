import { AdminBadge } from "./base";

type AdminHeaderProps = {
    currentUser: {
        name: string;
        email: string;
    };
};

export function AdminHeader({ currentUser }: AdminHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Admin Panel
                    </h1>

                    <AdminBadge variant="outline" className="text-xs">
            <span className="flex flex-col leading-tight">
              <span>{currentUser.name}</span>
              <span>{currentUser.email}</span>
            </span>
                    </AdminBadge>
                </div>

                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Správa konferencií a účastníkov
                </p>
            </div>
        </div>
    );
}