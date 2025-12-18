import type { Conference } from "../../../types/types";
import { AdminList, AdminCard, AdminButton, AdminEmpty } from "../ui";

type Props = {
    conferences: Conference[];
    onManage: (id: number) => void;
    onDelete: (id: number) => void;
};

export default function ConferencesList({ conferences, onManage, onDelete }: Props) {
    if (conferences.length === 0) {
        return <AdminEmpty>No conferences created yet</AdminEmpty>;
    }

    return (
        <AdminList>
            {conferences.map((c) => (
                <AdminCard
                    key={c.id}
                    title={c.name}
                    subtitle={`${c.startDate} → ${c.endDate}`}
                    actions={
                        <>
                            <AdminButton variant="secondary" onClick={() => onManage(c.id)}>
                                Manage
                            </AdminButton>
                            <AdminButton variant="danger" onClick={() => onDelete(c.id)}>
                                Delete
                            </AdminButton>
                        </>
                    }
                />
            ))}
        </AdminList>
    );
}

