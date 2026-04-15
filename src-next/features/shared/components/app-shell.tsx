import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { Footer } from "./footer";
import { type NavItem, type ShellUser, TopNav } from "./top-nav";

type AppShellProps = {
  conferenceName: string;
  navigation: NavItem[];
};

export function AppShell({ conferenceName, navigation }: AppShellProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<ShellUser | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");
    setCurrentUser(rawUser ? JSON.parse(rawUser) : null);
  }, [location]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#06101d] text-white">
      <TopNav
        conferenceName={conferenceName}
        navigation={currentUser ? navigation.filter((item) => item.to !== "/register") : navigation}
        currentUser={currentUser}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((value) => !value)}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer conferenceName={conferenceName} />
    </div>
  );
}

