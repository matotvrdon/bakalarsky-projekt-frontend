import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { downloadBrowserFile } from "../../utils/publicUtils.ts";

import { FileInfoCard } from "../files/index.ts";
import { PresentationStatusAlert } from "./PresentationStatusAlert.tsx";
import { PresentationUploadBox } from "./PresentationUploadBox.tsx";

type PresentationStatusSectionProps = {
    dashboard: PublicDashboardContext;
};

export function PresentationStatusSection({
                                              dashboard,
                                          }: PresentationStatusSectionProps) {
    return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex items-center gap-2">
                <input
                    id="willPresent"
                    type="checkbox"
                    checked={dashboard.willPresent}
                    disabled={dashboard.isSubmissionStatusLocked}
                    onChange={(event) =>
                        dashboard.setWillPresent(event.target.checked)
                    }
                    className="h-4 w-4"
                />

                <span className="text-sm font-medium text-gray-800">
                    Som prezentér
                </span>
            </label>

            <PresentationStatusAlert
                isSubmissionStatusLocked={dashboard.isSubmissionStatusLocked}
                latestSubmissionFileStatus={dashboard.latestSubmissionFileStatus}
            />

            {dashboard.latestSubmissionFile ? (
                <FileInfoCard
                    title="Aktuálna prezentácia"
                    fileName={dashboard.latestSubmissionFileName}
                    onOpen={() =>
                        window.open(
                            dashboard.getFileViewUrl(
                                dashboard.latestSubmissionFile!.id
                            ),
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                    onDownload={() =>
                        downloadBrowserFile(
                            dashboard.getFileDownloadUrl(
                                dashboard.latestSubmissionFile!.id
                            ),
                            dashboard.latestSubmissionFileName
                        )
                    }
                />
            ) : null}

            <PresentationUploadBox dashboard={dashboard} />
        </div>
    );
}