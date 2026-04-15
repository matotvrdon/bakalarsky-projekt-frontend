import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { LogIn, LogOut, Menu, UserCircle, X } from "lucide-react";
import { Button } from "../ui/button.tsx";

export type SiteNavigationItem = {
  name: string;
  href: string;
};

export type SiteUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

type SiteHeaderProps = {
  conferenceName: string;
  navigation: SiteNavigationItem[];
  currentUser: SiteUser | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
};

export function SiteHeader({
  conferenceName,
  navigation,
  currentUser,
  mobileMenuOpen,
  onToggleMobileMenu,
  onLogout,
}: SiteHeaderProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const panelHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";
  const panelLabel = currentUser?.role === "admin" ? "Admin panel" : "Môj panel";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="min-w-0">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-cyan-200/72">
            Conference platform
          </div>
          <div className="truncate text-lg font-semibold tracking-tight text-white md:text-xl">
            {conferenceName}
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-white text-slate-950"
                  : "text-white/74 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Link to={panelHref}>
                <Button variant="secondary" className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                  <UserCircle className="size-4" />
                  {panelLabel}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="rounded-full text-white/72 hover:bg-white/8 hover:text-white"
                onClick={onLogout}
              >
                <LogOut className="size-4" />
                Odhlásiť
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <LogIn className="size-4" />
                Prihlásiť
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={onToggleMobileMenu}
          className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition-colors hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="border-t border-white/10 bg-[#07111f] md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/4 text-white/80 hover:bg-white/8"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-3 grid gap-2 border-t border-white/10 pt-4">
              {currentUser ? (
                <>
                  <Link to={panelHref}>
                    <Button variant="secondary" className="w-full rounded-full bg-white text-slate-950 hover:bg-white/90">
                      <UserCircle className="size-4" />
                      {panelLabel}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full rounded-full text-white/72 hover:bg-white/8 hover:text-white"
                    onClick={onLogout}
                  >
                    <LogOut className="size-4" />
                    Odhlásiť
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="w-full rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                    <LogIn className="size-4" />
                    Prihlásiť
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}

type SiteFooterProps = {
  conferenceName: string;
};

export function SiteFooter({ conferenceName }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#050c16]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm text-white/72 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200/72">Conference platform</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{conferenceName}</h3>
          <p className="mt-3 max-w-md leading-7 text-white/60">
            Kompaktné rozhranie pre konferenciu, registráciu, správu príspevkov a publikovanie programu nad existujúcim backend API.
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

      <div className="border-t border-white/8 px-4 py-4 text-center text-xs uppercase tracking-[0.28em] text-white/38 sm:px-6 lg:px-8">
        {conferenceName} © 2026
      </div>
    </footer>
  );
}
