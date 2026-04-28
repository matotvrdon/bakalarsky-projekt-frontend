import type {
    ConferenceHighlight,
    ConferenceScope,
} from "../types/homeTypes.ts";

import {
    HomeCard,
    HomeCardContent,
    HomeCardHeader,
    HomeCardTitle,
} from "./base/index.ts";

type AboutSectionProps = {
    highlights: ConferenceHighlight[];
    scopes: ConferenceScope[];
};

export function AboutSection({
                                 highlights,
                                 scopes,
                             }: AboutSectionProps) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-8 max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        O konferencii
                    </h2>

                    <p className="mt-3 text-gray-600">
                        Stručný prehľad podujatia a hlavných tematických okruhov.
                        Tento blok je pripravený tak, aby sa neskôr dal jednoducho
                        spravovať aj z admin rozhrania.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <HomeCard>
                        <HomeCardHeader>
                            <HomeCardTitle>
                                Základné informácie
                            </HomeCardTitle>
                        </HomeCardHeader>

                        <HomeCardContent className="space-y-4">
                            {highlights.map((item, index) => (
                                <div
                                    key={item.text}
                                    className={`flex gap-4 ${
                                        index !== highlights.length - 1
                                            ? "border-b border-gray-100 pb-4"
                                            : ""
                                    }`}
                                >
                                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                        {index + 1}
                                    </div>

                                    <p className="text-gray-600">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </HomeCardContent>
                    </HomeCard>

                    <HomeCard>
                        <HomeCardHeader>
                            <HomeCardTitle>
                                Scopes
                            </HomeCardTitle>
                        </HomeCardHeader>

                        <HomeCardContent>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {scopes.map((scope) => (
                                    <div
                                        key={scope.name}
                                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                                    >
                                        {scope.name}
                                    </div>
                                ))}
                            </div>
                        </HomeCardContent>
                    </HomeCard>
                </div>
            </div>
        </section>
    );
}