import {
    Clock,
    ClipboardList,
    Eye,
    FileText,
    FolderTree,
    Hotel,
    Pencil,
    Trash2,
    Users,
    UtensilsCrossed,
} from "lucide-react";

import { AdminBadge } from "../base/index.ts";
import type { Conference } from "../../types/adminTypes.ts";
import {
    AdminActionButton,
    AdminEntityCard,
} from "../shared/index.ts";

import { ConferenceStatusValue } from "../../../../api/conferenceApi.ts";

type ConferenceCardProps = {
    conference: Conference;
    onEdit: () => void;
    onDelete: () => void;
    onPreview: () => void;
    onOpenEntries: () => void;
    onOpenImportantDates: () => void;
    onOpenFood: () => void;
    onOpenBooking: () => void;
    onOpenProgram: () => void;
    onOpenCommittees: () => void;
    onOpenSubmissionSettings: () => void;
};

const getConferenceStatusLabel = (status: Conference["status"]) => {
    switch (status) {
        case ConferenceStatusValue.Active:
            return "Aktívna";
        case ConferenceStatusValue.Ended:
            return "Ukončená";
        case ConferenceStatusValue.Preparation:
        default:
            return "Príprava";
    }
};

export function ConferenceCard({
                                   conference,
                                   onEdit,
                                   onDelete,
                                   onPreview,
                                   onOpenEntries,
                                   onOpenImportantDates,
                                   onOpenFood,
                                   onOpenBooking,
                                   onOpenProgram,
                                   onOpenCommittees,
                                   onOpenSubmissionSettings,
                               }: ConferenceCardProps) {
    const dateText = `${conference.startDate} - ${conference.endDate}`;
    const locationText = conference.location ? ` • ${conference.location}` : "";

    const isVisibleForUsers =
        conference.isPublished &&
        conference.status === ConferenceStatusValue.Active;

    return (
        <AdminEntityCard
            title={conference.name}
            subtitle={`${dateText}${locationText}`}
            meta={`${conference.participantsCount} účastníkov`}
            active={isVisibleForUsers}
            badges={
                <div className="flex flex-wrap gap-2">
                    <AdminBadge>{getConferenceStatusLabel(conference.status)}</AdminBadge>

                    {conference.isPublished ? (
                        <AdminBadge>Zverejnená</AdminBadge>
                    ) : (
                        <AdminBadge>Skrytá</AdminBadge>
                    )}
                </div>
            }
            actions={
                <>
                    <AdminActionButton
                        label="Náhľad"
                        icon={Eye}
                        onClick={onPreview}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[130px]"
                    />

                    <AdminActionButton
                        label="Entry"
                        icon={Users}
                        onClick={onOpenEntries}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[130px]"
                    />

                    <AdminActionButton
                        label="Termíny"
                        icon={Clock}
                        onClick={onOpenImportantDates}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[140px]"
                    />

                    <AdminActionButton
                        label="Strava"
                        icon={UtensilsCrossed}
                        onClick={onOpenFood}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[140px]"
                    />

                    <AdminActionButton
                        label="Ubytovanie"
                        icon={Hotel}
                        onClick={onOpenBooking}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[170px]"
                    />

                    <AdminActionButton
                        label="Program"
                        icon={FolderTree}
                        onClick={onOpenProgram}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[150px]"
                    />

                    <AdminActionButton
                        label="Komisie"
                        icon={ClipboardList}
                        onClick={onOpenCommittees}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[150px]"
                    />

                    <AdminActionButton
                        label="Príspevky"
                        icon={FileText}
                        onClick={onOpenSubmissionSettings}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[150px]"
                    />

                    <AdminActionButton
                        label="Upraviť"
                        icon={Pencil}
                        onClick={onEdit}
                        hiddenLabelOnMobile={false}
                        size="md"
                        className="min-w-[140px]"
                    />

                    <AdminActionButton
                        label="Vymazať"
                        icon={Trash2}
                        onClick={onDelete}
                        hiddenLabelOnMobile={false}
                        size="md"
                        variant="outline"
                        className="min-w-[140px] text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                    />
                </>
            }
        />
    );
}