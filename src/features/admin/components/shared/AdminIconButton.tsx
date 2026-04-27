import type { ComponentType } from "react";
import { AdminButton } from "../base";

type AdminIconButtonProps = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export function AdminIconButton({
                                    icon: Icon,
                                    label,
                                    variant = "outline",
                                    className,
                                    onClick,
                                    disabled,
                                }: AdminIconButtonProps) {
    return (
        <AdminButton
            type="button"
            variant={variant}
            size="icon"
            className={className}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </AdminButton>
    );
}