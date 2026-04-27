import { formatConferenceRange } from "../utils/homeUtils.ts";
import { useActiveConference } from "./useActiveConference.ts";

export function useHomeConference() {
    const {
        activeConference,
        loading,
        error,
    } = useActiveConference();

    const conferenceName =
        activeConference?.name || "Konferencia nie je nastavená";

    const conferenceDescription =
        activeConference?.description || "Popis konferencie zatiaľ nie je nastavený.";

    const conferenceLocation =
        activeConference?.location || "Miesto konania nie je nastavené";

    const conferenceDateRange =
        formatConferenceRange(
            activeConference?.startDate,
            activeConference?.endDate
        ) || "Dátum konferencie nie je nastavený";

    const importantDates =
        activeConference?.settings?.importantDates ?? [];

    console.log("HOME IMPORTANT DATES:", importantDates);

    return {
        activeConference,
        loading,
        error,
        conferenceName,
        conferenceDescription,
        conferenceLocation,
        conferenceDateRange,
        importantDates,
    };
}