import { AppShell, type NavItem } from "../../shared/components";
import { useActiveConference } from "../../../shared/hooks";

const navigation: NavItem[] = [
  { label: "Domov", to: "/" },
  { label: "Komisie", to: "/committees" },
  { label: "Program", to: "/schedule" },
  { label: "Príspevky", to: "/submissions" },
  { label: "Registrácia", to: "/register" },
];

export function RootPage() {
  const { activeConference } = useActiveConference();

  return (
    <AppShell
      conferenceName={activeConference?.name || "Conference.Name"}
      navigation={navigation}
    />
  );
}
