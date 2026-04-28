import { useState } from "react";
import { RefreshCw } from "lucide-react";

import {
    approveFileManager,
    rejectFileManager,
} from "../../../../api/fileManagerApi.ts";

import type { FileManagerPayload } from "../../../../api/participantApi.ts";
import type {
    Participant,
    ParticipantReviewKind,
} from "../../types/adminTypes.ts";

import {
    AdminActionButton,
    AdminEmptyState,
    AdminSectionCard,
} from "../shared/index.ts";

import { ParticipantReviewDialog } from "./ParticipantReviewDialog.tsx";
import { ParticipantsErrorBox } from "./ParticipantsErrorBox.tsx";
import { ParticipantsLoadingState } from "./ParticipantsLoadingState.tsx";
import { ParticipantsTable } from "./ParticipantsTable.tsx";

type ParticipantsTabProps = {
    participants: Participant[];
    loading: boolean;
    error: string;
    reviewerEmail: string;
    onReload: () => Promise<Participant[]>;
};

const getReviewFile = (
    participant: Participant | null,
    reviewKind: ParticipantReviewKind | null
): FileManagerPayload | null => {
    if (!participant || !reviewKind) {
        return null;
    }

    if (reviewKind === "student") {
        return participant.latestStudentFile;
    }

    return participant.latestSubmissionFile;
};

export function ParticipantsTab({
                                    participants,
                                    loading,
                                    error,
                                    reviewerEmail,
                                    onReload,
                                }: ParticipantsTabProps) {
    const [reviewParticipant, setReviewParticipant] =
        useState<Participant | null>(null);

    const [reviewKind, setReviewKind] =
        useState<ParticipantReviewKind | null>(null);

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const reviewFile = getReviewFile(reviewParticipant, reviewKind);

    const openReviewDialog = (
        participant: Participant,
        nextReviewKind: ParticipantReviewKind
    ) => {
        setReviewParticipant(participant);
        setReviewKind(nextReviewKind);
        setReviewError("");
    };

    const closeReviewDialog = () => {
        if (reviewLoading) {
            return;
        }

        setReviewParticipant(null);
        setReviewKind(null);
        setReviewError("");
    };

    const approveSelectedFile = async () => {
        if (!reviewFile) {
            setReviewError("Súbor nebol nájdený.");
            return;
        }

        try {
            setReviewLoading(true);
            setReviewError("");

            await approveFileManager(reviewFile.id, reviewerEmail);
            await onReload();

            closeReviewDialog();
        } catch (error) {
            setReviewError(
                error instanceof Error
                    ? error.message
                    : "Schválenie súboru zlyhalo."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    const rejectSelectedFile = async () => {
        if (!reviewFile) {
            setReviewError("Súbor nebol nájdený.");
            return;
        }

        try {
            setReviewLoading(true);
            setReviewError("");

            await rejectFileManager(reviewFile.id, reviewerEmail);
            await onReload();

            closeReviewDialog();
        } catch (error) {
            setReviewError(
                error instanceof Error
                    ? error.message
                    : "Zamietnutie súboru zlyhalo."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <>
            <AdminSectionCard
                title="Účastníci"
                description="Prehľad registrovaných účastníkov aktívnej konferencie"
                action={
                    <AdminActionButton
                        label={loading ? "Načítavam..." : "Obnoviť"}
                        icon={RefreshCw}
                        variant="outline"
                        size="md"
                        disabled={loading}
                        hiddenLabelOnMobile={false}
                        onClick={onReload}
                    />
                }
            >
                <div className="space-y-4">
                    {error ? <ParticipantsErrorBox message={error} /> : null}

                    {loading ? <ParticipantsLoadingState /> : null}

                    {!loading && participants.length === 0 ? (
                        <AdminEmptyState
                            title="Žiadni účastníci"
                            description="Pre aktívnu konferenciu zatiaľ nie sú registrovaní žiadni účastníci."
                        />
                    ) : null}

                    {!loading && participants.length > 0 ? (
                        <ParticipantsTable
                            participants={participants}
                            onOpenReview={openReviewDialog}
                        />
                    ) : null}
                </div>
            </AdminSectionCard>

            <ParticipantReviewDialog
                participant={reviewParticipant}
                reviewKind={reviewKind}
                file={reviewFile}
                open={Boolean(reviewParticipant && reviewKind)}
                loading={reviewLoading}
                error={reviewError}
                onOpenChange={(open) => {
                    if (!open) {
                        closeReviewDialog();
                    }
                }}
                onApprove={approveSelectedFile}
                onReject={rejectSelectedFile}
            />
        </>
    );
}