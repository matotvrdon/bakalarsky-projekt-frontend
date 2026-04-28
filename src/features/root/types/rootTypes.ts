export type RootUser = {
    id: number;
    name: string;
    email?: string;
    role: string;
    participantId?: number;
    conferenceId?: number;
};

export type RootNavigationItem = {
    name: string;
    href: string;
};