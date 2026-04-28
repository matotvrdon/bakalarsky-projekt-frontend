import type { Committee } from "../types/committeeTypes.ts";
import {
    countCommitteeMembers,
    sortCommitteeRoles,
} from "../utils/committeeUtils.ts";

import {
    CommitteeBadge,
    CommitteeCard,
} from "./base/index.ts";

import { CommitteeRoleBlock } from "./CommitteeRoleBlock.tsx";

type CommitteeSectionProps = {
    committee: Committee;
};

export function CommitteeSection({
                                     committee,
                                 }: CommitteeSectionProps) {
    const roles = sortCommitteeRoles(committee.roles ?? []);
    const memberCount = countCommitteeMembers(committee);

    return (
        <CommitteeCard>
            <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="break-words text-2xl font-bold tracking-tight text-gray-900">
                            {committee.name}
                        </h2>

                        {committee.description && (
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                {committee.description}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <CommitteeBadge variant="blue">
                            {roles.length} rolí
                        </CommitteeBadge>

                        <CommitteeBadge>
                            {memberCount} členov
                        </CommitteeBadge>
                    </div>
                </div>
            </div>

            {roles.length === 0 ? (
                <div className="px-6 py-6 text-sm text-gray-500">
                    Táto komisia zatiaľ nemá vytvorené žiadne roly.
                </div>
            ) : (
                roles.map((role) => (
                    <CommitteeRoleBlock
                        key={role.id}
                        role={role}
                    />
                ))
            )}
        </CommitteeCard>
    );
}