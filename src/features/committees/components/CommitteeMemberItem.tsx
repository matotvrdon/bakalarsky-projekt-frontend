import type { CommitteeMember } from "../types/committeeTypes.ts";
import { formatMemberMeta } from "../utils/committeeUtils.ts";
import { CommitteeBadge } from "./base/index.ts";

type CommitteeMemberItemProps = {
    member: CommitteeMember;
};

export function CommitteeMemberItem({
                                        member,
                                    }: CommitteeMemberItemProps) {
    const meta = formatMemberMeta(member);

    return (
        <li className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="break-words font-semibold text-gray-900">
                        {member.fullName}
                    </p>

                    {meta && (
                        <p className="mt-1 break-words text-sm leading-relaxed text-gray-600">
                            {meta}
                        </p>
                    )}
                </div>

                {member.country && (
                    <CommitteeBadge>
                        {member.country}
                    </CommitteeBadge>
                )}
            </div>
        </li>
    );
}