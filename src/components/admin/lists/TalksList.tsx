import type { Day } from "../../../types/types";
import { AdminList, AdminCard, AdminEmpty, AdminButton, Section, SubSection } from "../ui";

type Props = {
    days: Day[];
    onDelete: (id: number) => void;
};

export default function TalksList({ days, onDelete }: Props) {
    if (days.length === 0) {
        return <AdminEmpty>No days created</AdminEmpty>;
    }

    return (
        <>
            {days.map((day) => (
                <Section key={day.id} title={day.date}>
                    {(day.session ?? []).filter(Boolean).map((session) => (
                        <SubSection
                            key={session!.id}
                            title={session!.title}
                            time={`${session!.startTime} – ${session!.endTime}`}
                        >
                            {(session!.theme ?? []).filter(Boolean).map((theme) => (
                                <div key={theme!.id} className="admin-subsection">
                                    <div className="admin-subsection-title">
                                        Theme: {theme!.title}
                                    </div>

                                    {(theme!.talk ?? []).filter(Boolean).length === 0 ? (
                                        <AdminEmpty>No talks in this theme</AdminEmpty>
                                    ) : (
                                        <AdminList>
                                            {(theme!.talk ?? []).filter(Boolean).map((talk) => (
                                                <AdminCard
                                                    key={talk!.id}
                                                    title={talk!.title}
                                                    subtitle={`${talk!.startTime} – ${talk!.endTime}`}
                                                    actions={
                                                        <AdminButton variant="danger" onClick={() => onDelete(talk!.id)}>
                                                            Delete
                                                        </AdminButton>
                                                    }
                                                >
                                                    {talk!.content && <p>{talk!.content}</p>}
                                                </AdminCard>
                                            ))}
                                        </AdminList>
                                    )}
                                </div>
                            ))}
                        </SubSection>
                    ))}
                </Section>
            ))}
        </>
    );
}
