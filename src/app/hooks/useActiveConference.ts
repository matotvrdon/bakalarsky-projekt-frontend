import { useEffect, useState } from "react";
import { getActiveConferences, type Conference } from "../api/conferenceApi.ts";

export function useActiveConference() {
  const [activeConference, setActiveConference] = useState<Conference | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadActiveConference = async () => {
      try {
        const conferences = await getActiveConferences();
        if (cancelled) return;
        setActiveConference(conferences[0] ?? null);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load active conference", error);
      }
    };

    loadActiveConference();

    return () => {
      cancelled = true;
    };
  }, []);

  return activeConference;
}
