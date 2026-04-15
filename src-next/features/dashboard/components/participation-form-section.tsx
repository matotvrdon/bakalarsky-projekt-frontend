import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "../../../shared/ui";

type ConferenceEntryOption = {
  id: number;
  name: string;
  price: number;
};

type ParticipationFormSectionProps = {
  options: ConferenceEntryOption[];
  selectedConferenceEntryId: string;
  onSelectConferenceEntryId: (value: string) => void;
  isStudent: boolean;
  onSetIsStudent: (value: boolean) => void;
  isStudentLocked: boolean;
  studentStatusLabel: string;
  studentFileName?: string;
  onOpenStudentFile?: () => void;
  studentProofFile: File | null;
  onStudentProofFileChange: (file: File | null) => void;
  onUploadStudentProof: () => void;
  uploadingStudentProof: boolean;
  uploadError?: string;
  saveError?: string;
  onSave: () => void;
  saving: boolean;
  hasChanges: boolean;
};

export function ParticipationFormSection({
  options,
  selectedConferenceEntryId,
  onSelectConferenceEntryId,
  isStudent,
  onSetIsStudent,
  isStudentLocked,
  studentStatusLabel,
  studentFileName,
  onOpenStudentFile,
  studentProofFile,
  onStudentProofFileChange,
  onUploadStudentProof,
  uploadingStudentProof,
  uploadError,
  saveError,
  onSave,
  saving,
  hasChanges,
}: ParticipationFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conference entry</CardTitle>
        <CardDescription>Vyberte si typ účasti dostupný pre aktívnu konferenciu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {options.length === 0 ? (
          <Alert>
            <AlertCircle />
            <AlertDescription>Pre aktívnu konferenciu zatiaľ nie sú nastavené žiadne conference entry možnosti.</AlertDescription>
          </Alert>
        ) : (
          <RadioGroup value={selectedConferenceEntryId} onValueChange={onSelectConferenceEntryId}>
            {options.map((option) => (
              <Label key={option.id} htmlFor={`conference-entry-${option.id}`} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-muted/20">
                <RadioGroupItem id={`conference-entry-${option.id}`} value={String(option.id)} className="border-2 border-gray-500 data-[state=checked]:border-black" />
                <div className="flex-1 font-semibold">{option.name}</div>
                <Badge variant="secondary">{option.price} €</Badge>
              </Label>
            ))}
          </RadioGroup>
        )}

        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="studentStatus"
              checked={isStudent}
              disabled={isStudentLocked}
              onCheckedChange={(checked) => onSetIsStudent(checked === true)}
            />
            <Label htmlFor="studentStatus">Som študent</Label>
          </div>
          <p className="text-sm text-muted-foreground">Študentský status podlieha overeniu administrátorom.</p>
          <p className="text-sm">
            Aktuálny stav: <strong>{studentStatusLabel}</strong>
          </p>
          {studentFileName ? (
            <button type="button" onClick={onOpenStudentFile} className="text-sm text-primary underline-offset-4 hover:underline">
              {studentFileName}
            </button>
          ) : null}

          {isStudent && !isStudentLocked ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
              <Label htmlFor="studentProof">Overenie študentského statusu</Label>
              <Input id="studentProof" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onStudentProofFileChange(e.target.files?.[0] || null)} />
              <Button type="button" onClick={onUploadStudentProof} disabled={!studentProofFile || uploadingStudentProof}>
                {uploadingStudentProof ? "Odosielam..." : "Odoslať na overenie"}
              </Button>
            </div>
          ) : null}
        </div>

        {uploadError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        ) : null}
        {saveError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="button" className="w-full" onClick={onSave} disabled={saving || !hasChanges}>
          {saving ? "Ukladám..." : "Uložiť"}
        </Button>
      </CardContent>
    </Card>
  );
}

