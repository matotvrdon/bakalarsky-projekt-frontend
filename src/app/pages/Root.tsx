import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useActiveConference } from "../hooks/useActiveConference.ts";
import { SiteFooter, SiteHeader, type SiteUser } from "../components/site/site-shell.tsx";

export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SiteUser | null>(null);
  const activeConference = useActiveConference();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
      return;
    }
    setCurrentUser(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const navigation = [
    { name: "Domov", href: "/" },
    { name: "Komisie", href: "/committees" },
    { name: "Program", href: "/schedule" },
    { name: "Príspevky", href: "/submissions" },
    { name: "Registrácia", href: "/register" },
  ];
  const visibleNavigation = currentUser
    ? navigation.filter((item) => item.href !== "/register")
    : navigation;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const conferenceName = activeConference?.name || "Conference.Name";

  return (
    <div className="flex min-h-screen flex-col bg-[#06101d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-12rem] h-80 w-80 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-10rem] top-28 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-300/8 blur-3xl" />
      </div>

      <SiteHeader
        conferenceName={conferenceName}
        navigation={visibleNavigation}
        currentUser={currentUser}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)}
        onLogout={handleLogout}
      />

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <SiteFooter conferenceName={conferenceName} />
    </div>
  );
}
