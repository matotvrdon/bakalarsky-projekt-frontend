import { Plus, Trash2 } from "lucide-react";

import type {
    CommitteeForm,
    CommitteeMemberForm,
    CommitteeRoleForm,
} from "../../types/adminTypes.ts";

import { AdminButton, AdminInput, AdminTextarea } from "../base/index.ts";
import {
    AdminCollapsiblePanel,
    AdminFormField,
    AdminIconButton,
} from "../shared/index.ts";

import { CommitteeRoleEditor } from "./CommitteeRoleEditor.tsx";

type CommitteeEditorProps = {
    committee: CommitteeForm;
    committeeIndex: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
    onUpdateCommittee: (
        committeeIndex: number,
        field: keyof CommitteeForm,
        value: string
    ) => void;
    onRemoveCommittee: (committeeIndex: number) => void;
    onAddRole: (committeeIndex: number) => void;
    onUpdateRole: (
        committeeIndex: number,
        roleIndex: number,
        field: keyof CommitteeRoleForm,
        value: string
    ) => void;
    onRemoveRole: (committeeIndex: number, roleIndex: number) => void;
    onAddMember: (committeeIndex: number, roleIndex: number) => void;
    onUpdateMember: (
        committeeIndex: number,
        roleIndex: number,
        memberIndex: number,
        field: keyof CommitteeMemberForm,
        value: string
    ) => void;
    onRemoveMember: (
        committeeIndex: number,
        roleIndex: number,
        memberIndex: number
    ) => void;
};

export function CommitteeEditor({
                                    committee,
                                    committeeIndex,
                                    expanded,
                                    onToggleExpanded,
                                    onUpdateCommittee,
                                    onRemoveCommittee,
                                    onAddRole,
                                    onUpdateRole,
                                    onRemoveRole,
                                    onAddMember,
                                    onUpdateMember,
                                    onRemoveMember,
                                }: CommitteeEditorProps) {
    const expandedKey = `committee-${committee.clientId}`;
    const isExpanded = expanded[expandedKey] ?? true;

    return (
        <AdminCollapsiblePanel
            title={committee.name || `Komisia ${committeeIndex + 1}`}
            subtitle={`${committee.roles.length} rolí`}
            expanded={isExpanded}
            onToggle={() => onToggleExpanded(expandedKey)}
            actions={
                <>
                    <AdminButton
                        variant="outline"
                        size="sm"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => onAddRole(committeeIndex)}
                    >
                        Rola
                    </AdminButton>

                    <AdminIconButton
                        icon={Trash2}
                        label="Odstrániť komisiu"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onRemoveCommittee(committeeIndex)}
                    />
                </>
            }
        >
            <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                    <AdminFormField
                        label="Názov komisie"
                        htmlFor={`committee-name-${committeeIndex}`}
                        required
                    >
                        <AdminInput
                            id={`committee-name-${committeeIndex}`}
                            value={committee.name}
                            onChange={(event) =>
                                onUpdateCommittee(
                                    committeeIndex,
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="Programová komisia"
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Poradie"
                        htmlFor={`committee-order-${committeeIndex}`}
                        required
                    >
                        <AdminInput
                            id={`committee-order-${committeeIndex}`}
                            type="number"
                            value={committee.order}
                            onChange={(event) =>
                                onUpdateCommittee(
                                    committeeIndex,
                                    "order",
                                    event.target.value
                                )
                            }
                        />
                    </AdminFormField>
                </div>

                <AdminFormField
                    label="Popis"
                    htmlFor={`committee-description-${committeeIndex}`}
                >
                    <AdminTextarea
                        id={`committee-description-${committeeIndex}`}
                        value={committee.description}
                        onChange={(event) =>
                            onUpdateCommittee(
                                committeeIndex,
                                "description",
                                event.target.value
                            )
                        }
                        rows={3}
                        className="min-h-24 resize-y"
                        placeholder="Voliteľný popis komisie"
                    />
                </AdminFormField>

                {committee.roles.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600">
                        Táto komisia zatiaľ nemá roly.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {committee.roles.map((role, roleIndex) => (
                            <CommitteeRoleEditor
                                key={role.clientId}
                                role={role}
                                committeeIndex={committeeIndex}
                                roleIndex={roleIndex}
                                expanded={expanded}
                                onToggleExpanded={onToggleExpanded}
                                onUpdateRole={onUpdateRole}
                                onRemoveRole={onRemoveRole}
                                onAddMember={onAddMember}
                                onUpdateMember={onUpdateMember}
                                onRemoveMember={onRemoveMember}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminCollapsiblePanel>
    );
}