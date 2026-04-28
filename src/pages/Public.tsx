import { useState } from "react";

import { usePublicDashboard } from "../features/public/hooks/usePublicDashboard.ts";

import {
    InvoiceTab,
    ParticipationTab,
    PublicHeader,
    PublicSummaryCards,
    PublicTabs,
    ServicesTab,
    SubmissionTab,
} from "../features/public/components/layout";

import type { PublicTabValue } from "../features/public/types/publicTypes.ts";

export function Public() {
    const dashboard = usePublicDashboard();
    const [activeTab, setActiveTab] = useState<PublicTabValue>("participation");

    if (!dashboard.currentUser) {
        return null;
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8">
            <div className="container mx-auto max-w-6xl">
                <PublicHeader currentUser={dashboard.currentUser} />

                <PublicSummaryCards summary={dashboard.summary} />

                <div className="space-y-6">
                    <PublicTabs
                        value={activeTab}
                        onChange={setActiveTab}
                    />

                    {activeTab === "participation" ? (
                        <ParticipationTab dashboard={dashboard} />
                    ) : null}

                    {activeTab === "submission" ? (
                        <SubmissionTab dashboard={dashboard} />
                    ) : null}

                    {activeTab === "services" ? (
                        <ServicesTab dashboard={dashboard} />
                    ) : null}

                    {activeTab === "invoice" ? (
                        <InvoiceTab dashboard={dashboard} />
                    ) : null}
                </div>
            </div>
        </main>
    );
}