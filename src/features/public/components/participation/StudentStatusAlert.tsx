import { Clock } from "lucide-react";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    WAITING_FOR_APPROVAL_STATUS,
} from "../../constants/publicConstants.ts";

import { PublicAlert } from "../base/index.ts";

type StudentStatusAlertProps = {
    isStudentStatusLocked: boolean;
    studentVerificationStatus: number | null;
};

export function StudentStatusAlert({
                                       isStudentStatusLocked,
                                       studentVerificationStatus,
                                   }: StudentStatusAlertProps) {
    if (
        isStudentStatusLocked &&
        studentVerificationStatus === WAITING_FOR_APPROVAL_STATUS
    ) {
        return (
            <PublicAlert variant="warning" icon={Clock}>
                Váš dokument čaká na schválenie administrátorom. Zmenu nie je
                možné vykonať.
            </PublicAlert>
        );
    }

    if (
        isStudentStatusLocked &&
        studentVerificationStatus === APPROVED_STATUS
    ) {
        return (
            <PublicAlert variant="success">
                Študentský status bol schválený.
            </PublicAlert>
        );
    }

    if (studentVerificationStatus === REJECTED_STATUS) {
        return (
            <PublicAlert variant="danger">
                Doklad bol zamietnutý. Nahrajte nový doklad.
            </PublicAlert>
        );
    }

    return null;
}