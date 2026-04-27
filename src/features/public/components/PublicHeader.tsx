import type { CurrentUser } from "../types/publicTypes.ts";

type PublicHeaderProps = {
    currentUser: CurrentUser;
};

export function PublicHeader({ currentUser }: PublicHeaderProps) {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Vitajte, {currentUser.name}!
            </h1>

            <p className="mt-2 text-gray-600">
                Správa vašej účasti na konferencii
            </p>
        </header>
    );
}