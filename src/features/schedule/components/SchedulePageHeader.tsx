import { Download } from "lucide-react";

import { formatDate } from "../utils/scheduleUtils.ts";

type SchedulePageHeaderProps = {
    conferenceId?: number;
    conferenceName?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isDownloadingPdf: boolean;
    onDownloadPdf: () => void;
};

export function SchedulePageHeader({
                                       conferenceId,
                                       conferenceName,
                                       startDate,
                                       endDate,
                                       isDownloadingPdf,
                                       onDownloadPdf,
                                   }: SchedulePageHeaderProps) {
    const dateText = `${formatDate(startDate)}${
        endDate ? ` - ${formatDate(endDate)}` : ""
    }`;

    return (
        <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
                Program konferencie
            </h1>

            <p className="text-xl text-gray-600">
                {conferenceName ?? "Conference.Name"}
            </p>

            <p className="mt-1 text-lg text-gray-500">
                {dateText}
            </p>

            {conferenceId ? (
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={onDownloadPdf}
                        disabled={isDownloadingPdf}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Download className="h-4 w-4" />
                        {isDownloadingPdf
                            ? "Sťahujem PDF..."
                            : "Stiahnuť program (PDF)"}
                    </button>
                </div>
            ) : null}
        </div>
    );
}