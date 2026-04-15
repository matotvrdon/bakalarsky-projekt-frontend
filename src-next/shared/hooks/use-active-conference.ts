import { useEffect, useState } from "react";

import { getActiveConferences, type Conference } from "../api/conference-api";

let cachedConference: Conference | null = null;
let pendingRequest: Promise<Conference | null> | null = null;

async function loadActiveConference(): Promise<Conference | null> {
  if (cachedConference) {
    return cachedConference;
  }

  if (!pendingRequest) {
    pendingRequest = getActiveConferences()
      .then((conferences) => {
        cachedConference = conferences[0] ?? null;
        return cachedConference;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}

export function useActiveConference() {
  const [activeConference, setActiveConference] = useState<Conference | null>(cachedConference);
  const [loading, setLoading] = useState(!cachedConference);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const conference = await loadActiveConference();
        if (!cancelled) {
          setActiveConference(conference);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load active conference", error);
          setActiveConference(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return { activeConference, loading };
}

export function resetActiveConferenceCache() {
  cachedConference = null;
  pendingRequest = null;
}
