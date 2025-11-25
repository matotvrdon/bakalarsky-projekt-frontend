import type {Conference} from "../types/types.ts";

const API_BASE = 'http://localhost:5010/api';

export async function fetchConferences(): Promise<Conference[]> {
    const response = await fetch(`${API_BASE}/conference/get-all`, { method: 'GET' });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = response.statusText || 'Failed to fetch conferences';
        throw new Error(message);
    }

    return (data?.payload ?? data) as Conference[];
}

export async function fetchConferenceDetail(id: number): Promise<Conference> {
    const response = await fetch(`${API_BASE}/conference/get-by-id/${id}`, { method: 'GET' });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = response.statusText || 'Failed to fetch conference detail';
        throw new Error(message);
    }

    return (data?.payload ?? data) as Conference;
}

export async function createConference(conference: Omit<Conference, 'id'>): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE}/conference`, {
        method: 'POST',
        body: JSON.stringify(conference),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = response.statusText || 'Failed to create conference';
        throw new Error(message);
    }

    return { id: (data?.payload?.id ?? data?.id) as number };
}

export async function deleteConference(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/conference/${id}`, { method: 'DELETE' });

    if (!response.ok) {
        await response.json().catch(() => null);
        const message = response.statusText || 'Failed to delete conference';
        throw new Error(message);
    }
}
