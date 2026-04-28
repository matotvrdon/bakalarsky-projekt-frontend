import { useState } from "react";
import { Building2, Receipt, Users } from "lucide-react";

import type { Conference } from "../features/admin/types/adminTypes.ts";

import { useAdminAuth } from "../features/admin/hooks/useAdminAuth.ts";
import { useConferences } from "../features/admin/hooks/useConferences.ts";
import { useInvoices } from "../features/admin/hooks/useInvoices.ts";
import { useParticipants } from "../features/admin/hooks/useParticipants.ts";

import { AdminHeader } from "../features/admin/components/AdminHeader.tsx";
import {
    AdminTabs,
    type AdminTabItem,
} from "../features/admin/components/base/index.ts";

import { CommitteesDialog } from "../features/admin/components/committees/index.ts";
import { ConferencesTab } from "../features/admin/components/conferences/ConferencesTab.tsx";
import { InvoicesTab } from "../features/admin/components/invoices/index.ts";
import { ParticipantsTab } from "../features/admin/components/participants/index.ts";

const adminTabs: AdminTabItem[] = [
    {
        value: "conferences",
        label: "Konferencie",
        shortLabel: "Konf.",
        icon: <Building2 className="h-4 w-4" />,
    },
    {
        value: "participants",
        label: "Účastníci",
        shortLabel: "Účast.",
        icon: <Users className="h-4 w-4" />,
    },
    {
        value: "invoices",
        label: "Faktúry",
        shortLabel: "Fakt.",
        icon: <Receipt className="h-4 w-4" />,
    },
];

export function Admin() {
    const currentUser = useAdminAuth();

    const {
        conferences,
        loadConferences,
        createConferenceHandler,
        updateConferenceHandler,
        deleteConferenceHandler,
    } = useConferences();

    const {
        participants,
        participantsLoading,
        participantsError,
        loadParticipants,
    } = useParticipants();

    const {
        invoices,
        invoicesLoading,
        invoicesError,
        loadInvoices,
        updateInvoiceStatusHandler,
    } = useInvoices();

    const [activeTab, setActiveTab] = useState("conferences");

    const [committeesDialog, setCommitteesDialog] = useState(false);
    const [committeesConference, setCommitteesConference] =
        useState<Conference | null>(null);

    const openCommitteesDialog = (conference: Conference) => {
        setCommitteesConference(conference);
        setCommitteesDialog(true);
    };

    const closeCommitteesDialog = () => {
        setCommitteesDialog(false);
        setCommitteesConference(null);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                <AdminHeader currentUser={currentUser} />

                <div className="space-y-6">
                    <AdminTabs
                        value={activeTab}
                        items={adminTabs}
                        onChange={setActiveTab}
                    />

                    {activeTab === "conferences" && (
                        <ConferencesTab
                            conferences={conferences}
                            onReload={loadConferences}
                            onCreateConference={createConferenceHandler}
                            onUpdateConference={updateConferenceHandler}
                            onDeleteConference={deleteConferenceHandler}
                            onOpenCommittees={openCommitteesDialog}
                        />
                    )}

                    {activeTab === "participants" && (
                        <ParticipantsTab
                            participants={participants}
                            loading={participantsLoading}
                            error={participantsError}
                            reviewerEmail={currentUser.email}
                            onReload={loadParticipants}
                        />
                    )}

                    {activeTab === "invoices" && (
                        <InvoicesTab
                            invoices={invoices}
                            loading={invoicesLoading}
                            error={invoicesError}
                            onReload={loadInvoices}
                            onUpdateStatus={updateInvoiceStatusHandler}
                        />
                    )}
                </div>
            </div>

            <CommitteesDialog
                conference={committeesConference}
                open={committeesDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        closeCommitteesDialog();
                        return;
                    }

                    setCommitteesDialog(true);
                }}
                onSaved={async () => {
                    await loadConferences();
                }}
            />
        </div>
    );
}