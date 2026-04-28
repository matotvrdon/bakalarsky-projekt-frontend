import { AdminBadge } from "../base/index.ts";

type ParticipantStatusBadgeProps = {
    variant: "student" | "submission" | "invoice";
    value: string;
    clickable?: boolean;
    onClick?: () => void;
};

export function ParticipantStatusBadge({
                                           variant,
                                           value,
                                           clickable = false,
                                           onClick,
                                       }: ParticipantStatusBadgeProps) {
    const handleClick = clickable ? onClick : undefined;

    if (variant === "invoice") {
        if (value === "Zaplatená") {
            return (
                <AdminBadge variant="success" onClick={handleClick}>
                    Zaplatená
                </AdminBadge>
            );
        }

        if (value === "Čaká na úhradu") {
            return (
                <AdminBadge variant="warning" onClick={handleClick}>
                    Čaká na úhradu
                </AdminBadge>
            );
        }

        if (value === "Zrušená") {
            return (
                <AdminBadge variant="danger" onClick={handleClick}>
                    Zrušená
                </AdminBadge>
            );
        }

        return (
            <AdminBadge variant="neutral" onClick={handleClick}>
                Bez faktúry
            </AdminBadge>
        );
    }

    if (value === "Schválené") {
        return (
            <AdminBadge variant="success" onClick={handleClick}>
                Schválené
            </AdminBadge>
        );
    }

    if (value === "Čaká na potvrdenie") {
        return (
            <AdminBadge variant="warning" onClick={handleClick}>
                Čaká na potvrdenie
            </AdminBadge>
        );
    }

    if (value === "Zamietnuté") {
        return (
            <AdminBadge variant="danger" onClick={handleClick}>
                Zamietnuté
            </AdminBadge>
        );
    }

    if (value === "Vybral študentský status, neodoslal potvrdenie") {
        return (
            <AdminBadge variant="orange">
                Vybral, neodoslal potvrdenie
            </AdminBadge>
        );
    }

    if (value === "Vybral príspevok, neodoslal súbor") {
        return (
            <AdminBadge variant="orange">
                Vybral, neodoslal súbor
            </AdminBadge>
        );
    }

    if (variant === "student") {
        return <AdminBadge variant="neutral">Nie je študent</AdminBadge>;
    }

    return <AdminBadge variant="neutral">Bez príspevku</AdminBadge>;
}