import { AdminBadge } from "../base";

type AdminStatusBadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "neutral"
    | "info"
    | "orange";

type AdminStatusBadgeProps = {
    label: string;
    variant?: AdminStatusBadgeVariant;
    clickable?: boolean;
    onClick?: () => void;
};

export function AdminStatusBadge({
                                     label,
                                     variant = "neutral",
                                     clickable,
                                     onClick,
                                 }: AdminStatusBadgeProps) {
    return (
        <AdminBadge
            variant={variant}
            onClick={clickable ? onClick : undefined}
        >
            {label}
        </AdminBadge>
    );
}