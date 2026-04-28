import { Trash2 } from "lucide-react";

import type { CommitteeMemberForm } from "../../types/adminTypes.ts";

import { AdminInput } from "../base/index.ts";
import { AdminFormField, AdminIconButton } from "../shared/index.ts";

type CommitteeMemberEditorProps = {
    member: CommitteeMemberForm;
    memberIndex: number;
    committeeIndex: number;
    roleIndex: number;
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

export function CommitteeMemberEditor({
                                          member,
                                          memberIndex,
                                          committeeIndex,
                                          roleIndex,
                                          onUpdateMember,
                                          onRemoveMember,
                                      }: CommitteeMemberEditorProps) {
    const fieldId = `${committeeIndex}-${roleIndex}-${memberIndex}`;

    return (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 xl:grid-cols-[minmax(180px,1.3fr)_minmax(150px,1fr)_minmax(190px,1.2fr)_90px_90px_44px]">
            <AdminFormField
                label="Meno"
                htmlFor={`committee-member-name-${fieldId}`}
                required
            >
                <AdminInput
                    id={`committee-member-name-${fieldId}`}
                    value={member.fullName}
                    onChange={(event) =>
                        onUpdateMember(
                            committeeIndex,
                            roleIndex,
                            memberIndex,
                            "fullName",
                            event.target.value
                        )
                    }
                    placeholder="Martin Tvrdoň"
                />
            </AdminFormField>

            <AdminFormField
                label="Pozícia"
                htmlFor={`committee-member-position-${fieldId}`}
            >
                <AdminInput
                    id={`committee-member-position-${fieldId}`}
                    value={member.position}
                    onChange={(event) =>
                        onUpdateMember(
                            committeeIndex,
                            roleIndex,
                            memberIndex,
                            "position",
                            event.target.value
                        )
                    }
                    placeholder="Testovací člen"
                />
            </AdminFormField>

            <AdminFormField
                label="Inštitúcia"
                htmlFor={`committee-member-affiliation-${fieldId}`}
            >
                <AdminInput
                    id={`committee-member-affiliation-${fieldId}`}
                    value={member.affiliation}
                    onChange={(event) =>
                        onUpdateMember(
                            committeeIndex,
                            roleIndex,
                            memberIndex,
                            "affiliation",
                            event.target.value
                        )
                    }
                    placeholder="Technická univerzita v Košiciach"
                />
            </AdminFormField>

            <AdminFormField
                label="Krajina"
                htmlFor={`committee-member-country-${fieldId}`}
            >
                <AdminInput
                    id={`committee-member-country-${fieldId}`}
                    value={member.country}
                    onChange={(event) =>
                        onUpdateMember(
                            committeeIndex,
                            roleIndex,
                            memberIndex,
                            "country",
                            event.target.value
                        )
                    }
                    placeholder="SK"
                />
            </AdminFormField>

            <AdminFormField
                label="Poradie"
                htmlFor={`committee-member-order-${fieldId}`}
                required
            >
                <AdminInput
                    id={`committee-member-order-${fieldId}`}
                    type="number"
                    value={member.order}
                    onChange={(event) =>
                        onUpdateMember(
                            committeeIndex,
                            roleIndex,
                            memberIndex,
                            "order",
                            event.target.value
                        )
                    }
                />
            </AdminFormField>

            <div className="flex items-end">
                <AdminIconButton
                    icon={Trash2}
                    label="Odstrániť člena"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                        onRemoveMember(committeeIndex, roleIndex, memberIndex)
                    }
                />
            </div>
        </div>
    );
}