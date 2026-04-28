import type {
    Committee,
    CommitteeMember,
    CommitteeRole,
} from "../types/committeeTypes.ts";

export function sortCommittees(committees: Committee[]) {
    return [...committees].sort((left, right) => left.order - right.order);
}

export function sortCommitteeRoles(roles: CommitteeRole[]) {
    return [...roles].sort((left, right) => left.order - right.order);
}

export function sortCommitteeMembers(members: CommitteeMember[]) {
    return [...members].sort((left, right) => left.order - right.order);
}

export function formatMemberMeta(member: CommitteeMember) {
    const parts = [
        member.position?.trim(),
        member.affiliation?.trim(),
    ].filter(Boolean);

    return parts.join(", ");
}

export function countCommitteeMembers(committee: Committee) {
    return committee.roles.reduce(
        (total, role) => total + (role.members?.length ?? 0),
        0
    );
}