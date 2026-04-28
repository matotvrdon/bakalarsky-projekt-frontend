import { Clock } from "lucide-react";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    WAITING_FOR_APPROVAL_STATUS,
} from "../../constants/publicConstants.ts";

import { PublicAlert } from "../base/index.ts";

type PresentationStatusAlertProps = {
    isSubmissionStatusLocked: boolean;
    latestSubmissionFileStatus: number | null;
};

export function PresentationStatusAlert({
                                            isSubmissionStatusLocked,
                                            latestSubmissionFileStatus,
                                        }: PresentationStatusAlertProps) {
    if (
        isSubmissionStatusLocked &&
        latestSubmissionFileStatus === WAITING_FOR_APPROVAL_STATUS
    ) {
        return (
            <PublicAlert variant="warning" icon={Clock}>
                Vaša prezentácia čaká na schválenie administrátorom. Zmenu nie je
                možné vykonať.
            </PublicAlert>
        );
    }

    if (
        isSubmissionStatusLocked &&
        latestSubmissionFileStatus === APPROVED_STATUS
    ) {
        return (
            <PublicAlert variant="success">
                Prezentácia bola schválená.
            </PublicAlert>
        );
    }

    if (latestSubmissionFileStatus === REJECTED_STATUS) {
        return (
            <PublicAlert variant="danger">
                Prezentácia bola zamietnutá. Nahrajte novú verziu.
            </PublicAlert>
        );
    }

    return null;
}