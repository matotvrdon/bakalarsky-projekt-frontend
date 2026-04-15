import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "../../../shared/ui";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

