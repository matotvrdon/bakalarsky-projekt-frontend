import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Alert, AlertDescription } from "../components/ui/alert.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { 
  User, FileText, Hotel, UtensilsCrossed, Receipt, 
  CheckCircle2, Clock, AlertCircle, Download, Copy, Users
} from "lucide-react";
import { getParticipantByUserId, updateParticipant, type ParticipantPayload } from "../api/participantApi.ts";
import { getActiveConferences } from "../api/conferenceApi.ts";
import { uploadParticipantFile } from "../api/fileManagerApi.ts";
import { BASE_URL } from "../api/baseApi.ts";
import {
  createSubmission,
  getSubmissionByParticipant,
  SubmissionApiError,
  updateSubmission,
  type SubmissionPayload,
} from "../api/submissionApi.ts";
import { toast } from "sonner";
import { useActiveConference } from "../hooks/useActiveConference.ts";

const STUDENT_VERIFICATION_FILE_TYPE = 0;
const SUBMISSION_FILE_TYPE = 1;
const WAITING_FOR_APPROVAL_STATUS = 0;
const APPROVED_STATUS = 1;
const REJECTED_STATUS = 2;

const normalizeFileType = (value: number | string) => {
  if (typeof value === "number") return value;
  const normalized = value.toLowerCase();
  if (normalized === "studentverification") return 0;
  if (normalized === "submission") return 1;
  return null;
};

const normalizeFileStatus = (value: number | string) => {
  if (typeof value === "number") return value;
  const normalized = value.toLowerCase();
  if (normalized === "waitingforapproval") return 0;
  if (normalized === "approved") return 1;
  if (normalized === "rejected") return 2;
  return null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
};

const formatDateRange = (startDate?: string | null, endDate?: string | null) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start && end) return `${start} - ${end}`;
  return start || end || "";
};

const getFoodTypeLabel = (value: number) => {
  if (value === 0) return "Raňajky";
  if (value === 1) return "Obed";
  if (value === 2) return "Večera";
  return String(value);
};

export function Dashboard() {
  const navigate = useNavigate();
  const activeConference = useActiveConference();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConferenceEntryId, setSelectedConferenceEntryId] = useState<string>("");
  const [isStudent, setIsStudent] = useState(false);
  const [studentProofFile, setStudentProofFile] = useState<File | null>(null);
  const [participantDraft, setParticipantDraft] = useState<ParticipantPayload | null>(null);
  const [savedConferenceEntryId, setSavedConferenceEntryId] = useState<ParticipantPayload["conferenceEntryId"]>(null);
  const [savedIsStudent, setSavedIsStudent] = useState(false);
  const [savingParticipant, setSavingParticipant] = useState(false);
  const [saveParticipantError, setSaveParticipantError] = useState("");
  const [uploadingStudentProof, setUploadingStudentProof] = useState(false);
  const [studentUploadError, setStudentUploadError] = useState("");
  const [willPresent, setWillPresent] = useState(false);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionPayload | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [savingSubmission, setSavingSubmission] = useState(false);
  const [uploadingPresentation, setUploadingPresentation] = useState(false);
  const [saveSubmissionError, setSaveSubmissionError] = useState("");
  const [submissionFieldErrors, setSubmissionFieldErrors] = useState<Partial<Record<"submissionIdentifier" | "title" | "participantId" | "conferenceId", string>>>({});
  const [submissionSuccessMessage, setSubmissionSuccessMessage] = useState("");
  const [submission, setSubmission] = useState({
    submissionIdentifier: "",
    title: "",
  });
  const [accommodation, setAccommodation] = useState<number | null>(null);
  const [catering, setCatering] = useState<number[]>([]);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<"pending" | "paid">("pending");
  
  // Shared invoice states
  const [invoiceType, setInvoiceType] = useState<"individual" | "create-shared" | "join-shared">("individual");
  const [sharedInvoiceCode, setSharedInvoiceCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [hasCustomBilling, setHasCustomBilling] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    companyName: "",
    ico: "",
    dic: "",
    address: "",
  });

  const applyParticipantState = (participant: ParticipantPayload) => {
    setParticipantDraft(participant);
    localStorage.setItem("participantDraft", JSON.stringify(participant));
    setSelectedConferenceEntryId(participant.conferenceEntryId ? String(participant.conferenceEntryId) : "");
    setIsStudent(participant.isStudent);
    setSavedConferenceEntryId(participant.conferenceEntryId);
    setSavedIsStudent(participant.isStudent);
  };

  const applySubmissionState = (nextSubmission: SubmissionPayload | null) => {
    setSubmissionRecord(nextSubmission);
    setSubmission({
      submissionIdentifier: nextSubmission?.submissionIdentifier ?? "",
      title: nextSubmission?.title ?? "",
    });
    setWillPresent(nextSubmission?.isPresenting ?? false);
  };

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== "participant") {
      navigate("/admin");
      return;
    }
    setCurrentUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const loadParticipant = async () => {
      try {
        const participant = await getParticipantByUserId(currentUser.id);
        applyParticipantState(participant);
      } catch {
        const stored = localStorage.getItem("participantDraft");
        if (stored) {
          const parsed = JSON.parse(stored) as ParticipantPayload;
          applyParticipantState(parsed);
        } else {
          const nameParts = (currentUser.name || "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const draft: ParticipantPayload = {
            id: currentUser.participantId ?? 0,
            firstName,
            lastName,
            phone: null,
            affiliation: null,
            country: null,
            conferenceEntryId: null,
            conferenceEntry: null,
            isStudent: false,
            isPresenting: false,
            fileManagers: [],
            userId: currentUser.id ?? 0,
            conferenceId: currentUser.conferenceId ?? 0
          };
          applyParticipantState(draft);
        }
      }
    };

    loadParticipant();
  }, [currentUser]);

  useEffect(() => {
    if (!participantDraft?.id) return;

    let cancelled = false;

    const loadSubmission = async () => {
      setSubmissionLoading(true);
      setSaveSubmissionError("");
      setSubmissionFieldErrors({});

      try {
        const loadedSubmission = await getSubmissionByParticipant(participantDraft.id);
        if (cancelled) return;
        applySubmissionState(loadedSubmission);
      } catch (error) {
        if (cancelled) return;

        if (error instanceof SubmissionApiError && error.code === "SUBMISSION_NOT_FOUND") {
          applySubmissionState(null);
          return;
        }

        setSaveSubmissionError(error instanceof Error ? error.message : "Načítanie príspevku zlyhalo");
      } finally {
        if (!cancelled) {
          setSubmissionLoading(false);
        }
      }
    };

    loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [participantDraft?.id]);

  const updateDraft = (updates: Partial<ParticipantPayload>) => {
    setParticipantDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("participantDraft", JSON.stringify(next));
      return next;
    });
  };

  const applySubmissionApiError = (error: unknown) => {
    const nextErrors: Partial<Record<"submissionIdentifier" | "title" | "participantId" | "conferenceId", string>> = {};

    if (error instanceof SubmissionApiError) {
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          const normalizedField = (field.charAt(0).toLowerCase() + field.slice(1)) as keyof typeof nextErrors;
          if (normalizedField in nextErrors || ["submissionIdentifier", "title", "participantId", "conferenceId"].includes(normalizedField)) {
            nextErrors[normalizedField] = messages[0];
          }
        });
      }

      if (error.field) {
        const normalizedField = (error.field.charAt(0).toLowerCase() + error.field.slice(1)) as keyof typeof nextErrors;
        if (["submissionIdentifier", "title", "participantId", "conferenceId"].includes(normalizedField)) {
          nextErrors[normalizedField] = error.message;
        }
      }

      setSubmissionFieldErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) {
        setSaveSubmissionError(error.message);
      }
      return;
    }

    setSubmissionFieldErrors({});
    setSaveSubmissionError(error instanceof Error ? error.message : "Operácia s príspevkom zlyhala");
  };

  const handleSaveParticipation = async () => {
    if (!participantDraft) return;
    if (participantDraft.conferenceEntryId === null && !participantDraft.isStudent) {
      setSaveParticipantError("Vyberte typ účasti alebo študentský status.");
      return;
    }

    setSavingParticipant(true);
    setSaveParticipantError("");
    try {
      let payload = participantDraft;

      if (!payload.conferenceId || payload.conferenceId === 0) {
        const activeConferences = await getActiveConferences();
        const activeConference = activeConferences[0];
        if (!activeConference) {
          throw new Error("Aktívna konferencia nebola nájdená.");
        }
        payload = { ...payload, conferenceId: activeConference.id };
        updateDraft({ conferenceId: activeConference.id });
      }

      const savedParticipant = await updateParticipant(payload);

      const refreshedParticipant = await getParticipantByUserId(currentUser.id);
      applyParticipantState(refreshedParticipant);
      toast.success("Zmeny sú uložené v databáze");
    } catch (error) {
      setSaveParticipantError(error instanceof Error ? error.message : "Uloženie zlyhalo");
    } finally {
      setSavingParticipant(false);
    }
  };

  const handleUploadStudentProof = async () => {
    if (!participantDraft || !participantDraft.id || !currentUser?.id || !studentProofFile) {
      setStudentUploadError("Vyberte súbor na odoslanie.");
      return;
    }

    setUploadingStudentProof(true);
    setStudentUploadError("");
    try {
      let payload = participantDraft;

      if (!payload.conferenceId || payload.conferenceId === 0) {
        const activeConferences = await getActiveConferences();
        const activeConference = activeConferences[0];
        if (!activeConference) {
          throw new Error("Aktívna konferencia nebola nájdená.");
        }
        payload = { ...payload, conferenceId: activeConference.id, isStudent: true };
      } else {
        payload = { ...payload, isStudent: true };
      }

      const savedParticipant = await updateParticipant(payload);
      await uploadParticipantFile(savedParticipant.id, STUDENT_VERIFICATION_FILE_TYPE, studentProofFile);
      const refreshedParticipant = await getParticipantByUserId(currentUser.id);
      applyParticipantState(refreshedParticipant);
      setStudentProofFile(null);
      toast.success("Doklad bol odoslaný na overenie.");
    } catch (error) {
      setStudentUploadError(error instanceof Error ? error.message : "Odoslanie dokladu zlyhalo");
    } finally {
      setUploadingStudentProof(false);
    }
  };

  const handleSaveSubmission = async () => {
    if (!participantDraft?.id) {
      setSaveSubmissionError("Participant nebol načítaný.");
      return;
    }

    if (!participantDraft.conferenceId) {
      setSubmissionFieldErrors({ conferenceId: "Konferencia nebola načítaná." });
      setSaveSubmissionError("Konferencia nebola načítaná.");
      return;
    }

    const nextErrors: Partial<Record<"submissionIdentifier" | "title" | "participantId" | "conferenceId", string>> = {};
    if (!submission.submissionIdentifier.trim()) {
      nextErrors.submissionIdentifier = "ID príspevku je povinné.";
    }
    if (!submission.title.trim()) {
      nextErrors.title = "Názov príspevku je povinný.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionFieldErrors(nextErrors);
      setSaveSubmissionError("");
      return;
    }

    setSavingSubmission(true);
    setSaveSubmissionError("");
    setSubmissionSuccessMessage("");
    setSubmissionFieldErrors({});
    try {
      const payload = {
        participantId: participantDraft.id,
        conferenceId: participantDraft.conferenceId,
        submissionIdentifier: submission.submissionIdentifier.trim(),
        title: submission.title.trim(),
        isPresenting: willPresent,
      };

      const savedSubmission = submissionRecord?.id
        ? await updateSubmission(submissionRecord.id, payload)
        : await createSubmission(payload);

      applySubmissionState(savedSubmission);
      setSubmissionSuccessMessage(submissionRecord?.id ? "Zmeny príspevku boli uložené." : "Príspevok bol vytvorený.");
      toast.success(submissionRecord?.id ? "Zmeny príspevku boli uložené." : "Príspevok bol vytvorený.");
    } catch (error) {
      applySubmissionApiError(error);
    } finally {
      setSavingSubmission(false);
    }
  };

  const handleUploadSubmissionFile = async () => {
    if (!submissionRecord?.id) {
      setSaveSubmissionError("Najprv vytvorte alebo uložte príspevok.");
      return;
    }

    if (!participantDraft?.id || !currentUser?.id || !presentationFile) {
      setSaveSubmissionError("Vyberte súbor na odoslanie.");
      return;
    }

    setUploadingPresentation(true);
    setSaveSubmissionError("");
    try {
      await uploadParticipantFile(participantDraft.id, SUBMISSION_FILE_TYPE, presentationFile);
      const refreshedParticipant = await getParticipantByUserId(currentUser.id);
      applyParticipantState(refreshedParticipant);
      setPresentationFile(null);
      toast.success("Prezentácia bola odoslaná na overenie.");
    } catch (error) {
      setSaveSubmissionError(error instanceof Error ? error.message : "Odoslanie prezentácie zlyhalo");
    } finally {
      setUploadingPresentation(false);
    }
  };

  const conferenceEntryOptions = activeConference?.settings?.conferenceEntries ?? [];
  const selectedConferenceEntry =
    conferenceEntryOptions.find((conferenceEntry) => String(conferenceEntry.id) === selectedConferenceEntryId) ??
    participantDraft?.conferenceEntry ??
    null;

  useEffect(() => {
    if (!participantDraft) return;

    updateDraft({
      conferenceEntryId: selectedConferenceEntryId ? Number(selectedConferenceEntryId) : null,
      conferenceEntry: selectedConferenceEntry,
      isStudent
    });
  }, [selectedConferenceEntryId, selectedConferenceEntry, isStudent]);

  const accommodationOptions = activeConference?.settings?.bookingOptions ?? [];
  const cateringOptions = activeConference?.settings?.foodOptions ?? [];

  useEffect(() => {
    if (!activeConference) return;
    if (selectedConferenceEntryId && !conferenceEntryOptions.some((option) => String(option.id) === selectedConferenceEntryId)) {
      setSelectedConferenceEntryId("");
    }
  }, [activeConference, selectedConferenceEntryId, conferenceEntryOptions]);

  useEffect(() => {
    if (accommodation && !accommodationOptions.some((option) => option.id === accommodation)) {
      setAccommodation(null);
    }
  }, [accommodation, accommodationOptions]);

  useEffect(() => {
    setCatering((currentSelections) =>
      currentSelections.filter((id) => cateringOptions.some((option) => option.id === id))
    );
  }, [cateringOptions]);

  const calculateTotal = () => {
    let total = 0;
    
    // Registration fee
    if (selectedConferenceEntry) {
      total += selectedConferenceEntry.price;
    }

    // Accommodation
    if (accommodation) {
      const option = accommodationOptions.find(o => o.id === accommodation);
      if (option) total += option.price;
    }

    // Catering
    catering.forEach(id => {
      const option = cateringOptions.find(o => o.id === id);
      if (option) total += option.price;
    });

    return total;
  };

  const handleGenerateInvoice = () => {
    // Simulate invoice generation
    setInvoiceGenerated(true);
    setInvoiceStatus("pending");
  };

  const handleDownloadInvoice = () => {
    // Simulate PDF download
    alert("Faktúra sa sťahuje...");
  };

  const conferenceEntryLabel = selectedConferenceEntry?.name || "Nezvolený";

  const studentVerificationFiles = (participantDraft?.fileManagers ?? [])
    .filter((file) => normalizeFileType(file.fileType) === STUDENT_VERIFICATION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const studentVerificationFile = studentVerificationFiles[0] ?? null;
  const studentVerificationStatus = studentVerificationFile
    ? normalizeFileStatus(studentVerificationFile.fileStatus)
    : null;
  const selectedAccommodation = accommodationOptions.find((option) => option.id === accommodation) ?? null;
  const isStudentStatusLocked = Boolean(
    participantDraft?.isStudent &&
      studentVerificationFile &&
      studentVerificationStatus !== REJECTED_STATUS
  );

  const studentStatusLabel = (() => {
    if (!savedIsStudent) return "Nie";
    if (!studentVerificationFile) return "Zvolený, neposlaný";
    if (studentVerificationStatus === WAITING_FOR_APPROVAL_STATUS) return "Čaká na schválenie";
    if (studentVerificationStatus === APPROVED_STATUS) return "Áno";
    if (studentVerificationStatus === REJECTED_STATUS) return "Zamietnutý, pošlite iné potvrdenie";
    return "Zvolený, neschválený";
  })();
  const studentVerificationFileName = studentVerificationFile
    ? studentVerificationFile.originalFileName || studentVerificationFile.fileName
    : "";

  const submissionFiles = (participantDraft?.fileManagers ?? [])
    .filter((file) => normalizeFileType(file.fileType) === SUBMISSION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latestSubmissionFile = submissionFiles[0] ?? null;
  const latestSubmissionFileStatus = latestSubmissionFile
    ? normalizeFileStatus(latestSubmissionFile.fileStatus)
    : null;
  const isSubmissionStatusLocked = Boolean(
    latestSubmissionFile && latestSubmissionFileStatus !== REJECTED_STATUS
  );
  const latestSubmissionFileName = latestSubmissionFile
    ? latestSubmissionFile.originalFileName || latestSubmissionFile.fileName
    : "";
  const submissionStatusLabel = (() => {
    if (!submissionRecord && !latestSubmissionFile) return "Nie";
    if (!latestSubmissionFile) return "Vytvorený";
    if (latestSubmissionFileStatus === WAITING_FOR_APPROVAL_STATUS) return "Čaká na schválenie";
    if (latestSubmissionFileStatus === APPROVED_STATUS) return "Schválené";
    if (latestSubmissionFileStatus === REJECTED_STATUS) return "Zamietnutý";
    return "Vytvorený";
  })();
  const getFileViewUrl = (fileManagerId: number) => `${BASE_URL}/api/file-manager/view/${fileManagerId}`;
  const getFileDownloadUrl = (fileManagerId: number) => `${BASE_URL}/api/file-manager/download/${fileManagerId}`;

  const hasParticipationChanges = Boolean(
    participantDraft &&
      (participantDraft.conferenceEntryId !== savedConferenceEntryId ||
        participantDraft.isStudent !== savedIsStudent)
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vitajte, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2">Správa vašej účasti na konferencii</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Účasť</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold">{conferenceEntryLabel}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Študent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold">{studentStatusLabel}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Príspevok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold">{submissionStatusLabel}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="participation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-2 sm:gap-0">
            <TabsTrigger value="participation" className="text-xs sm:text-sm py-3">
              <User className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Účasť</span>
              <span className="sm:hidden ml-1">Účasť</span>
            </TabsTrigger>
            <TabsTrigger value="submission" className="text-xs sm:text-sm py-3">
              <FileText className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Príspevok</span>
              <span className="sm:hidden ml-1">Príspev.</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm py-3">
              <Hotel className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Služby</span>
              <span className="sm:hidden ml-1">Služby</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="text-xs sm:text-sm py-3">
              <Receipt className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-2">Faktúra</span>
              <span className="sm:hidden ml-1">Faktúra</span>
            </TabsTrigger>
          </TabsList>

          {/* Participation Tab */}
          <TabsContent value="participation">
            <Card>
              <CardHeader>
                <CardTitle>Conference entry</CardTitle>
                <CardDescription>Vyberte si typ vstupu dostupný pre aktívnu konferenciu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {conferenceEntryOptions.length > 0 ? (
                  <RadioGroup value={selectedConferenceEntryId} onValueChange={setSelectedConferenceEntryId}>
                    {conferenceEntryOptions.map((conferenceEntry) => (
                      <Label
                        key={conferenceEntry.id}
                        htmlFor={`conference-entry-${conferenceEntry.id}`}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem
                          value={String(conferenceEntry.id)}
                          id={`conference-entry-${conferenceEntry.id}`}
                          className="size-5 border-2 border-gray-500 data-[state=checked]:border-black"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{conferenceEntry.name}</div>
                        </div>
                        <Badge variant="secondary">{conferenceEntry.price} €</Badge>
                      </Label>
                    ))}
                  </RadioGroup>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pre aktívnu konferenciu zatiaľ nie sú nastavené žiadne conference entry možnosti.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedConferenceEntryId && (
                  <>
                    <div className="border-t border-gray-200" />

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Študentský status</Label>
                      <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="studentStatusDashboard"
                            checked={isStudent}
                            disabled={isStudentStatusLocked}
                            onCheckedChange={(checked) => {
                              const nextIsStudent = checked as boolean;
                              setIsStudent(nextIsStudent);
                              if (!nextIsStudent) {
                                setStudentProofFile(null);
                              }
                            }}
                          />
                          <Label htmlFor="studentStatusDashboard" className="cursor-pointer">
                            Som študent
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">Študentský status podlieha overeniu administrátorom.</p>

                        {isStudentStatusLocked && studentVerificationStatus === WAITING_FOR_APPROVAL_STATUS && (
                          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>Váš dokument čaká na schválenie administrátorom. Zmenu nie je možné vykonať.</p>
                          </div>
                        )}

                        {isStudentStatusLocked && studentVerificationStatus === APPROVED_STATUS && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            Študentský status bol schválený.
                          </div>
                        )}

                        {studentVerificationFile && (
                          <div className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="space-y-1">
                              <Label>Aktuálny doklad</Label>
                              <p className="text-sm break-all text-gray-700">{studentVerificationFileName}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.open(getFileViewUrl(studentVerificationFile.id), "_blank", "noopener,noreferrer")}
                              >
                                Otvoriť
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = getFileDownloadUrl(studentVerificationFile.id);
                                  link.download = studentVerificationFileName;
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                }}
                              >
                                Stiahnuť
                              </Button>
                            </div>
                          </div>
                        )}

                        {isStudent && !isStudentStatusLocked && (
                          <div className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="space-y-1">
                              <Label htmlFor="studentProofDashboard">Overenie študentského statusu</Label>
                              <p className="text-sm text-gray-500">
                                Nahrajte potvrdenie o štúdiu. Ak ho teraz nemáte, môžete ho doplniť neskôr.
                              </p>
                            </div>
                            <Input
                              id="studentProofDashboard"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => setStudentProofFile(e.target.files?.[0] || null)}
                            />
                            <Button
                              type="button"
                              className="w-full sm:w-auto"
                              onClick={handleUploadStudentProof}
                              disabled={!studentProofFile || uploadingStudentProof}
                            >
                              {uploadingStudentProof ? "Odosielam..." : "Odoslať na overenie"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {studentUploadError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{studentUploadError}</AlertDescription>
                        </Alert>
                      )}

                      {saveParticipantError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{saveParticipantError}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="border-t border-gray-200" />

                    <div className="flex justify-center">
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleSaveParticipation}
                        disabled={savingParticipant || !hasParticipationChanges}
                      >
                        Uložiť
                      </Button>
                    </div>

                    {savingParticipant && (
                      <p className="text-sm text-gray-600">Ukladám zmeny...</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission">
            <Card>
              <CardHeader>
                <CardTitle>Odoslanie príspevku</CardTitle>
                <CardDescription>
                  {selectedConferenceEntryId
                    ? "Vyplňte informácie o vašom príspevku"
                    : "Dostupné po výbere conference entry"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedConferenceEntryId ? (
                  <>
                    {submissionLoading && (
                      <p className="text-sm text-gray-600">Načítavam príspevok...</p>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="submissionIdentifier">ID príspevku *</Label>
                        <Input
                          id="submissionIdentifier"
                          value={submission.submissionIdentifier}
                          onChange={(e) => setSubmission({ ...submission, submissionIdentifier: e.target.value })}
                          placeholder="ID vášho príspevku"
                          aria-invalid={Boolean(submissionFieldErrors.submissionIdentifier)}
                        />
                        {submissionFieldErrors.submissionIdentifier && (
                          <p className="text-sm text-red-600">{submissionFieldErrors.submissionIdentifier}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Názov príspevku *</Label>
                        <Input
                          id="title"
                          value={submission.title}
                          onChange={(e) => setSubmission({...submission, title: e.target.value})}
                          placeholder="Názov vášho príspevku"
                          aria-invalid={Boolean(submissionFieldErrors.title)}
                        />
                        {submissionFieldErrors.title && (
                          <p className="text-sm text-red-600">{submissionFieldErrors.title}</p>
                        )}
                      </div>

                      <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="willPresent" 
                            checked={willPresent}
                            disabled={isSubmissionStatusLocked}
                            onCheckedChange={(checked) => {
                              const nextValue = checked as boolean;
                              setWillPresent(nextValue);
                              if (!nextValue) {
                                setPresentationFile(null);
                              }
                            }}
                          />
                          <Label htmlFor="willPresent">Som prezentér</Label>
                        </div>

                        {isSubmissionStatusLocked && latestSubmissionFileStatus === WAITING_FOR_APPROVAL_STATUS && (
                          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>Vaša prezentácia čaká na schválenie administrátorom. Zmenu nie je možné vykonať.</p>
                          </div>
                        )}

                        {isSubmissionStatusLocked && latestSubmissionFileStatus === APPROVED_STATUS && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            Prezentácia bola schválená.
                          </div>
                        )}

                        {latestSubmissionFileStatus === REJECTED_STATUS && (
                          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            Prezentácia bola zamietnutá. Nahrajte novú verziu.
                          </div>
                        )}

                        {latestSubmissionFile && (
                          <div className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="space-y-1">
                              <Label>Aktuálna prezentácia</Label>
                              <p className="text-sm break-all text-gray-700">{latestSubmissionFileName}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.open(getFileViewUrl(latestSubmissionFile.id), "_blank", "noopener,noreferrer")}
                              >
                                Otvoriť
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = getFileDownloadUrl(latestSubmissionFile.id);
                                  link.download = latestSubmissionFileName;
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                }}
                              >
                                Stiahnuť
                              </Button>
                            </div>
                          </div>
                        )}

                        {willPresent && !isSubmissionStatusLocked && (
                          <div className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="space-y-1">
                              <Label htmlFor="presentationUpload">Prezentácia</Label>
                              <p className="text-sm text-gray-500">
                                Nahrajte prezentáciu. Ak ju ešte nemáte pripravenú, môžete ju doplniť neskôr.
                              </p>
                            </div>
                            {!submissionRecord?.id && (
                              <Alert className="border-blue-200 bg-blue-50">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-900">
                                  Najprv vytvorte alebo uložte príspevok, potom môžete odoslať prezentáciu.
                                </AlertDescription>
                              </Alert>
                            )}
                            <Input
                              id="presentationUpload"
                              type="file"
                              accept=".pdf,.ppt,.pptx"
                              onChange={(e) => setPresentationFile(e.target.files?.[0] || null)}
                            />
                            {presentationFile && (
                              <p className="text-sm text-gray-600">{presentationFile.name}</p>
                            )}
                            <Button
                              type="button"
                              className="w-full sm:w-auto"
                              onClick={handleUploadSubmissionFile}
                              disabled={!presentationFile || uploadingPresentation || !submissionRecord?.id}
                            >
                              {uploadingPresentation ? "Odosielam..." : "Odoslať na overenie"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {submissionSuccessMessage && (
                        <Alert className="border-emerald-200 bg-emerald-50">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <AlertDescription className="text-emerald-900">
                            {submissionSuccessMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      {saveSubmissionError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{saveSubmissionError}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="button" className="w-full" onClick={handleSaveSubmission} disabled={savingSubmission || submissionLoading}>
                        {savingSubmission
                          ? "Ukladám..."
                          : submissionRecord?.id
                            ? "Uložiť zmeny"
                            : "Vytvoriť príspevok"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pre odoslanie príspevku musíte vybrať typ účasti "Účastník s príspevkom"
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="w-5 h-5" />
                    Ubytovanie
                  </CardTitle>
                  <CardDescription>Vyberte si ubytovanie dostupné pre aktívnu konferenciu</CardDescription>
                </CardHeader>
                <CardContent>
                  {accommodationOptions.length > 0 ? (
                    <RadioGroup value={accommodation?.toString()} onValueChange={(val) => setAccommodation(parseInt(val, 10))}>
                      {accommodationOptions.map((option) => (
                        <Label
                          key={option.id}
                          htmlFor={`accom-${option.id}`}
                          className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <RadioGroupItem value={option.id.toString()} id={`accom-${option.id}`} className="mt-1" />
                          <div className="flex-1">
                            <div className="font-semibold">{option.name}</div>
                            <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDateRange(option.startDate, option.endDate)}
                            </p>
                          </div>
                          <Badge variant="secondary">{option.price} €</Badge>
                        </Label>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti ubytovania.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Stravovanie
                  </CardTitle>
                  <CardDescription>Vyberte si stravovanie počas konferencie</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cateringOptions.length > 0 ? (
                    cateringOptions.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`catering-${option.id}`}
                        className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <Checkbox
                          id={`catering-${option.id}`}
                          checked={catering.includes(option.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCatering([...catering, option.id]);
                            } else {
                              setCatering(catering.filter(id => id !== option.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{option.name}</div>
                          <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{getFoodTypeLabel(option.foodOptionsType)}</span>
                            <span>•</span>
                            <span>{formatDate(option.date)}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{option.price} €</Badge>
                      </Label>
                    ))
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti stravovania.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faktúra</CardTitle>
                  <CardDescription>Prehľad nákladov a vygenerovanie faktúry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invoice Type Selection */}
                  {!invoiceGenerated && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Typ faktúry</Label>
                        <RadioGroup value={invoiceType} onValueChange={(val: any) => setInvoiceType(val)}>
                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="individual" id="individual" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="individual" className="font-semibold cursor-pointer">
                                Samostatná faktúra
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">Faktúra len pre vás</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="create-shared" id="create-shared" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="create-shared" className="font-semibold cursor-pointer flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Vytvoriť zdieľanú faktúru
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Vygenerujete kód, ktorý môžu použiť ostatní účastníci aby sa pripojili k vašej faktúre
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="join-shared" id="join-shared" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="join-shared" className="font-semibold cursor-pointer">
                                Pripojiť sa k zdieľanej faktúre
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Zadajte kód od iného účastníka, vaše položky sa pripočítajú k jeho faktúre
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Join Shared Invoice - Enter Code */}
                      {invoiceType === "join-shared" && (
                        <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <Label htmlFor="joinCode">Zadajte kód zdieľanej faktúry</Label>
                          <div className="flex gap-2">
                            <Input
                              id="joinCode"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                              placeholder="Napr. CONF-AB12CD"
                              className="font-mono bg-white"
                            />
                            <Button variant="outline" disabled={!joinCode}>
                              Pripojiť
                            </Button>
                          </div>
                          <p className="text-sm text-blue-700">
                            Po pripojení sa vaše položky automaticky zarátajú do spoločnej faktúry
                          </p>
                        </div>
                      )}

                      {/* Custom Billing Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customBilling"
                            checked={hasCustomBilling}
                            onCheckedChange={(checked) => setHasCustomBilling(checked as boolean)}
                          />
                          <Label htmlFor="customBilling" className="font-semibold cursor-pointer">
                            Zadať vlastné fakturačné údaje (firemná faktúra)
                          </Label>
                        </div>

                        {hasCustomBilling && (
                          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Názov spoločnosti *</Label>
                              <Input
                                id="companyName"
                                value={billingInfo.companyName}
                                onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                                placeholder="Názov vašej spoločnosti"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="ico">IČO *</Label>
                                <Input
                                  id="ico"
                                  value={billingInfo.ico}
                                  onChange={(e) => setBillingInfo({ ...billingInfo, ico: e.target.value })}
                                  placeholder="12345678"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dic">DIČ</Label>
                                <Input
                                  id="dic"
                                  value={billingInfo.dic}
                                  onChange={(e) => setBillingInfo({ ...billingInfo, dic: e.target.value })}
                                  placeholder="1234567890"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="address">Adresa *</Label>
                              <Textarea
                                id="address"
                                value={billingInfo.address}
                                onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                                placeholder="Ulica 123, 811 01 Bratislava"
                                rows={2}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cost Summary */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Súhrn nákladov</h3>
                    <div className="space-y-2 text-sm">
                      {selectedConferenceEntryId && (
                        <div className="flex justify-between py-2 border-b">
                          <span>
                            Registračný poplatok ({conferenceEntryLabel})
                          </span>
                          <span className="font-semibold whitespace-nowrap">
                            {selectedConferenceEntry?.price ?? 0} €
                          </span>
                        </div>
                      )}
                      {selectedAccommodation && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="break-words">{selectedAccommodation.name}</span>
                          <span className="font-semibold whitespace-nowrap">
                            {selectedAccommodation.price} €
                          </span>
                        </div>
                      )}
                      {catering.map(id => {
                        const option = cateringOptions.find(o => o.id === id);
                        if (!option) return null;
                        return (
                          <div key={id} className="flex justify-between py-2 border-b gap-4">
                            <span className="break-words">{option.name}</span>
                            <span className="font-semibold whitespace-nowrap">{option.price} €</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between py-3 border-t-2 text-base sm:text-lg font-bold">
                        <span>Celkom</span>
                        <span>{calculateTotal()} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Generate Invoice Button */}
                  {!invoiceGenerated ? (
                    <Button 
                      onClick={() => {
                        handleGenerateInvoice();
                        if (invoiceType === "create-shared") {
                          // Generate random code
                          const code = "CONF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
                          setSharedInvoiceCode(code);
                        }
                      }} 
                      className="w-full" 
                      size="lg"
                      disabled={!selectedConferenceEntryId || (invoiceType === "join-shared" && !joinCode)}
                    >
                      Vygenerovať faktúru
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {/* Shared Invoice Code Display */}
                      {invoiceType === "create-shared" && sharedInvoiceCode && (
                        <Alert className="bg-blue-50 border-blue-200">
                          <Users className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-900">
                            <div className="space-y-2">
                              <p className="font-semibold">Kód zdieľanej faktúry:</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="px-3 py-2 bg-white border rounded font-mono text-base sm:text-lg font-bold">
                                  {sharedInvoiceCode}
                                </code>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sharedInvoiceCode);
                                    alert("Kód skopírovaný!");
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm">Zdieľajte tento kód s ostatnými účastníkmi</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {invoiceType === "join-shared" && joinCode && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-900">
                            Úspešne ste sa pripojili k faktúre <strong>{joinCode}</strong>. Vaše položky sú súčasťou spoločnej faktúry.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Invoice Status */}
                      <Alert className={invoiceStatus === "paid" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
                        {invoiceStatus === "paid" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-900">
                              Faktúra bola zaplatená. Ďakujeme!
                            </AlertDescription>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-900">
                              Faktúra čaká na zaplatenie. Číslo faktúry: <strong>INV-2026-001</strong>
                            </AlertDescription>
                          </>
                        )}
                      </Alert>

                      <Button onClick={handleDownloadInvoice} variant="outline" className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Stiahnuť faktúru (PDF)
                      </Button>

                      {invoiceStatus === "pending" && (
                        <div className="p-4 bg-gray-50 rounded-lg text-sm">
                          <h4 className="font-semibold mb-2">Pokyny na zaplatenie:</h4>
                          <p className="text-gray-600">
                            Platbu prosím zašlite na účet:<br />
                            <strong>SK31 1200 0000 1987 4263 7541</strong><br />
                            Variabilný symbol: <strong>2026001</strong>
                            {invoiceType === "create-shared" && (
                              <>
                                <br /><br />
                                <em>Pri zdieľanej faktúre platí celú sumu jeden účastník.</em>
                              </>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
