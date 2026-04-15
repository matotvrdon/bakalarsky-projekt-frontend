import { Link } from "react-router";
import { Compass } from "lucide-react";

import { Button } from "../../../shared/ui";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60svh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/72">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
          Stránka neexistuje
        </h1>
        <p className="mt-5 text-lg leading-8 text-white/70">
          Odkaz, ktorý ste otvorili, je neplatný alebo už neexistuje.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/">
            <Button className="h-12 rounded-full bg-cyan-300 px-7 text-slate-950 hover:bg-cyan-200">
              <Compass data-icon="inline-start" />
              Späť na domovskú stránku
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
