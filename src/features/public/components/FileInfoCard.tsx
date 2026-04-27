import { PublicButton, PublicLabel } from "./base/index.ts";

type FileInfoCardProps = {
    title: string;
    fileName: string;
    onOpen: () => void;
    onDownload: () => void;
};

export function FileInfoCard({
                                 title,
                                 fileName,
                                 onOpen,
                                 onDownload,
                             }: FileInfoCardProps) {
    return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="space-y-1">
                <PublicLabel>{title}</PublicLabel>
                <p className="break-all text-sm text-gray-700">
                    {fileName}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <PublicButton
                    type="button"
                    variant="outline"
                    onClick={onOpen}
                >
                    Otvoriť
                </PublicButton>

                <PublicButton
                    type="button"
                    variant="outline"
                    onClick={onDownload}
                >
                    Stiahnuť
                </PublicButton>
            </div>
        </div>
    );
}