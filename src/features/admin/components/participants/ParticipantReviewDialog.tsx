import { Download, ExternalLink } from "lucide-react";

import type { FileManagerPayload } from "../../../../api/participantApi.ts";
import type {
    Participant,
    ParticipantReviewKind,
} from "../../types/adminTypes.ts";

import {
    getFileManagerDownloadUrl,
    getFileManagerViewUrl,
} from "../../../../api/fileManagerApi.ts";

import { AdminButton, AdminDialog } from "../base/index.ts";

type ParticipantReviewDialogProps = {
    participant: Participant | null;
    reviewKind: ParticipantReviewKind | null;
    file: FileManagerPayload | null;
    open: boolean;
    loading: boolean;
    error: string;
    onOpenChange: (open: boolean) => void;
    onApprove: () => Promise<void>;
    onReject: () => Promise<void>;
};

const getDialogTitle = (reviewKind: ParticipantReviewKind | null) => {
    if (reviewKind === "student") {
        return "Kontrola študentského potvrdenia";
    }

    return "Kontrola príspevku";
};

const getFileStatusLabel = (file?: FileManagerPayload | null) => {
    if (!file) {
        return "-";
    }

    if (file.fileStatus === 0 || file.fileStatus === "WaitingForApproval") {
        return "Čaká na potvrdenie";
    }

    if (file.fileStatus === 1 || file.fileStatus === "Approved") {
        return "Schválené";
    }

    if (file.fileStatus === 2 || file.fileStatus === "Rejected") {
        return "Zamietnuté";
    }

    return String(file.fileStatus);
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("sk-SK");
};

export function ParticipantReviewDialog({
                                            participant,
                                            reviewKind,
                                            file,
                                            open,
                                            loading,
                                            error,
                                            onOpenChange,
                                            onApprove,
                                            onReject,
                                        }: ParticipantReviewDialogProps) {
    const viewUrl = file ? getFileManagerViewUrl(file.id) : "";
    const downloadUrl = file ? getFileManagerDownloadUrl(file.id) : "";

    return (
        <AdminDialog
            open={open}
            title={getDialogTitle(reviewKind)}
            description={
                participant
                    ? `${participant.fullName} • ${participant.email || "bez emailu"}`
                    : undefined
            }
            size="lg"
            onOpenChange={onOpenChange}
            footer={
                <>
                    <AdminButton
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Zavrieť
                    </AdminButton>

                    <AdminButton
                        variant="danger"
                        onClick={onReject}
                        disabled={!file || loading}
                    >
                        {loading ? "Ukladám..." : "Zamietnuť"}
                    </AdminButton>

                    <AdminButton
                        variant="primary"
                        onClick={onApprove}
                        disabled={!file || loading}
                    >
                        {loading ? "Ukladám..." : "Schváliť"}
                    </AdminButton>
                </>
            }
        >
            {!participant || !file ? (
                <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                    K tomuto stavu nie je priradený žiadny súbor.
                </div>
            ) : (
                <div className="space-y-5">
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {error}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm md:grid-cols-2">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Účastník
                            </div>
                            <div className="mt-1 font-medium text-gray-900">
                                {participant.fullName}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Email
                            </div>
                            <div className="mt-1 text-gray-900">
                                {participant.email || "-"}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Súbor
                            </div>
                            <div className="mt-1 break-words text-gray-900">
                                {file.originalFileName || file.fileName}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Stav
                            </div>
                            <div className="mt-1 text-gray-900">
                                {getFileStatusLabel(file)}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Odoslané
                            </div>
                            <div className="mt-1 text-gray-900">
                                {formatDateTime(file.createdAt)}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Skontrolované
                            </div>
                            <div className="mt-1 text-gray-900">
                                {formatDateTime(file.reviewedAt)}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <AdminButton
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    viewUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                            icon={<ExternalLink className="h-4 w-4" />}
                        >
                            Otvoriť súbor
                        </AdminButton>

                        <AdminButton
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    downloadUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                            icon={<Download className="h-4 w-4" />}
                        >
                            Stiahnuť súbor
                        </AdminButton>
                    </div>

                    <iframe
                        src={viewUrl}
                        title="Náhľad súboru"
                        className="h-[55vh] w-full rounded-xl border border-gray-200 bg-gray-50"
                    />
                </div>
            )}
        </AdminDialog>
    );
}