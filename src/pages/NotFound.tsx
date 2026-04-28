import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">
            404
          </h1>

          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Stránka nebola nájdená
          </h2>

          <p className="mb-8 text-gray-600">
            Ospravedlňujeme sa, ale stránka ktorú hľadáte neexistuje.
          </p>

          <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            Späť na domovskú stránku
          </Link>
        </div>
      </main>
  );
}