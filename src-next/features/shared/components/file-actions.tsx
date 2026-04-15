import { Download, Eye } from "lucide-react";

import { Button } from "../../../shared/ui";

type FileActionsProps = {
  viewUrl: string;
  downloadUrl: string;
  fileName: string;
};

export function FileActions({ viewUrl, downloadUrl, fileName }: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
      >
        <Eye data-icon="inline-start" />
        Otvoriť
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
      >
        <Download data-icon="inline-start" />
        Stiahnuť
      </Button>
    </div>
  );
}

