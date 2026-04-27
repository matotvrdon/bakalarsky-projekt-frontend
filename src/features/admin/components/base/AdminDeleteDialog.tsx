import { AdminButton } from "./AdminButton.tsx";
import { AdminDialog } from "./AdminDialog.tsx";

type AdminDeleteDialogProps = {
    open: boolean;
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
};

export function AdminDeleteDialog({
                                      open,
                                      title = "Odstrániť záznam?",
                                      description = "Táto akcia je nevratná.",
                                      cancelText = "Zrušiť",
                                      confirmText = "Odstrániť",
                                      onOpenChange,
                                      onConfirm,
                                  }: AdminDeleteDialogProps) {
    return (
        <AdminDialog
            open={open}
            title={title}
            description={description}
            onOpenChange={onOpenChange}
            footer={
                <>
                    <AdminButton variant="outline" onClick={() => onOpenChange(false)}>
                        {cancelText}
                    </AdminButton>

                    <AdminButton variant="danger" onClick={onConfirm}>
                        {confirmText}
                    </AdminButton>
                </>
            }
        >
            <p className="text-sm text-gray-600">
                Potvrdením sa záznam odstráni zo systému.
            </p>
        </AdminDialog>
    );
}