import { Calendar, MapPin } from "lucide-react";

import type { HomeImportantDate } from "../types/homeTypes.ts";
import { HomeButtonLink } from "./base/index.ts";
import { ImportantDatesPanel } from "./importantDates/index.ts";

type ConferenceHeroProps = {
    conferenceName: string;
    conferenceDescription: string;
    conferenceDateRange: string;
    conferenceLocation: string;
    importantDates: HomeImportantDate[];
};

export function ConferenceHero({
                                   conferenceName,
                                   conferenceDescription,
                                   conferenceDateRange,
                                   conferenceLocation,
                                   importantDates,
                               }: ConferenceHeroProps) {
    return (
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white md:py-32">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                            {conferenceName}
                        </h1>

                        <p className="mb-8 text-xl text-blue-100 md:text-2xl">
                            {conferenceDescription}
                        </p>

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>{conferenceDateRange}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span>{conferenceLocation}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <HomeButtonLink
                                to="/register"
                                size="lg"
                                variant="secondary"
                            >
                                Registrovať sa
                            </HomeButtonLink>

                            <HomeButtonLink
                                to="/schedule"
                                size="lg"
                                variant="outline"
                            >
                                Pozrieť program
                            </HomeButtonLink>
                        </div>
                    </div>

                    <ImportantDatesPanel importantDates={importantDates} />
                </div>
            </div>
        </section>
    );
}