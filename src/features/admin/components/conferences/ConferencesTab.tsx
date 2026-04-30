import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import type {
    Conference,
    ConferenceStatus,
} from "../../types/adminTypes.ts";

import {
    AdminActionButton,
    AdminEmptyState,
    AdminSectionCard,
} from "../shared/index.ts";

import { ConferenceCard } from "./ConferenceCard.tsx";
import { CreateConferenceDialog } from "./CreateConferenceDialog.tsx";
import { EditConferenceDialog } from "./EditConferenceDialog.tsx";
import { DeleteConferenceDialog } from "./DeleteConferenceDialog.tsx";

import { ImportantDatesDialog } from "../importantDates/ImportantDatesDialog.tsx";
import { ConferenceEntriesDialog } from "../entries/ConferenceEntriesDialog.tsx";
import { FoodOptionsDialog } from "../food/FoodOptionsDialog.tsx";
import { BookingOptionsDialog } from "../booking/BookingOptionsDialog.tsx";
import { ProgramDialog } from "../program/ProgramDialog.tsx";
import { SubmissionSettingsDialog } from "../submissionSettings/index.ts";

type ConferencesTabProps = {
    conferences: Conference[];
    onReload: () => Promise<void>;
    onCreateConference: (input: {
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        location: string;
        isPublished: boolean;
        status: ConferenceStatus;
    }) => Promise<void>;
    onUpdateConference: (
        id: number,
        input: {
            name: string;
            description: string;
            startDate: string;
            endDate: string;
            location: string;
            isPublished: boolean;
            status: ConferenceStatus;
        }
    ) => Promise<void>;
    onDeleteConference: (id: number) => Promise<void>;
    onOpenCommittees: (conference: Conference) => void;
};

export function ConferencesTab({
                                   conferences,
                                   onReload,
                                   onCreateConference,
                                   onUpdateConference,
                                   onDeleteConference,
                                   onOpenCommittees,
                               }: ConferencesTabProps) {
    const navigate = useNavigate();

    const [createOpen, setCreateOpen] = useState(false);
    const [editConference, setEditConference] = useState<Conference | null>(null);
    const [deleteConferenceId, setDeleteConferenceId] = useState<number | null>(null);

    const [importantDatesConference, setImportantDatesConference] =
        useState<Conference | null>(null);

    const [entriesConference, setEntriesConference] =
        useState<Conference | null>(null);

    const [foodConference, setFoodConference] =
        useState<Conference | null>(null);

    const [bookingConference, setBookingConference] =
        useState<Conference | null>(null);

    const [programConference, setProgramConference] =
        useState<Conference | null>(null);

    const [submissionSettingsConference, setSubmissionSettingsConference] =
        useState<Conference | null>(null);

    const openPreview = (conferenceId: number) => {
        navigate(`/admin/conferences/${conferenceId}/preview`);
    };

    return (
        <>
            <AdminSectionCard
                title="Správa konferencií"
                description="Vytvorte a spravujte viac konferencií naraz"
                action={
                    <AdminActionButton
                        label="Nová konferencia"
                        icon={Plus}
                        variant="primary"
                        size="md"
                        hiddenLabelOnMobile={false}
                        onClick={() => setCreateOpen(true)}
                    />
                }
            >
                {conferences.length === 0 ? (
                    <AdminEmptyState
                        title="Zatiaľ nie sú vytvorené žiadne konferencie"
                        description="Vytvor prvú konferenciu a potom k nej pridaj termíny, entry, stravu, ubytovanie, program, komisie a nastavenia príspevkov."
                        action={
                            <AdminActionButton
                                label="Vytvoriť konferenciu"
                                icon={Plus}
                                variant="primary"
                                hiddenLabelOnMobile={false}
                                onClick={() => setCreateOpen(true)}
                            />
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {conferences.map((conference) => (
                            <ConferenceCard
                                key={conference.id}
                                conference={conference}
                                onEdit={() => setEditConference(conference)}
                                onDelete={() => setDeleteConferenceId(conference.id)}
                                onPreview={() => openPreview(conference.id)}
                                onOpenEntries={() => setEntriesConference(conference)}
                                onOpenImportantDates={() =>
                                    setImportantDatesConference(conference)
                                }
                                onOpenFood={() => setFoodConference(conference)}
                                onOpenBooking={() => setBookingConference(conference)}
                                onOpenProgram={() => setProgramConference(conference)}
                                onOpenCommittees={() => onOpenCommittees(conference)}
                                onOpenSubmissionSettings={() =>
                                    setSubmissionSettingsConference(conference)
                                }
                            />
                        ))}
                    </div>
                )}
            </AdminSectionCard>

            <CreateConferenceDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreate={onCreateConference}
            />

            <EditConferenceDialog
                conference={editConference}
                open={editConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditConference(null);
                    }
                }}
                onUpdate={onUpdateConference}
            />

            <DeleteConferenceDialog
                conferenceId={deleteConferenceId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteConferenceId(null);
                    }
                }}
                onDelete={async (id) => {
                    await onDeleteConference(id);
                    setDeleteConferenceId(null);
                }}
            />

            <ImportantDatesDialog
                conference={importantDatesConference}
                open={importantDatesConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setImportantDatesConference(null);
                    }
                }}
                onSaved={onReload}
            />

            <ConferenceEntriesDialog
                conference={entriesConference}
                open={entriesConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEntriesConference(null);
                    }
                }}
                onSaved={onReload}
            />

            <FoodOptionsDialog
                conference={foodConference}
                open={foodConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setFoodConference(null);
                    }
                }}
                onSaved={onReload}
            />

            <BookingOptionsDialog
                conference={bookingConference}
                open={bookingConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setBookingConference(null);
                    }
                }}
                onSaved={onReload}
            />

            <ProgramDialog
                conference={programConference}
                open={programConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setProgramConference(null);
                    }
                }}
                onSaved={onReload}
            />

            <SubmissionSettingsDialog
                conference={submissionSettingsConference}
                open={submissionSettingsConference !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSubmissionSettingsConference(null);
                    }
                }}
                onSaved={onReload}
            />
        </>
    );
}