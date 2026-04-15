import { Link } from "react-router";

type FooterProps = {
  conferenceName: string;
};

export function Footer({ conferenceName }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#050c16]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm text-white/72 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/72">
            Conference Platform
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{conferenceName}</h3>
          <p className="mt-3 max-w-md leading-7 text-white/60">
            Moderné, prehľadné rozhranie postavené nad existujúcim backend API bez zmeny kontraktov.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Navigácia</h4>
          <div className="mt-4 grid gap-3">
            <Link to="/schedule" className="transition-colors hover:text-white">Program</Link>
            <Link to="/submissions" className="transition-colors hover:text-white">Príspevky</Link>
            <Link to="/register" className="transition-colors hover:text-white">Registrácia</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Kontakt</h4>
          <div className="mt-4 grid gap-3 text-white/60">
            <span>martin@mtvrdon.com</span>
            <span>+421 949 344 232</span>
            <span>Bratislava, Slovensko</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

