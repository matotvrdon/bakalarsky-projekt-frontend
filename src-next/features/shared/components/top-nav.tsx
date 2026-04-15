import { Link, useLocation } from "react-router";
import { LogIn, LogOut, Menu, UserCircle, X } from "lucide-react";

import { Button, cn } from "../../../shared/ui";

export type NavItem = {
  label: string;
  to: string;
};

export type ShellUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

type TopNavProps = {
  conferenceName: string;
  navigation: NavItem[];
  currentUser: ShellUser | null;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onLogout: () => void;
};

export function TopNav({
  conferenceName,
  navigation,
  currentUser,
  mobileOpen,
  onToggleMobile,
  onLogout,
}: TopNavProps) {
  const location = useLocation();
  const panelTo = currentUser?.role === "admin" ? "/admin" : "/dashboard";
  const panelLabel = currentUser?.role === "admin" ? "Admin panel" : "Môj panel";

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cyan-200/70">
            Conference Platform
          </p>
          <p className="truncate text-lg font-semibold tracking-tight text-white md:text-xl">
            {conferenceName}
          </p>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "bg-white text-slate-950"
                  : "text-white/75 hover:bg-white/8 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Link to={panelTo}>
                <Button variant="secondary" className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                  <UserCircle data-icon="inline-start" />
                  {panelLabel}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="rounded-full text-white/75 hover:bg-white/8 hover:text-white"
                onClick={onLogout}
              >
                <LogOut data-icon="inline-start" />
                Odhlásiť
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <LogIn data-icon="inline-start" />
                Prihlásiť
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={onToggleMobile}
          className="rounded-full border border-white/10 bg-white/5 p-3 text-white hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-white/10 bg-[#08111f] px-4 py-4 sm:px-6 md:hidden">
          <div className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-medium",
                  isActive(item.to)
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/4 text-white/80 hover:bg-white/10",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

