import { Calendar, FileText, Users } from "lucide-react";

import type { ConferenceStat } from "../types/homeTypes.ts";
import {
    HomeCard,
    HomeCardContent,
} from "./base/index.ts";

type ConferenceStatsProps = {
    stats: ConferenceStat[];
};

const iconMap = {
    users: Users,
    fileText: FileText,
    calendar: Calendar,
};

const toneClassMap = {
    blue: {
        wrapper: "bg-blue-100",
        icon: "text-blue-600",
    },
    green: {
        wrapper: "bg-green-100",
        icon: "text-green-600",
    },
    purple: {
        wrapper: "bg-purple-100",
        icon: "text-purple-600",
    },
};

export function ConferenceStats({ stats }: ConferenceStatsProps) {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {stats.map((stat) => {
                        const Icon = iconMap[stat.icon];
                        const toneClass = toneClassMap[stat.tone];

                        return (
                            <HomeCard key={stat.title}>
                                <HomeCardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${toneClass.wrapper}`}
                                        >
                                            <Icon
                                                className={`h-6 w-6 ${toneClass.icon}`}
                                            />
                                        </div>

                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {stat.title}
                                        </h3>

                                        <p className="text-gray-600">
                                            {stat.description}
                                        </p>
                                    </div>
                                </HomeCardContent>
                            </HomeCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}