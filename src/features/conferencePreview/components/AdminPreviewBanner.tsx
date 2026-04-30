import { Link } from "react-router";

export function AdminPreviewBanner() {
    return (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
            <div className="container mx-auto flex flex-col gap-3 text-sm text-amber-900 md:flex-row md:items-center md:justify-between">
                <div>
                    <strong>Admin náhľad:</strong>{" "}
                    Táto stránka môže zobrazovať aj nezverejnenú konferenciu.
                </div>

                <Link
                    to="/admin"
                    className="font-semibold text-amber-900 underline underline-offset-4"
                >
                    Späť do administrácie
                </Link>
            </div>
        </div>
    );
}