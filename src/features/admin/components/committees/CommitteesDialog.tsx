import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
    createCommittee,
    createCommitteeMember,
    createCommitteeRole,
    deleteCommittee,
    deleteCommitteeMember,
    deleteCommitteeRole,
    getConferenceCommittees,
    updateCommittee,
    updateCommitteeMember,
    updateCommitteeRole,
} from "../../../../app/api/committeeApi.ts";

import type {
    CommitteeForm,
    CommitteeMemberForm,
    CommitteeRoleForm,
    Conference,
} from "../../types/adminTypes.ts";

import {
    createEmptyCommitteeForm,
    createEmptyCommitteeMemberForm,
    createEmptyCommitteeRoleForm,
    mapCommitteesToForm,
    parseOrderValue,
} from "../../utils/adminUtils.ts";

import { AdminButton } from "../base/index.ts";
import {
    AdminDialog,
    AdminEmptyState,
    AdminToolbar,
} from "../shared/index.ts";

import { CommitteeEditor } from "./CommitteeEditor.tsx";

type CommitteesDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

export function CommitteesDialog({
                                     conference,
                                     open,
                                     onOpenChange,
                                     onSaved,
                                 }: CommitteesDialogProps) {
    const [committeesForm, setCommitteesForm] = useState<CommitteeForm[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        loadCommittees(conference.id);
    }, [conference, open]);

    const loadCommittees = async (conferenceId: number) => {
        try {
            setLoading(true);

            const result = await getConferenceCommittees(conferenceId);
            const mappedCommittees = mapCommitteesToForm(result.committees);

            const nextExpanded: Record<string, boolean> = {};

            mappedCommittees.forEach((committee) => {
                nextExpanded[`committee-${committee.clientId}`] = true;

                committee.roles.forEach((role) => {
                    nextExpanded[`committee-role-${role.clientId}`] = true;
                });
            });

            setCommitteesForm(mappedCommittees);
            setExpanded(nextExpanded);
        } catch (error) {
            console.error("Failed to load committees", error);
            toast.error("Načítanie komisií zlyhalo.");
            setCommitteesForm([]);
            setExpanded({});
        } finally {
            setLoading(false);
        }
    };

    const closeDialog = () => {
        setCommitteesForm([]);
        setExpanded({});
        onOpenChange(false);
    };

    const toggleExpanded = (key: string) => {
        setExpanded((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const addCommittee = () => {
        const nextCommittee = createEmptyCommitteeForm();

        setCommitteesForm((current) => [...current, nextCommittee]);

        setExpanded((current) => ({
            ...current,
            [`committee-${nextCommittee.clientId}`]: true,
        }));
    };

    const updateCommitteeForm = (
        committeeIndex: number,
        field: keyof CommitteeForm,
        value: string
    ) => {
        setCommitteesForm((current) =>
            current.map((committee, currentIndex) =>
                currentIndex === committeeIndex
                    ? { ...committee, [field]: value }
                    : committee
            )
        );
    };

    const removeCommittee = async (committeeIndex: number) => {
        const committee = committeesForm[committeeIndex];

        if (!committee) {
            return;
        }

        if (committee.id > 0) {
            try {
                setLoading(true);
                await deleteCommittee(committee.id);
                toast.success("Komisia bola odstránená.");
            } catch (error) {
                console.error("Failed to delete committee", error);
                toast.error("Odstránenie komisie zlyhalo.");
                return;
            } finally {
                setLoading(false);
            }
        }

        setCommitteesForm((current) =>
            current.filter((_, currentIndex) => currentIndex !== committeeIndex)
        );
    };

    const addRole = (committeeIndex: number) => {
        const nextRole = createEmptyCommitteeRoleForm();

        setCommitteesForm((current) =>
            current.map((committee, currentIndex) =>
                currentIndex === committeeIndex
                    ? {
                        ...committee,
                        roles: [...committee.roles, nextRole],
                    }
                    : committee
            )
        );

        setExpanded((current) => ({
            ...current,
            [`committee-role-${nextRole.clientId}`]: true,
        }));
    };

    const updateRoleForm = (
        committeeIndex: number,
        roleIndex: number,
        field: keyof CommitteeRoleForm,
        value: string
    ) => {
        setCommitteesForm((current) =>
            current.map((committee, currentCommitteeIndex) =>
                currentCommitteeIndex !== committeeIndex
                    ? committee
                    : {
                        ...committee,
                        roles: committee.roles.map((role, currentRoleIndex) =>
                            currentRoleIndex === roleIndex
                                ? { ...role, [field]: value }
                                : role
                        ),
                    }
            )
        );
    };

    const removeRole = async (committeeIndex: number, roleIndex: number) => {
        const role = committeesForm[committeeIndex]?.roles[roleIndex];

        if (!role) {
            return;
        }

        if (role.id > 0) {
            try {
                setLoading(true);
                await deleteCommitteeRole(role.id);
                toast.success("Rola bola odstránená.");
            } catch (error) {
                console.error("Failed to delete role", error);
                toast.error("Odstránenie role zlyhalo.");
                return;
            } finally {
                setLoading(false);
            }
        }

        setCommitteesForm((current) =>
            current.map((committee, currentCommitteeIndex) =>
                currentCommitteeIndex !== committeeIndex
                    ? committee
                    : {
                        ...committee,
                        roles: committee.roles.filter(
                            (_, currentRoleIndex) =>
                                currentRoleIndex !== roleIndex
                        ),
                    }
            )
        );
    };

    const addMember = (committeeIndex: number, roleIndex: number) => {
        const nextMember = createEmptyCommitteeMemberForm();

        setCommitteesForm((current) =>
            current.map((committee, currentCommitteeIndex) =>
                currentCommitteeIndex !== committeeIndex
                    ? committee
                    : {
                        ...committee,
                        roles: committee.roles.map((role, currentRoleIndex) =>
                            currentRoleIndex !== roleIndex
                                ? role
                                : {
                                    ...role,
                                    members: [...role.members, nextMember],
                                }
                        ),
                    }
            )
        );
    };

    const updateMemberForm = (
        committeeIndex: number,
        roleIndex: number,
        memberIndex: number,
        field: keyof CommitteeMemberForm,
        value: string
    ) => {
        setCommitteesForm((current) =>
            current.map((committee, currentCommitteeIndex) =>
                currentCommitteeIndex !== committeeIndex
                    ? committee
                    : {
                        ...committee,
                        roles: committee.roles.map((role, currentRoleIndex) =>
                            currentRoleIndex !== roleIndex
                                ? role
                                : {
                                    ...role,
                                    members: role.members.map(
                                        (member, currentMemberIndex) =>
                                            currentMemberIndex ===
                                            memberIndex
                                                ? {
                                                    ...member,
                                                    [field]: value,
                                                }
                                                : member
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const removeMember = async (
        committeeIndex: number,
        roleIndex: number,
        memberIndex: number
    ) => {
        const member =
            committeesForm[committeeIndex]?.roles[roleIndex]?.members[
                memberIndex
                ];

        if (!member) {
            return;
        }

        if (member.id > 0) {
            try {
                setLoading(true);
                await deleteCommitteeMember(member.id);
                toast.success("Člen bol odstránený.");
            } catch (error) {
                console.error("Failed to delete member", error);
                toast.error("Odstránenie člena zlyhalo.");
                return;
            } finally {
                setLoading(false);
            }
        }

        setCommitteesForm((current) =>
            current.map((committee, currentCommitteeIndex) =>
                currentCommitteeIndex !== committeeIndex
                    ? committee
                    : {
                        ...committee,
                        roles: committee.roles.map((role, currentRoleIndex) =>
                            currentRoleIndex !== roleIndex
                                ? role
                                : {
                                    ...role,
                                    members: role.members.filter(
                                        (_, currentMemberIndex) =>
                                            currentMemberIndex !==
                                            memberIndex
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const hasInvalidForm = () => {
        return committeesForm.some((committee) => {
            if (!committee.name.trim()) {
                return true;
            }

            return committee.roles.some((role) => {
                if (!role.name.trim()) {
                    return true;
                }

                return role.members.some(
                    (member) => !member.fullName.trim()
                );
            });
        });
    };

    const saveCommittees = async () => {
        if (!conference) {
            return;
        }

        if (hasInvalidForm()) {
            toast.error("Vyplň všetky povinné polia.");
            return;
        }

        try {
            setLoading(true);

            for (const committeeForm of committeesForm) {
                const committeePayload = {
                    name: committeeForm.name.trim(),
                    description: committeeForm.description.trim() || null,
                    order: parseOrderValue(committeeForm.order),
                };

                const savedCommittee =
                    committeeForm.id > 0
                        ? await updateCommittee(
                            committeeForm.id,
                            committeePayload
                        )
                        : await createCommittee(
                            conference.id,
                            committeePayload
                        );

                for (const roleForm of committeeForm.roles) {
                    const rolePayload = {
                        name: roleForm.name.trim(),
                        order: parseOrderValue(roleForm.order),
                    };

                    const savedRole =
                        roleForm.id > 0
                            ? await updateCommitteeRole(
                                roleForm.id,
                                rolePayload
                            )
                            : await createCommitteeRole(
                                savedCommittee.id,
                                rolePayload
                            );

                    for (const memberForm of roleForm.members) {
                        const memberPayload = {
                            fullName: memberForm.fullName.trim(),
                            position: memberForm.position.trim() || null,
                            affiliation:
                                memberForm.affiliation.trim() || null,
                            country: memberForm.country.trim() || null,
                            order: parseOrderValue(memberForm.order),
                        };

                        if (memberForm.id > 0) {
                            await updateCommitteeMember(
                                memberForm.id,
                                memberPayload
                            );
                        } else {
                            await createCommitteeMember(
                                savedRole.id,
                                memberPayload
                            );
                        }
                    }
                }
            }

            toast.success("Komisie boli uložené.");

            await onSaved();

            await loadCommittees(conference.id);
        } catch (error) {
            console.error("Failed to save committees", error);
            toast.error("Uloženie komisií zlyhalo.");
        } finally {
            setLoading(false);
        }
    };

    const hasCommittees = committeesForm.length > 0;

    return (
        <AdminDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    closeDialog();
                    return;
                }

                onOpenChange(nextOpen);
            }}
            title="Správa komisií"
            description={
                conference
                    ? `Komisie pre konferenciu ${conference.name}`
                    : "Správa komisií konferencie"
            }
            size="xl"
            footer={
                <>
                    <AdminButton
                        variant="outline"
                        onClick={closeDialog}
                        disabled={loading}
                    >
                        Zrušiť
                    </AdminButton>

                    <AdminButton
                        onClick={saveCommittees}
                        disabled={loading}
                    >
                        Uložiť komisie
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Spravuj odborné, programové a organizačné komisie konferencie."
                    actions={
                        <AdminButton
                            onClick={addCommittee}
                            icon={<Plus className="h-4 w-4" />}
                            disabled={loading}
                        >
                            Pridať komisiu
                        </AdminButton>
                    }
                />

                {loading && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-600">
                        Načítavam komisie...
                    </div>
                )}

                {!loading && !hasCommittees && (
                    <AdminEmptyState
                        title="Zatiaľ žiadne komisie"
                        description="Pridaj prvú komisiu konferencie."
                        action={
                            <AdminButton
                                onClick={addCommittee}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať komisiu
                            </AdminButton>
                        }
                    />
                )}

                {!loading && hasCommittees && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-5">
                            {committeesForm.map(
                                (committee, committeeIndex) => (
                                    <CommitteeEditor
                                        key={committee.clientId}
                                        committee={committee}
                                        committeeIndex={committeeIndex}
                                        expanded={expanded}
                                        onToggleExpanded={toggleExpanded}
                                        onUpdateCommittee={
                                            updateCommitteeForm
                                        }
                                        onRemoveCommittee={removeCommittee}
                                        onAddRole={addRole}
                                        onUpdateRole={updateRoleForm}
                                        onRemoveRole={removeRole}
                                        onAddMember={addMember}
                                        onUpdateMember={updateMemberForm}
                                        onRemoveMember={removeMember}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Mazanie existujúcich komisií, rolí a členov sa vykoná okamžite.
                    Ostatné zmeny sa uložia až po kliknutí na tlačidlo Uložiť komisie.
                </div>
            </div>
        </AdminDialog>
    );
}