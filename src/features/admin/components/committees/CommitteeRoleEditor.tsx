import { Plus, Trash2 } from "lucide-react";

import type {
    CommitteeMemberForm,
    CommitteeRoleForm,
} from "../../types/adminTypes.ts";

import { AdminButton, AdminInput } from "../base/index.ts";
import {
    AdminCollapsiblePanel,
    AdminFormField,
    AdminIconButton,
} from "../shared/index.ts";

import { CommitteeMemberEditor } from "./CommitteeMemberEditor.tsx";

type CommitteeRoleEditorProps = {
    role: CommitteeRoleForm;
    committeeIndex: number;
    roleIndex: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
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

export function CommitteeRoleEditor({
                                        role,
                                        committeeIndex,
                                        roleIndex,
                                        expanded,
                                        onToggleExpanded,
                                        onUpdateRole,
                                        onRemoveRole,
                                        onAddMember,
                                        onUpdateMember,
                                        onRemoveMember,
                                    }: CommitteeRoleEditorProps) {
    const expandedKey = `committee-role-${role.clientId}`;
    const isExpanded = expanded[expandedKey] ?? true;

    return (
        <AdminCollapsiblePanel
            title={role.name || `Rola ${roleIndex + 1}`}
            subtitle={`${role.members.length} členov`}
            expanded={isExpanded}
            onToggle={() => onToggleExpanded(expandedKey)}
            variant="white"
            actions={
                <>
                    <AdminButton
                        variant="outline"
                        size="sm"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => onAddMember(committeeIndex, roleIndex)}
                    >
                        Člen
                    </AdminButton>

                    <AdminIconButton
                        icon={Trash2}
                        label="Odstrániť rolu"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onRemoveRole(committeeIndex, roleIndex)}
                    />
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                    <AdminFormField
                        label="Názov role"
                        htmlFor={`committee-role-name-${committeeIndex}-${roleIndex}`}
                        required
                    >
                        <AdminInput
                            id={`committee-role-name-${committeeIndex}-${roleIndex}`}
                            value={role.name}
                            onChange={(event) =>
                                onUpdateRole(
                                    committeeIndex,
                                    roleIndex,
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="Členovia"
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Poradie"
                        htmlFor={`committee-role-order-${committeeIndex}-${roleIndex}`}
                        required
                    >
                        <AdminInput
                            id={`committee-role-order-${committeeIndex}-${roleIndex}`}
                            type="number"
                            value={role.order}
                            onChange={(event) =>
                                onUpdateRole(
                                    committeeIndex,
                                    roleIndex,
                                    "order",
                                    event.target.value
                                )
                            }
                        />
                    </AdminFormField>
                </div>

                {role.members.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600">
                        Táto rola zatiaľ nemá členov.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {role.members.map((member, memberIndex) => (
                            <CommitteeMemberEditor
                                key={member.clientId}
                                member={member}
                                memberIndex={memberIndex}
                                committeeIndex={committeeIndex}
                                roleIndex={roleIndex}
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