import {
    conferenceHighlights,
    conferenceScopes,
    conferenceStats,
} from "../features/home/constants/homeConstants.ts";

import {
    AboutSection,
    ConferenceHero,
    ConferenceStats,
    CtaSection,
} from "../features/home/components/index.ts";

import { useHomeConference } from "../features/home/hooks/useHomeConference.ts";

export function Home() {
    const {
        conferenceName,
        conferenceDescription,
        conferenceLocation,
        conferenceDateRange,
        importantDates,
    } = useHomeConference();

    return (
        <div>
            <ConferenceHero
                conferenceName={conferenceName}
                conferenceDescription={conferenceDescription}
                conferenceDateRange={conferenceDateRange}
                conferenceLocation={conferenceLocation}
                importantDates={importantDates}
            />

            <ConferenceStats stats={conferenceStats} />

            <AboutSection
                highlights={conferenceHighlights}
                scopes={conferenceScopes}
            />

            <CtaSection />
        </div>
    );
}