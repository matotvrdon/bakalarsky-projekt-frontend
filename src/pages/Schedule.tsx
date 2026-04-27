import { useState } from "react";

import { useActiveConference } from "../features/schedule/hooks/useActiveConference.ts";
import { downloadConferenceProgramPdf } from "../app/api/conferenceApi.ts";

import {
    ProgramLegend,
    ScheduleEmptyState,
    SchedulePageHeader,
    ScheduleTabs,
} from "../features/schedule/components/index.ts";

import { sortProgramDays } from "../features/schedule/utils/scheduleUtils.ts";

export function Schedule() {
    const activeConference = useActiveConference();

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
        {}
    );

    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    const programDays = sortProgramDays(activeConference?.settings?.programDays);

    const toggleExpanded = (key: string) => {
        setExpandedItems((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const handleDownloadProgramPdf = async () => {
        if (!activeConference?.id || isDownloadingPdf) {
            return;
        }

        try {
            setIsDownloadingPdf(true);

            const { blob, fileName } = await downloadConferenceProgramPdf(
                activeConference.id
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    return (
        <main className="py-12">
            <div className="container mx-auto px-4">
                <SchedulePageHeader
                    conferenceId={activeConference?.id}
                    conferenceName={activeConference?.name}
                    startDate={activeConference?.startDate}
                    endDate={activeConference?.endDate}
                    isDownloadingPdf={isDownloadingPdf}
                    onDownloadPdf={handleDownloadProgramPdf}
                />

                <ProgramLegend />

                {programDays.length === 0 ? (
                    <ScheduleEmptyState />
                ) : (
                    <ScheduleTabs
                        programDays={programDays}
                        expandedItems={expandedItems}
                        onToggleExpanded={toggleExpanded}
                    />
                )}
            </div>
        </main>
    );
}