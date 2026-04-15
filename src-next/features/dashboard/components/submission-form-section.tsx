import { AlertCircle, CheckCircle2 } from "lucide-react";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from "../../../shared/ui";

type SubmissionFormSectionProps = {
  enabled: boolean;
  submissionIdentifier: string;
  title: string;
  onChange: (next: { submissionIdentifier: string; title: string }) => void;
  willPresent: boolean;
  onSetWillPresent: (value: boolean) => void;
  isStatusLocked: boolean;
  existingFileName?: string;
  onOpenFile?: () => void;
  presentationFile: File | null;
  onPresentationFileChange: (file: File | null) => void;
  onUploadFile: () => void;
  uploading: boolean;
  onSave: () => void;
  saving: boolean;
  loading: boolean;
  successMessage?: string;
  errorMessage?: string;
  fieldErrors?: Partial<Record<"submissionIdentifier" | "title", string>>;
};

export function SubmissionFormSection({
  enabled,
  submissionIdentifier,
  title,
  onChange,
  willPresent,
  onSetWillPresent,
  isStatusLocked,
  existingFileName,
  onOpenFile,
  presentationFile,
  onPresentationFileChange,
  onUploadFile,
  uploading,
  onSave,
  saving,
  loading,
  successMessage,
  errorMessage,
  fieldErrors,
}: SubmissionFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Odoslanie príspevku</CardTitle>
        <CardDescription>
          {enabled ? "Vyplňte informácie o vašom príspevku." : "Dostupné po výbere conference entry."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!enabled ? (
          <Alert>
            <AlertCircle />
            <AlertDescription>Pre odoslanie príspevku musíte vybrať typ účasti.</AlertDescription>
          </Alert>
        ) : (
          <>
            {loading ? <p className="text-sm text-muted-foreground">Načítavam príspevok...</p> : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="submissionIdentifier">ID príspevku *</Label>
              <Input
                id="submissionIdentifier"
                value={submissionIdentifier}
                onChange={(e) => onChange({ submissionIdentifier: e.target.value, title })}
                aria-invalid={Boolean(fieldErrors?.submissionIdentifier)}
              />
              {fieldErrors?.submissionIdentifier ? <p className="text-sm text-destructive">{fieldErrors.submissionIdentifier}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="submissionTitle">Názov príspevku *</Label>
              <Input
                id="submissionTitle"
                value={title}
                onChange={(e) => onChange({ submissionIdentifier, title: e.target.value })}
                aria-invalid={Boolean(fieldErrors?.title)}
              />
              {fieldErrors?.title ? <p className="text-sm text-destructive">{fieldErrors.title}</p> : null}
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <Checkbox id="willPresent" checked={willPresent} disabled={isStatusLocked} onCheckedChange={(checked) => onSetWillPresent(checked === true)} />
                <Label htmlFor="willPresent">Som prezentér</Label>
              </div>
              {existingFileName ? (
                <button type="button" onClick={onOpenFile} className="text-sm text-primary underline-offset-4 hover:underline">
                  {existingFileName}
                </button>
              ) : null}
              {willPresent && !isStatusLocked ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="presentationUpload">Prezentácia</Label>
                  <Input id="presentationUpload" type="file" accept=".pdf,.ppt,.pptx" onChange={(e) => onPresentationFileChange(e.target.files?.[0] || null)} />
                  <Button type="button" onClick={onUploadFile} disabled={!presentationFile || uploading}>
                    {uploading ? "Odosielam..." : "Odoslať na overenie"}
                  </Button>
                </div>
              ) : null}
            </div>

            {successMessage ? (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="text-emerald-600" />
                <AlertDescription className="text-emerald-900">{successMessage}</AlertDescription>
              </Alert>
            ) : null}
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="button" className="w-full" onClick={onSave} disabled={saving || loading}>
              {saving ? "Ukladám..." : "Uložiť príspevok"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

