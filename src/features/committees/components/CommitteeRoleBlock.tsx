import type { CommitteeRole } from "../types/committeeTypes.ts";
import { sortCommitteeMembers } from "../utils/committeeUtils.ts";
import { CommitteeBadge } from "./base/index.ts";
import { CommitteeMemberItem } from "./CommitteeMemberItem.tsx";

type CommitteeRoleBlockProps = {
    role: CommitteeRole;
};

export function CommitteeRoleBlock({
                                       role,
                                   }: CommitteeRoleBlockProps) {
    const members = sortCommitteeMembers(role.members ?? []);

    return (
        <div className="border-t border-gray-100 px-6 py-5 first:border-t-0">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                    {role.name}
                </h3>

                <CommitteeBadge>
                    {members.length}
                </CommitteeBadge>
            </div>

            {members.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                    V tejto roli zatiaľ nie sú pridaní členovia.
                </p>
            ) : (
                <ul className="space-y-3">
                    {members.map((member) => (
                        <CommitteeMemberItem
                            key={member.id}
                            member={member}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}