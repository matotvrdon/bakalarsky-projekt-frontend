import { AdminDeleteDialog } from "../shared/index.ts";

type DeleteConferenceDialogProps = {
    conferenceId: number | null;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: number) => Promise<void>;
};

export function DeleteConferenceDialog({
                                           conferenceId,
                                           onOpenChange,
                                           onDelete,
                                       }: DeleteConferenceDialogProps) {
    return (
        <AdminDeleteDialog
            open={conferenceId !== null}
            title="Odstrániť konferenciu?"
            description="Táto akcia je nevratná. Naozaj chcete odstrániť túto konferenciu?"
            onOpenChange={onOpenChange}
            onConfirm={async () => {
                if (conferenceId !== null) {
                    await onDelete(conferenceId);
                }
            }}
        />
    );
}