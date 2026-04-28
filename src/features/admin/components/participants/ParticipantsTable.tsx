import type {
    Participant,
    ParticipantReviewKind,
} from "../../types/adminTypes.ts";

import {
    AdminTable,
    AdminTableBody,
    AdminTableCell,
    AdminTableHead,
    AdminTableHeader,
    AdminTableRow,
} from "../base/index.ts";

import { ParticipantInfoCell } from "./ParticipantInfoCell.tsx";
import { ParticipantInvoiceCell } from "./ParticipantInvoiceCell.tsx";
import { ParticipantStatusBadge } from "./ParticipantStatusBadge.tsx";

type ParticipantsTableProps = {
    participants: Participant[];
    onOpenReview: (
        participant: Participant,
        reviewKind: ParticipantReviewKind
    ) => void;
};

export function ParticipantsTable({
                                      participants,
                                      onOpenReview,
                                  }: ParticipantsTableProps) {
    return (
        <AdminTable>
            <AdminTableHeader>
                <AdminTableRow>
                    <AdminTableHead>Meno</AdminTableHead>
                    <AdminTableHead>Email</AdminTableHead>
                    <AdminTableHead>Typ účasti</AdminTableHead>
                    <AdminTableHead>Študentský status</AdminTableHead>
                    <AdminTableHead>Príspevok</AdminTableHead>
                    <AdminTableHead>Faktúra</AdminTableHead>
                </AdminTableRow>
            </AdminTableHeader>

            <AdminTableBody>
                {participants.map((participant) => (
                    <AdminTableRow key={participant.id}>
                        <AdminTableCell>
                            <ParticipantInfoCell participant={participant} />
                        </AdminTableCell>

                        <AdminTableCell>
                            {participant.email || "-"}
                        </AdminTableCell>

                        <AdminTableCell>
                            {participant.participationTypeLabel}
                        </AdminTableCell>

                        <AdminTableCell>
                            <ParticipantStatusBadge
                                variant="student"
                                value={participant.studentStatusLabel}
                                clickable={Boolean(participant.latestStudentFile)}
                                onClick={() =>
                                    onOpenReview(participant, "student")
                                }
                            />
                        </AdminTableCell>

                        <AdminTableCell>
                            <ParticipantStatusBadge
                                variant="submission"
                                value={participant.submissionStatusLabel}
                                clickable={Boolean(
                                    participant.latestSubmissionFile
                                )}
                                onClick={() =>
                                    onOpenReview(participant, "submission")
                                }
                            />
                        </AdminTableCell>

                        <AdminTableCell>
                            <ParticipantInvoiceCell
                                participant={participant}
                            />
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTableBody>
        </AdminTable>
    );
}