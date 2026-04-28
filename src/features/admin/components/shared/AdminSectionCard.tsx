import type { ReactNode } from "react";
import {
    AdminCard,
    AdminCardContent,
    AdminCardHeader,
} from "../base";

type AdminSectionCardProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
};

export function AdminSectionCard({
                                     title,
                                     description,
                                     action,
                                     children,
                                 }: AdminSectionCardProps) {
    return (
        <AdminCard>
            <AdminCardHeader
                title={title}
                description={description}
                action={action}
            />

            <AdminCardContent>
                {children}
            </AdminCardContent>
        </AdminCard>
    );
}