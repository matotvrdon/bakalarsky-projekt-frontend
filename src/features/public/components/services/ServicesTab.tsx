import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { PublicAlert } from "../base/index.ts";

import { AccommodationSection } from "./AccommodationSection.tsx";
import { CateringSection } from "./CateringSection.tsx";

type ServicesTabProps = {
    dashboard: PublicDashboardContext;
};

export function ServicesTab({
                                dashboard,
                            }: ServicesTabProps) {
    return (
        <div className="space-y-6">
            {dashboard.invoiceGenerated ? (
                <PublicAlert variant="warning">
                    Doplnkové služby sú uzamknuté, pretože faktúra už bola
                    vygenerovaná. Zmeny by zmenili cenu faktúry.
                </PublicAlert>
            ) : null}

            <AccommodationSection dashboard={dashboard} />
            <CateringSection dashboard={dashboard} />
        </div>
    );
}