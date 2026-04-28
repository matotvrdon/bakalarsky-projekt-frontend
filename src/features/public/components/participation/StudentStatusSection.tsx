import { AlertCircle } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { downloadBrowserFile } from "../../utils/publicUtils.ts";

import {
    PublicAlert,
    PublicLabel,
} from "../base/index.ts";

import { FileInfoCard } from "../files/index.ts";
import { StudentProofUploadBox } from "./StudentProofUploadBox.tsx";
import { StudentStatusAlert } from "./StudentStatusAlert.tsx";

type StudentStatusSectionProps = {
    dashboard: PublicDashboardContext;
};

export function StudentStatusSection({
                                         dashboard,
                                     }: StudentStatusSectionProps) {
    const locked = dashboard.invoiceGenerated;

    return (
        <div className="space-y-3">
            <PublicLabel className="text-base">
                Študentský status
            </PublicLabel>

            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <label
                    className={[
                        "flex items-center gap-2",
                        locked ? "cursor-not-allowed opacity-60" : "",
                    ].join(" ")}
                >
                    <input
                        id="studentStatusDashboard"
                        type="checkbox"
                        checked={dashboard.isStudent}
                        disabled={locked || dashboard.isStudentStatusLocked}
                        onChange={(event) =>
                            dashboard.setIsStudent(event.target.checked)
                        }
                        className="h-4 w-4"
                    />

                    <span className="cursor-pointer text-sm font-medium text-gray-800">
                        Som študent
                    </span>
                </label>

                <p className="text-sm text-gray-600">
                    Študentský status podlieha overeniu administrátorom.
                </p>

                {locked ? (
                    <PublicAlert variant="warning">
                        Účasť je uzamknutá, pretože faktúra už bola
                        vygenerovaná.
                    </PublicAlert>
                ) : null}

                <StudentStatusAlert
                    isStudentStatusLocked={dashboard.isStudentStatusLocked}
                    studentVerificationStatus={
                        dashboard.studentVerificationStatus
                    }
                />

                {dashboard.studentVerificationFile ? (
                    <FileInfoCard
                        title="Aktuálny doklad"
                        fileName={dashboard.studentVerificationFileName}
                        onOpen={() =>
                            window.open(
                                dashboard.getFileViewUrl(
                                    dashboard.studentVerificationFile!.id
                                ),
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                        onDownload={() =>
                            downloadBrowserFile(
                                dashboard.getFileDownloadUrl(
                                    dashboard.studentVerificationFile!.id
                                ),
                                dashboard.studentVerificationFileName
                            )
                        }
                    />
                ) : null}

                {!locked ? (
                    <StudentProofUploadBox dashboard={dashboard} />
                ) : null}
            </div>

            {dashboard.studentUploadError ? (
                <PublicAlert variant="danger" icon={AlertCircle}>
                    {dashboard.studentUploadError}
                </PublicAlert>
            ) : null}

            {dashboard.saveParticipantError ? (
                <PublicAlert variant="danger" icon={AlertCircle}>
                    {dashboard.saveParticipantError}
                </PublicAlert>
            ) : null}
        </div>
    );
}