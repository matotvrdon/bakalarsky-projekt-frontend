import { Link } from "react-router";
import { Button } from "../components/ui/button.tsx";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Stránka nebola nájdená</h2>
        <p className="text-gray-600 mb-8">
          Ospravedlňujeme sa, ale stránka ktorú hľadáte neexistuje.
        </p>
        <Link to="/">
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Späť na domovskú stránku
          </Button>
        </Link>
      </div>
    </div>
  );
}
