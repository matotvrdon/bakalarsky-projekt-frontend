import type { ComponentType } from "react";
import { AdminButton } from "../base";

type AdminActionButtonProps = {
    label: string;
    icon?: ComponentType<{ className?: string }>;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
    className?: string;
    hiddenLabelOnMobile?: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
};

export function AdminActionButton({
                                      label,
                                      icon: Icon,
                                      variant = "outline",
                                      size = "sm",
                                      className,
                                      hiddenLabelOnMobile = true,
                                      onClick,
                                      type = "button",
                                      disabled,
                                  }: AdminActionButtonProps) {
    return (
        <AdminButton
            type={type}
            variant={variant}
            size={size}
            onClick={onClick}
            className={className}
            disabled={disabled}
            icon={Icon ? <Icon className="w-4 h-4" /> : undefined}
        >
      <span className={hiddenLabelOnMobile ? "hidden sm:inline" : ""}>
        {label}
      </span>
        </AdminButton>
    );
}