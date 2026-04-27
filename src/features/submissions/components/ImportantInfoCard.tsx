import { AlertCircle } from "lucide-react";

import { importantInfoItems } from "../data/submissionsContent.ts";

import { InfoSidebarCard } from "./InfoSidebarCard.tsx";

export function ImportantInfoCard() {
    return (
        <InfoSidebarCard title="Dôležité informácie" icon={AlertCircle}>
            {importantInfoItems.map((item, index) => (
                <div
                    key={`${item.title ?? "info"}-${index}`}
                    className={item.separated ? "border-t border-gray-100 pt-4" : ""}
                >
                    {item.title ? (
                        <p className="mb-2 font-semibold text-gray-900">
                            {item.title}
                        </p>
                    ) : null}

                    <p className="leading-6">{item.text}</p>
                </div>
            ))}
        </InfoSidebarCard>
    );
}