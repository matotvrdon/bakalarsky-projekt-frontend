import { api } from "./baseApi";
import type { Attendee } from "../types/types";

export const getAttendeesByConference = (conferenceId: number): Promise<Attendee[]> => {
    return api(`/api/attendee/get-all-by-conference/${conferenceId}`);
};

export const createAttendee = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}): Promise<Attendee> => {
    return api("/api/attendee", {
        method: "POST",
        json: data
    });
};

export const assignAttendeesToCustomer = (attendeeIds: number[], customerId: number): Promise<void> => {
    return api("/api/attendee", {
        method: "PUT",
        json: {
            attendeeId: attendeeIds,
            customerId
        }
    });
};