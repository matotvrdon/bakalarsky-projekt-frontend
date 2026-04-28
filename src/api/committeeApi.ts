import { BASE_URL } from "./baseApi.ts";

export type CommitteeMember = {
    id: number;
    fullName: string;
    position?: string | null;
    affiliation?: string | null;
    country?: string | null;
    order: number;
};

export type CommitteeRole = {
    id: number;
    name: string;
    order: number;
    members: CommitteeMember[];
};

export type Committee = {
    id: number;
    name: string;
    description?: string | null;
    order: number;
    roles: CommitteeRole[];
};

export type ConferenceCommittees = {
    conferenceId: number;
    conferenceName: string;
    committees: Committee[];
};

export type CommitteeCreateRequest = {
    name: string;
    description?: string | null;
    order: number;
};

export type CommitteeUpdateRequest = CommitteeCreateRequest;

export type CommitteeRoleCreateRequest = {
    name: string;
    order: number;
};

export type CommitteeRoleUpdateRequest = CommitteeRoleCreateRequest;

export type CommitteeMemberCreateRequest = {
    fullName: string;
    position?: string | null;
    affiliation?: string | null;
    country?: string | null;
    order: number;
};

export type CommitteeMemberUpdateRequest = CommitteeMemberCreateRequest;

const jsonHeaders = {
    "Content-Type": "application/json",
};

export const getActiveCommittees = async (): Promise<ConferenceCommittees> => {
    const response = await fetch(`${BASE_URL}/api/committees/active`);

    if (!response.ok) {
        throw new Error("Failed to load active committees.");
    }

    return response.json();
};

export const getConferenceCommittees = async (
    conferenceId: number
): Promise<ConferenceCommittees> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/conference/${conferenceId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load conference committees.");
    }

    return response.json();
};

export const createCommittee = async (
    conferenceId: number,
    payload: CommitteeCreateRequest
): Promise<Committee> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/conference/${conferenceId}`,
        {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create committee.");
    }

    return response.json();
};

export const updateCommittee = async (
    committeeId: number,
    payload: CommitteeUpdateRequest
): Promise<Committee> => {
    const response = await fetch(`${BASE_URL}/api/committees/${committeeId}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to update committee.");
    }

    return response.json();
};

export const deleteCommittee = async (committeeId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/committees/${committeeId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete committee.");
    }
};

export const createCommitteeRole = async (
    committeeId: number,
    payload: CommitteeRoleCreateRequest
): Promise<CommitteeRole> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/${committeeId}/roles`,
        {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create committee role.");
    }

    return response.json();
};

export const updateCommitteeRole = async (
    roleId: number,
    payload: CommitteeRoleUpdateRequest
): Promise<CommitteeRole> => {
    const response = await fetch(`${BASE_URL}/api/committees/roles/${roleId}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to update committee role.");
    }

    return response.json();
};

export const deleteCommitteeRole = async (roleId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/committees/roles/${roleId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete committee role.");
    }
};

export const createCommitteeMember = async (
    roleId: number,
    payload: CommitteeMemberCreateRequest
): Promise<CommitteeMember> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/roles/${roleId}/members`,
        {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create committee member.");
    }

    return response.json();
};

export const updateCommitteeMember = async (
    memberId: number,
    payload: CommitteeMemberUpdateRequest
): Promise<CommitteeMember> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/members/${memberId}`,
        {
            method: "PUT",
            headers: jsonHeaders,
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update committee member.");
    }

    return response.json();
};

export const deleteCommitteeMember = async (
    memberId: number
): Promise<void> => {
    const response = await fetch(
        `${BASE_URL}/api/committees/members/${memberId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete committee member.");
    }
};