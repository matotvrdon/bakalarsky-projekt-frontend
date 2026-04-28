import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicButton,
    PublicInput,
    PublicLabel,
} from "../base/index.ts";

type StudentProofUploadBoxProps = {
    dashboard: PublicDashboardContext;
};

export function StudentProofUploadBox({
                                          dashboard,
                                      }: StudentProofUploadBoxProps) {
    if (!dashboard.isStudent || dashboard.isStudentStatusLocked) {
        return null;
    }

    return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="space-y-1">
                <PublicLabel htmlFor="studentProofUpload">
                    Doklad o štúdiu
                </PublicLabel>

                <p className="text-sm text-gray-500">
                    Nahrajte PDF alebo obrázok potvrdenia.
                </p>
            </div>

            <PublicInput
                id="studentProofUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(event) =>
                    dashboard.setStudentProofFile(
                        event.target.files?.[0] ?? null
                    )
                }
            />

            {dashboard.studentProofFile ? (
                <p className="text-sm text-gray-600">
                    {dashboard.studentProofFile.name}
                </p>
            ) : null}

            <PublicButton
                type="button"
                className="w-full sm:w-auto"
                onClick={dashboard.handleUploadStudentProof}
                disabled={
                    !dashboard.studentProofFile ||
                    dashboard.uploadingStudentProof
                }
            >
                {dashboard.uploadingStudentProof
                    ? "Odosielam..."
                    : "Odoslať na overenie"}
            </PublicButton>
        </div>
    );
}