import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "../components/ui/dialog.tsx";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../components/ui/table.tsx";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "../components/ui/select.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import {
  Plus, Check, Clock, Download, Building2,
  Pencil, Trash2, Users, Receipt, UtensilsCrossed, Hotel, FolderTree, ChevronDown, ChevronRight
} from "lucide-react";
import {
  getAllConferences,
  createConference,
  updateConference,
  deleteConference,
  createConferenceSettings,
  createConferenceEntries,
  updateConferenceEntry,
  deleteConferenceEntry,
  updateConferenceImportantDate,
  deleteConferenceImportantDate,
  createConferenceFoodOptions,
  updateConferenceFoodOption,
  deleteConferenceFoodOption,
  createConferenceBookingOptions,
  updateConferenceBookingOption,
  deleteConferenceBookingOption,
  replaceConferenceProgram,
  type ConferenceSettings,
  type ImportantDate,
  type ConferenceEntry,
  type FoodOption,
  type FoodOptionType,
  type BookingOption,
  type ProgramDay,
  type ProgramItem,
  type ProgramItemType,
  type ProgramSession,
  type ProgramPresentation
} from "../api/conferenceApi.ts";
import { getParticipantsByActiveConference, type FileManagerPayload } from "../api/participantApi.ts";
import { BASE_URL } from "../api/baseApi.ts";
import { approveFileManager, rejectFileManager } from "../api/fileManagerApi.ts";
import { toast } from "sonner";

type Conference = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  participantsCount: number;
  settings?: ConferenceSettings | null;
};

type ImportantDateCreateForm = {
  label: string;
  normalDate: string;
};

type ImportantDateUpdateForm = {
  id: number;
  label: string;
  normalDate: string;
  updatedDate: string;
};

type ConferenceEntryCreateForm = {
  name: string;
  price: string;
};

type ConferenceEntryUpdateForm = ConferenceEntryCreateForm & {
  id: number;
};

type FoodOptionCreateForm = {
  name: string;
  description: string;
  date: string;
  price: string;
  foodOptionsType: FoodOptionType;
};

type FoodOptionUpdateForm = FoodOptionCreateForm & {
  id: number;
};

type BookingOptionCreateForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: string;
};

type BookingOptionUpdateForm = BookingOptionCreateForm & {
  id: number;
};

type ProgramPresentationForm = {
  clientId: string;
  startTime: string;
  endTime: string;
  authors: string;
  title: string;
};

type ProgramSessionForm = {
  clientId: string;
  sessionName: string;
  startTime: string;
  endTime: string;
  chair: string;
  presentations: ProgramPresentationForm[];
};

type ProgramItemForm = {
  clientId: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  speaker: string;
  chair: string;
  type: ProgramItemType;
  sessions: ProgramSessionForm[];
};

type ProgramDayForm = {
  clientId: string;
  label: string;
  date: string;
  items: ProgramItemForm[];
};

type Participant = {
  id: number;
  firstName: string;
  lastName: string;
  conferenceEntryId: number | null;
  conferenceEntry?: ConferenceEntry | null;
  isStudent: boolean;
  isPresenting?: boolean | null;
  fileManagers: FileManagerPayload[];
  email: string;
  phone: string;
  affiliation: string;
  country: string;
  type: string;
  registrationDate: string;
  invoiceStatus?: "pending" | "paid" | "none";
};

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

const getLatestStudentVerificationFile = (participant: Participant) => {
  return participant.fileManagers
    .filter((file) => normalizeFileType(file.fileType) === STUDENT_VERIFICATION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
};

const getConferenceEntryLabel = (conferenceEntry?: ConferenceEntry | null) => {
  return conferenceEntry?.name?.trim() || "Nezvolený";
};

const parseDecimalValue = (value: string) => {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return Number.NaN;
  return Number.parseFloat(normalized);
};

const getLatestSubmissionFile = (participant: Participant) => {
  return participant.fileManagers
    .filter((file) => normalizeFileType(file.fileType) === SUBMISSION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
};

const getStudentLabel = (participant: Participant) => {
  if (!participant.isStudent) return "Nie";
  const latestStudentFile = getLatestStudentVerificationFile(participant);
  if (!latestStudentFile) return "Zvolený, neschválený";

  const latestStudentFileStatus = normalizeFileStatus(latestStudentFile.fileStatus);
  if (latestStudentFileStatus === WAITING_FOR_APPROVAL_STATUS) return "Čaká na schválenie";
  if (latestStudentFileStatus === APPROVED_STATUS) return "Schválené";
  if (latestStudentFileStatus === REJECTED_STATUS) return "Zamietnutý";
  return "Zvolený, neschválený";
};

const getSubmissionLabel = (participant: Participant) => {
  const latestSubmissionFile = getLatestSubmissionFile(participant);
  if (!participant.isPresenting && !latestSubmissionFile) return "Nie";
  if (!latestSubmissionFile) return "Zvolený, neposlaný";

  const latestSubmissionFileStatus = normalizeFileStatus(latestSubmissionFile.fileStatus);
  if (latestSubmissionFileStatus === WAITING_FOR_APPROVAL_STATUS) return "Čaká na schválenie";
  if (latestSubmissionFileStatus === APPROVED_STATUS) return "Schválené";
  if (latestSubmissionFileStatus === REJECTED_STATUS) return "Zamietnutý";
  return "Zvolený, neposlaný";
};

const getStudentStatusBadgeClass = (participant: Participant) => {
  const label = getStudentLabel(participant);
  if (label === "Schválené") return "bg-green-100 text-green-800 border-green-200";
  if (label === "Čaká na schválenie") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (label === "Zamietnutý") return "bg-red-100 text-red-800 border-red-200";
  if (label === "Zvolený, neschválený") return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getSubmissionStatusBadgeClass = (participant: Participant) => {
  const label = getSubmissionLabel(participant);
  if (label === "Schválené") return "bg-green-100 text-green-800 border-green-200";
  if (label === "Čaká na schválenie") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (label === "Zamietnutý") return "bg-red-100 text-red-800 border-red-200";
  if (label === "Zvolený, neposlaný") return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getStudentFileHistory = (participant: Participant) =>
  participant.fileManagers
    .filter((file) => normalizeFileType(file.fileType) === STUDENT_VERIFICATION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const getSubmissionFileHistory = (participant: Participant) =>
  participant.fileManagers
    .filter((file) => normalizeFileType(file.fileType) === SUBMISSION_FILE_TYPE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const getFileStatusLabel = (file: FileManagerPayload) => {
  const status = normalizeFileStatus(file.fileStatus);
  if (status === WAITING_FOR_APPROVAL_STATUS) return "Čaká na schválenie";
  if (status === APPROVED_STATUS) return "Schválené";
  if (status === REJECTED_STATUS) return "Zamietnutý";
  return "Neznámy";
};

const getFileStatusBadgeClass = (file: FileManagerPayload) => {
  const label = getFileStatusLabel(file);
  if (label === "Schválené") return "bg-green-100 text-green-800 border-green-200";
  if (label === "Čaká na schválenie") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (label === "Zamietnutý") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const isImageFile = (fileName: string) => {
  const name = fileName.toLowerCase();
  return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");
};

const normalizeFoodOptionType = (value?: FoodOptionType | string | null): FoodOptionType => {
  const normalizedValue = typeof value === "string" ? Number(value) : value;
  if (normalizedValue === 1) return 1;
  if (normalizedValue === 2) return 2;
  return 0;
};

const mapImportantDatesToEditForm = (importantDates?: ImportantDate[] | null): ImportantDateUpdateForm[] => {
  if (!importantDates || importantDates.length === 0) {
    return [{ id: 0, label: "", normalDate: "", updatedDate: "" }];
  }

  return importantDates.map((importantDate) => ({
    id: importantDate.id,
    label: importantDate.label ?? "",
    normalDate: importantDate.normalDate,
    updatedDate: importantDate.updatedDate ?? "",
  }));
};

const mapConferenceEntriesToEditForm = (conferenceEntries?: ConferenceEntry[] | null): ConferenceEntryUpdateForm[] => {
  if (!conferenceEntries || conferenceEntries.length === 0) {
    return [];
  }

  return conferenceEntries.map((conferenceEntry) => ({
    id: conferenceEntry.id,
    name: conferenceEntry.name ?? "",
    price: String(conferenceEntry.price ?? "")
  }));
};

const mapFoodOptionsToEditForm = (foodOptions?: FoodOption[] | null): FoodOptionUpdateForm[] => {
  if (!foodOptions || foodOptions.length === 0) {
    return [];
  }

  return foodOptions.map((foodOption) => ({
    id: foodOption.id,
    name: foodOption.name ?? "",
    description: foodOption.description ?? "",
    date: foodOption.date ?? "",
    price: String(foodOption.price ?? ""),
    foodOptionsType: normalizeFoodOptionType(foodOption.foodOptionsType)
  }));
};

const mapBookingOptionsToEditForm = (bookingOptions?: BookingOption[] | null): BookingOptionUpdateForm[] => {
  if (!bookingOptions || bookingOptions.length === 0) {
    return [];
  }

  return bookingOptions.map((bookingOption) => ({
    id: bookingOption.id,
    name: bookingOption.name ?? "",
    description: bookingOption.description ?? "",
    startDate: bookingOption.startDate ?? "",
    endDate: bookingOption.endDate ?? "",
    price: String(bookingOption.price ?? "")
  }));
};

const createEmptyFoodOptionForm = (): FoodOptionCreateForm => ({
  name: "",
  description: "",
  date: "",
  price: "",
  foodOptionsType: 0
});

const createEmptyBookingOptionForm = (): BookingOptionCreateForm => ({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  price: ""
});

const createEmptyConferenceEntryForm = (): ConferenceEntryCreateForm => ({
  name: "",
  price: ""
});

const createClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeTimeValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 5);
};

const createEmptyProgramPresentation = (): ProgramPresentationForm => ({
  clientId: createClientId(),
  startTime: "",
  endTime: "",
  authors: "",
  title: ""
});

const createEmptyProgramSession = (): ProgramSessionForm => ({
  clientId: createClientId(),
  sessionName: "",
  startTime: "",
  endTime: "",
  chair: "",
  presentations: [createEmptyProgramPresentation()]
});

const createEmptyProgramItem = (): ProgramItemForm => ({
  clientId: createClientId(),
  title: "",
  startTime: "",
  endTime: "",
  location: "",
  speaker: "",
  chair: "",
  type: 0,
  sessions: []
});

const createEmptyProgramDay = (): ProgramDayForm => ({
  clientId: createClientId(),
  label: "",
  date: "",
  items: [createEmptyProgramItem()]
});

const sortProgramPresentations = (presentations?: ProgramPresentation[] | null) =>
  [...(presentations ?? [])].sort((left, right) => left.order - right.order);

const sortProgramSessions = (sessions?: ProgramSession[] | null) =>
  [...(sessions ?? [])].sort((left, right) => left.order - right.order);

const sortProgramItems = (items?: ProgramItem[] | null) =>
  [...(items ?? [])].sort((left, right) => left.order - right.order);

const sortProgramDays = (days?: ProgramDay[] | null) =>
  [...(days ?? [])].sort((left, right) => left.order - right.order);

const mapProgramDaysToForm = (programDays?: ProgramDay[] | null): ProgramDayForm[] => {
  const sortedDays = sortProgramDays(programDays);
  if (sortedDays.length === 0) {
    return [createEmptyProgramDay()];
  }

  return sortedDays.map((programDay) => ({
    clientId: `day-${programDay.id}`,
    label: programDay.label ?? "",
    date: programDay.date ?? "",
    items: sortProgramItems(programDay.programItems).map((item) => ({
      clientId: `item-${item.id}`,
      title: item.title ?? "",
      startTime: normalizeTimeValue(item.startTime),
      endTime: normalizeTimeValue(item.endTime),
      location: item.location ?? "",
      speaker: item.speaker ?? "",
      chair: item.chair ?? "",
      type: item.type,
      sessions: sortProgramSessions(item.sessions).map((session) => ({
        clientId: `session-${session.id}`,
        sessionName: session.sessionName ?? "",
        startTime: normalizeTimeValue(session.startTime),
        endTime: normalizeTimeValue(session.endTime),
        chair: session.chair ?? "",
        presentations: sortProgramPresentations(session.presentations).map((presentation) => ({
          clientId: `presentation-${presentation.id}`,
          startTime: normalizeTimeValue(presentation.startTime),
          endTime: normalizeTimeValue(presentation.endTime),
          authors: presentation.authors ?? "",
          title: presentation.title ?? ""
        }))
      }))
    }))
  }));
};

const getProgramItemTypeLabel = (type: ProgramItemType) => {
  if (type === 0) return "registration";
  if (type === 1) return "opening";
  if (type === 2) return "keynote";
  if (type === 3) return "parallel";
  if (type === 4) return "session";
  if (type === 5) return "workshop";
  if (type === 6) return "panel";
  if (type === 7) return "break";
  if (type === 8) return "social";
  if (type === 9) return "poster";
  return "closing";
};

type Invoice = {
  id: number;
  invoiceNumber: string;
  participantIds: number[];
  amount: number;
  status: "pending" | "paid";
  billingInfo: {
    companyName: string;
    ico: string;
    dic: string;
    address: string;
  };
  createdDate: string;
};

export function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: "INV-2026-001",
      participantIds: [1],
      amount: 100,
      status: "pending",
      billingInfo: {
        companyName: "Slovak University of Technology",
        ico: "12345678",
        dic: "1234567890",
        address: "Vazovova 5, 812 43 Bratislava",
      },
      createdDate: "2026-02-01",
    },
    {
      id: 2,
      invoiceNumber: "INV-2026-002",
      participantIds: [2],
      amount: 100,
      status: "paid",
      billingInfo: {
        companyName: "Comenius University",
        ico: "87654321",
        dic: "0987654321",
        address: "Šafárikovo nám. 6, 814 99 Bratislava",
      },
      createdDate: "2026-02-05",
    },
  ]);

  // Dialog states
  const [newConferenceDialog, setNewConferenceDialog] = useState(false);
  const [editConferenceDialog, setEditConferenceDialog] = useState(false);
  const [importantDatesDialog, setImportantDatesDialog] = useState(false);
  const [conferenceEntriesDialog, setConferenceEntriesDialog] = useState(false);
  const [foodOptionsDialog, setFoodOptionsDialog] = useState(false);
  const [bookingOptionsDialog, setBookingOptionsDialog] = useState(false);
  const [programDialog, setProgramDialog] = useState(false);
  const [deleteConfDialog, setDeleteConfDialog] = useState<number | null>(null);
  const [editParticipantDialog, setEditParticipantDialog] = useState(false);
  const [studentFileDialog, setStudentFileDialog] = useState(false);
  const [studentFileParticipant, setStudentFileParticipant] = useState<Participant | null>(null);
  const [studentStatusActionLoading, setStudentStatusActionLoading] = useState<"approve" | "reject" | null>(null);
  const [submissionFileDialog, setSubmissionFileDialog] = useState(false);
  const [submissionFileParticipant, setSubmissionFileParticipant] = useState<Participant | null>(null);
  const [submissionStatusActionLoading, setSubmissionStatusActionLoading] = useState<"approve" | "reject" | null>(null);
  const [deletePartDialog, setDeletePartDialog] = useState<number | null>(null);
  const [newInvoiceDialog, setNewInvoiceDialog] = useState(false);
  const [editInvoiceDialog, setEditInvoiceDialog] = useState(false);
  const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState<number | null>(null);

  // Form data
  const [newConference, setNewConference] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [editConference, setEditConference] = useState<Conference | null>(null);
  const [importantDatesConference, setImportantDatesConference] = useState<Conference | null>(null);
  const [conferenceEntriesConference, setConferenceEntriesConference] = useState<Conference | null>(null);
  const [foodOptionsConference, setFoodOptionsConference] = useState<Conference | null>(null);
  const [bookingOptionsConference, setBookingOptionsConference] = useState<Conference | null>(null);
  const [programConference, setProgramConference] = useState<Conference | null>(null);
  const [editImportantDates, setEditImportantDates] = useState<ImportantDateUpdateForm[]>([
    { id: 0, label: "", normalDate: "", updatedDate: "" }
  ]);
  const [additionalImportantDates, setAdditionalImportantDates] = useState<ImportantDateCreateForm[]>([
    { label: "", normalDate: "" }
  ]);
  const [editConferenceEntries, setEditConferenceEntries] = useState<ConferenceEntryUpdateForm[]>([]);
  const [additionalConferenceEntries, setAdditionalConferenceEntries] = useState<ConferenceEntryCreateForm[]>([
    createEmptyConferenceEntryForm()
  ]);
  const [editFoodOptions, setEditFoodOptions] = useState<FoodOptionUpdateForm[]>([]);
  const [additionalFoodOptions, setAdditionalFoodOptions] = useState<FoodOptionCreateForm[]>([
    createEmptyFoodOptionForm()
  ]);
  const [editBookingOptions, setEditBookingOptions] = useState<BookingOptionUpdateForm[]>([]);
  const [additionalBookingOptions, setAdditionalBookingOptions] = useState<BookingOptionCreateForm[]>([
    createEmptyBookingOptionForm()
  ]);
  const [programDaysForm, setProgramDaysForm] = useState<ProgramDayForm[]>([createEmptyProgramDay()]);
  const [programExpanded, setProgramExpanded] = useState<Record<string, boolean>>({});
  const [editParticipant, setEditParticipant] = useState<Participant | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    setCurrentUser(userData);
  }, [navigate]);

  useEffect(() => {
    loadConferences();
    loadParticipants();
  }, []);

  const loadConferences = async () => {
    try {
      const data = await getAllConferences();
      const normalized = Array.isArray(data)
        ? data.map((conf) => ({
            ...conf,
            participantsCount: conf.participantsCount ?? 0
          }))
        : [];
      setConferences(normalized);
    } catch (error) {
      console.error("Failed to load conferences", error);
    }
  };

  const loadParticipants = async (): Promise<Participant[]> => {
    try {
      const data = await getParticipantsByActiveConference();
      const normalized = Array.isArray(data)
        ? data.map((participant) => {
            const registrationDateRaw = participant.createdAt ?? "";
            const registrationDate = registrationDateRaw
              ? registrationDateRaw.split("T")[0]
              : "-";

            return {
              id: participant.id,
              firstName: participant.firstName ?? "",
              lastName: participant.lastName ?? "",
              conferenceEntryId: participant.conferenceEntryId,
              conferenceEntry: participant.conferenceEntry ?? null,
              isStudent: participant.isStudent,
              isPresenting: participant.isPresenting ?? false,
              fileManagers: participant.fileManagers ?? [],
              email: participant.user?.email ?? "",
              phone: participant.phone ?? "",
              affiliation: participant.affiliation ?? "",
              country: participant.country ?? "",
              type: participant.isStudent ? "student" : "participant",
              registrationDate,
              invoiceStatus: "none" as const
            };
          })
        : [];

      setParticipants(normalized);
      return normalized;
    } catch (error) {
      console.error("Failed to load participants", error);
      setParticipants([]);
      return [];
    }
  };

  const normalizedEditImportantDates = editImportantDates
    .map((importantDate) => ({
      id: importantDate.id,
      label: importantDate.label.trim(),
      updatedDate: importantDate.updatedDate.trim() || null
    }))
    .filter((importantDate) => importantDate.id > 0 && importantDate.label);

  const normalizedAdditionalImportantDates = additionalImportantDates
    .map((importantDate) => ({
      label: importantDate.label.trim(),
      normalDate: importantDate.normalDate.trim()
    }))
    .filter((importantDate) => importantDate.label && importantDate.normalDate);

  const normalizedEditConferenceEntries = editConferenceEntries
    .map((conferenceEntry) => ({
      id: conferenceEntry.id,
      name: conferenceEntry.name.trim(),
      price: parseDecimalValue(conferenceEntry.price)
    }))
    .filter((conferenceEntry) => conferenceEntry.id > 0 && conferenceEntry.name && Number.isFinite(conferenceEntry.price));

  const normalizedAdditionalConferenceEntries = additionalConferenceEntries
    .map((conferenceEntry) => ({
      name: conferenceEntry.name.trim(),
      price: parseDecimalValue(conferenceEntry.price)
    }))
    .filter((conferenceEntry) => conferenceEntry.name && Number.isFinite(conferenceEntry.price));

  const normalizedEditFoodOptions = editFoodOptions
    .map((foodOption) => ({
      id: foodOption.id,
      name: foodOption.name.trim(),
      description: foodOption.description.trim(),
      date: foodOption.date,
      price: Number(foodOption.price),
      foodOptionsType: foodOption.foodOptionsType
    }))
    .filter((foodOption) => foodOption.id > 0 && foodOption.name && foodOption.description && foodOption.date && Number.isFinite(foodOption.price));

  const normalizedAdditionalFoodOptions = additionalFoodOptions
    .map((foodOption) => ({
      name: foodOption.name.trim(),
      description: foodOption.description.trim(),
      date: foodOption.date,
      price: Number(foodOption.price),
      foodOptionsType: foodOption.foodOptionsType
    }))
    .filter((foodOption) => foodOption.name && foodOption.description && foodOption.date && Number.isFinite(foodOption.price));

  const normalizedEditBookingOptions = editBookingOptions
    .map((bookingOption) => ({
      id: bookingOption.id,
      name: bookingOption.name.trim(),
      description: bookingOption.description.trim(),
      startDate: bookingOption.startDate,
      endDate: bookingOption.endDate,
      price: Number(bookingOption.price)
    }))
    .filter((bookingOption) =>
      bookingOption.id > 0 &&
      bookingOption.name &&
      bookingOption.description &&
      bookingOption.startDate &&
      bookingOption.endDate &&
      Number.isFinite(bookingOption.price)
    );

  const normalizedAdditionalBookingOptions = additionalBookingOptions
    .map((bookingOption) => ({
      name: bookingOption.name.trim(),
      description: bookingOption.description.trim(),
      startDate: bookingOption.startDate,
      endDate: bookingOption.endDate,
      price: Number(bookingOption.price)
    }))
    .filter((bookingOption) =>
      bookingOption.name &&
      bookingOption.description &&
      bookingOption.startDate &&
      bookingOption.endDate &&
      Number.isFinite(bookingOption.price)
    );

  const handleCreateConference = async () => {
    if (!newConference.name || !newConference.startDate || !newConference.endDate) return;
    try {
      const conference = await createConference({
        name: newConference.name,
        description: newConference.description,
        startDate: newConference.startDate,
        endDate: newConference.endDate,
        location: newConference.location
      });
      setNewConferenceDialog(false);
      setNewConference({ name: "", description: "", startDate: "", endDate: "", location: "" });
      toast.success("Konferencia bola vytvorená.");
      loadConferences();
    } catch (error) {
      console.error("Failed to create conference", error);
      toast.error("Vytvorenie konferencie zlyhalo.");
    }
  };

  const handleUpdateConference = async () => {
    if (!editConference) return;
    try {
      await updateConference(editConference.id, {
        name: editConference.name,
        description: editConference.description,
        startDate: editConference.startDate,
        endDate: editConference.endDate,
        location: editConference.location,
        isActive: editConference.isActive
      });
      setEditConferenceDialog(false);
      setEditConference(null);
      toast.success("Konferencia bola upravená.");
      loadConferences();
    } catch (error) {
      console.error("Failed to update conference", error);
      toast.error("Úprava konferencie zlyhala.");
    }
  };

  const handleDeleteConference = async (id: number) => {
    try {
      await deleteConference(id);
      setDeleteConfDialog(null);
      loadConferences();
    } catch (error) {
      console.error("Failed to delete conference", error);
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      await Promise.all(
        conferences.map((conf) =>
          updateConference(conf.id, {
            name: conf.name,
            description: conf.description,
            startDate: conf.startDate,
            endDate: conf.endDate,
            location: conf.location,
            isActive: conf.id === id
          })
        )
      );
      loadConferences();
    } catch (error) {
      console.error("Failed to set active conference", error);
    }
  };

  const handleUpdateParticipant = () => {
    if (editParticipant) {
      setParticipants(participants.map(p =>
        p.id === editParticipant.id ? editParticipant : p
      ));
      setEditParticipantDialog(false);
      setEditParticipant(null);
    }
  };

  const handleDeleteParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id));
    setDeletePartDialog(null);
  };

  const handleUpdateInvoiceStatus = (participantId: number, status: "pending" | "paid") => {
    setParticipants(participants.map(p =>
      p.id === participantId ? { ...p, invoiceStatus: status } : p
    ));
  };

  const handleCreateInvoice = () => {
    const newInvoice: Invoice = {
      id: Math.max(...invoices.map(i => i.id), 0) + 1,
      invoiceNumber: `INV-2026-${String(newInvoice.id).padStart(3, '0')}`,
      participantIds: [],
      amount: 100,
      status: "pending",
      billingInfo: {
        companyName: "",
        ico: "",
        dic: "",
        address: "",
      },
      createdDate: new Date().toISOString().split('T')[0],
    };
    setInvoices([...invoices, newInvoice]);
    setNewInvoiceDialog(false);
  };

  const handleUpdateInvoice = () => {
    if (editInvoice) {
      setInvoices(invoices.map(i =>
        i.id === editInvoice.id ? editInvoice : i
      ));
      setEditInvoiceDialog(false);
      setEditInvoice(null);
    }
  };

  const handleDeleteInvoice = (id: number) => {
    setInvoices(invoices.filter(i => i.id !== id));
    setDeleteInvoiceDialog(null);
  };

  const getFileViewUrl = (fileManagerId: number) => `${BASE_URL}/api/file-manager/view/${fileManagerId}`;
  const getFileDownloadUrl = (fileManagerId: number) => `${BASE_URL}/api/file-manager/download/${fileManagerId}`;

  const updateEditImportantDate = (index: number, field: keyof ImportantDateUpdateForm, value: string) => {
    setEditImportantDates((currentDates) =>
      currentDates.map((importantDate, currentIndex) =>
        currentIndex === index ? { ...importantDate, [field]: value } : importantDate
      )
    );
  };

  const updateAdditionalImportantDate = (index: number, field: keyof ImportantDateCreateForm, value: string) => {
    setAdditionalImportantDates((currentDates) =>
      currentDates.map((importantDate, currentIndex) =>
        currentIndex === index ? { ...importantDate, [field]: value } : importantDate
      )
    );
  };

  const addAdditionalImportantDate = () => {
    setAdditionalImportantDates((currentDates) => [...currentDates, { label: "", normalDate: "" }]);
  };

  const removeAdditionalImportantDate = (index: number) => {
    setAdditionalImportantDates((currentDates) =>
      currentDates.length === 1
        ? [{ label: "", normalDate: "" }]
        : currentDates.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const openImportantDatesDialog = (conference: Conference) => {
    setImportantDatesConference(conference);
    setEditImportantDates(mapImportantDatesToEditForm(conference.settings?.importantDates));
    setAdditionalImportantDates([{ label: "", normalDate: "" }]);
    setImportantDatesDialog(true);
  };

  const openConferenceEntriesDialog = (conference: Conference) => {
    setConferenceEntriesConference(conference);
    setEditConferenceEntries(mapConferenceEntriesToEditForm(conference.settings?.conferenceEntries));
    setAdditionalConferenceEntries([createEmptyConferenceEntryForm()]);
    setConferenceEntriesDialog(true);
  };

  const openFoodOptionsDialog = (conference: Conference) => {
    setFoodOptionsConference(conference);
    setEditFoodOptions(mapFoodOptionsToEditForm(conference.settings?.foodOptions));
    setAdditionalFoodOptions([createEmptyFoodOptionForm()]);
    setFoodOptionsDialog(true);
  };

  const openBookingOptionsDialog = (conference: Conference) => {
    setBookingOptionsConference(conference);
    setEditBookingOptions(mapBookingOptionsToEditForm(conference.settings?.bookingOptions));
    setAdditionalBookingOptions([createEmptyBookingOptionForm()]);
    setBookingOptionsDialog(true);
  };

  const toggleProgramExpanded = (key: string) => {
    setProgramExpanded((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const openProgramDialog = (conference: Conference) => {
    const mappedProgramDays = mapProgramDaysToForm(conference.settings?.programDays);
    const nextExpanded: Record<string, boolean> = {};

    mappedProgramDays.forEach((day) => {
      nextExpanded[`day-${day.clientId}`] = true;
      day.items.forEach((item) => {
        nextExpanded[`item-${item.clientId}`] = true;
        item.sessions.forEach((session) => {
          nextExpanded[`session-${session.clientId}`] = true;
        });
      });
    });

    setProgramConference(conference);
    setProgramDaysForm(mappedProgramDays);
    setProgramExpanded(nextExpanded);
    setProgramDialog(true);
  };

  const updateProgramDay = (dayIndex: number, field: keyof Omit<ProgramDayForm, "clientId" | "items">, value: string) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentIndex) =>
        currentIndex === dayIndex ? { ...day, [field]: value } : day
      )
    );
  };

  const addProgramDay = () => {
    const nextDay = createEmptyProgramDay();
    setProgramDaysForm((currentDays) => [...currentDays, nextDay]);
    setProgramExpanded((current) => ({ ...current, [`day-${nextDay.clientId}`]: true }));
  };

  const removeProgramDay = (dayIndex: number) => {
    setProgramDaysForm((currentDays) => currentDays.filter((_, currentIndex) => currentIndex !== dayIndex));
  };

  const clearProgramDays = () => {
    setProgramDaysForm([]);
    setProgramExpanded({});
  };

  const updateProgramItem = (
    dayIndex: number,
    itemIndex: number,
    field: keyof Omit<ProgramItemForm, "clientId" | "sessions">,
    value: string | ProgramItemType
  ) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? { ...item, [field]: value } : item
              )
            }
      )
    );
  };

  const addProgramItem = (dayIndex: number) => {
    const nextItem = createEmptyProgramItem();
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex ? { ...day, items: [...day.items, nextItem] } : day
      )
    );
    setProgramExpanded((current) => ({ ...current, [`item-${nextItem.clientId}`]: true }));
  };

  const removeProgramItem = (dayIndex: number, itemIndex: number) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : { ...day, items: day.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) }
      )
    );
  };

  const updateProgramSession = (
    dayIndex: number,
    itemIndex: number,
    sessionIndex: number,
    field: keyof Omit<ProgramSessionForm, "clientId" | "presentations">,
    value: string
  ) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      sessions: item.sessions.map((session, currentSessionIndex) =>
                        currentSessionIndex === sessionIndex ? { ...session, [field]: value } : session
                      )
                    }
              )
            }
      )
    );
  };

  const addProgramSession = (dayIndex: number, itemIndex: number) => {
    const nextSession = createEmptyProgramSession();
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? { ...item, sessions: [...item.sessions, nextSession] } : item
              )
            }
      )
    );
    setProgramExpanded((current) => ({ ...current, [`session-${nextSession.clientId}`]: true }));
  };

  const removeProgramSession = (dayIndex: number, itemIndex: number, sessionIndex: number) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      sessions: item.sessions.filter((_, currentSessionIndex) => currentSessionIndex !== sessionIndex)
                    }
              )
            }
      )
    );
  };

  const updateProgramPresentation = (
    dayIndex: number,
    itemIndex: number,
    sessionIndex: number,
    presentationIndex: number,
    field: keyof Omit<ProgramPresentationForm, "clientId">,
    value: string
  ) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      sessions: item.sessions.map((session, currentSessionIndex) =>
                        currentSessionIndex !== sessionIndex
                          ? session
                          : {
                              ...session,
                              presentations: session.presentations.map((presentation, currentPresentationIndex) =>
                                currentPresentationIndex === presentationIndex
                                  ? { ...presentation, [field]: value }
                                  : presentation
                              )
                            }
                      )
                    }
              )
            }
      )
    );
  };

  const addProgramPresentation = (dayIndex: number, itemIndex: number, sessionIndex: number) => {
    const nextPresentation = createEmptyProgramPresentation();
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      sessions: item.sessions.map((session, currentSessionIndex) =>
                        currentSessionIndex === sessionIndex
                          ? { ...session, presentations: [...session.presentations, nextPresentation] }
                          : session
                      )
                    }
              )
            }
      )
    );
  };

  const removeProgramPresentation = (dayIndex: number, itemIndex: number, sessionIndex: number, presentationIndex: number) => {
    setProgramDaysForm((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex !== dayIndex
          ? day
          : {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      sessions: item.sessions.map((session, currentSessionIndex) =>
                        currentSessionIndex !== sessionIndex
                          ? session
                          : {
                              ...session,
                              presentations: session.presentations.filter((_, currentPresentationIndex) => currentPresentationIndex !== presentationIndex)
                            }
                      )
                    }
              )
            }
      )
    );
  };

  const handleSaveProgram = async () => {
    if (!programConference) return;

    const hasInvalidProgram = programDaysForm.some((day) =>
      !day.label.trim() ||
      !day.date ||
      day.items.some((item) =>
        !item.title.trim() ||
        !item.startTime ||
        !item.endTime ||
        item.sessions.some((session) =>
          !session.sessionName.trim() ||
          !session.startTime ||
          !session.endTime ||
          session.presentations.some((presentation) =>
            !presentation.title.trim() ||
            !presentation.authors.trim() ||
            !presentation.startTime ||
            !presentation.endTime
          )
        )
      )
    );

    if (hasInvalidProgram) {
      toast.error("Vyplň všetky povinné polia programu.");
      return;
    }

    try {
      await replaceConferenceProgram(programConference.id, {
        programDays: programDaysForm.map((day, dayIndex) => ({
          label: day.label.trim(),
          date: day.date,
          order: dayIndex,
          programItems: day.items.map((item, itemIndex) => ({
            title: item.title.trim(),
            startTime: item.startTime,
            endTime: item.endTime,
            location: item.location.trim() || null,
            speaker: item.speaker.trim() || null,
            chair: item.chair.trim() || null,
            type: item.type,
            order: itemIndex,
            sessions: item.sessions.map((session, sessionIndex) => ({
              sessionName: session.sessionName.trim(),
              startTime: session.startTime,
              endTime: session.endTime,
              chair: session.chair.trim() || null,
              order: sessionIndex,
              presentations: session.presentations.map((presentation, presentationIndex) => ({
                startTime: presentation.startTime,
                endTime: presentation.endTime,
                authors: presentation.authors.trim(),
                title: presentation.title.trim(),
                order: presentationIndex
              }))
            }))
          }))
        }))
      });

      setProgramDialog(false);
      setProgramConference(null);
      setProgramDaysForm([createEmptyProgramDay()]);
      setProgramExpanded({});
      toast.success("Program konferencie bol uložený.");
      loadConferences();
    } catch (error) {
      console.error("Failed to save program", error);
      toast.error("Uloženie programu zlyhalo.");
    }
  };

  const handleSaveImportantDates = async () => {
    if (!importantDatesConference) return;

    try {
      if (normalizedEditImportantDates.length > 0) {
        await Promise.all(
          normalizedEditImportantDates.map((importantDate) =>
            updateConferenceImportantDate(importantDatesConference.id, importantDate.id, {
              label: importantDate.label,
              updatedDate: importantDate.updatedDate
            })
          )
        );
      }

      if (normalizedAdditionalImportantDates.length > 0) {
        await createConferenceSettings(importantDatesConference.id, {
          importantDates: normalizedAdditionalImportantDates
        });
      }

      setImportantDatesDialog(false);
      setImportantDatesConference(null);
      setEditImportantDates([{ id: 0, label: "", normalDate: "", updatedDate: "" }]);
      setAdditionalImportantDates([{ label: "", normalDate: "" }]);
      toast.success("Dôležité termíny boli upravené.");
      loadConferences();
    } catch (error) {
      console.error("Failed to update important dates", error);
      toast.error("Úprava dôležitých termínov zlyhala.");
    }
  };

  const handleDeleteExistingImportantDate = async (importantDateId: number) => {
    if (!importantDatesConference || importantDateId <= 0) return;

    try {
      await deleteConferenceImportantDate(importantDatesConference.id, importantDateId);
      setEditImportantDates((currentDates) => {
        const filteredDates = currentDates.filter((importantDate) => importantDate.id !== importantDateId);
        return filteredDates.length > 0 ? filteredDates : [{ id: 0, label: "", normalDate: "", updatedDate: "" }];
      });
      toast.success("Termín bol vymazaný.");
      loadConferences();
    } catch (error) {
      console.error("Failed to delete important date", error);
      toast.error("Vymazanie termínu zlyhalo.");
    }
  };

  const updateEditConferenceEntry = (index: number, field: keyof ConferenceEntryUpdateForm, value: string) => {
    setEditConferenceEntries((currentEntries) =>
      currentEntries.map((conferenceEntry, currentIndex) =>
        currentIndex === index ? { ...conferenceEntry, [field]: value } : conferenceEntry
      )
    );
  };

  const updateAdditionalConferenceEntry = (index: number, field: keyof ConferenceEntryCreateForm, value: string) => {
    setAdditionalConferenceEntries((currentEntries) =>
      currentEntries.map((conferenceEntry, currentIndex) =>
        currentIndex === index ? { ...conferenceEntry, [field]: value } : conferenceEntry
      )
    );
  };

  const addAdditionalConferenceEntry = () => {
    setAdditionalConferenceEntries((currentEntries) => [...currentEntries, createEmptyConferenceEntryForm()]);
  };

  const removeAdditionalConferenceEntry = (index: number) => {
    setAdditionalConferenceEntries((currentEntries) =>
      currentEntries.length === 1
        ? [createEmptyConferenceEntryForm()]
        : currentEntries.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSaveConferenceEntries = async () => {
    if (!conferenceEntriesConference) return;

    const hasInvalidPrice = [...editConferenceEntries, ...additionalConferenceEntries].some(
      (conferenceEntry) => conferenceEntry.name.trim() && !Number.isFinite(parseDecimalValue(conferenceEntry.price))
    );

    if (hasInvalidPrice) {
      toast.error("Zadajte platnú cenu pre conference entry.");
      return;
    }

    try {
      if (normalizedEditConferenceEntries.length > 0) {
        await Promise.all(
          normalizedEditConferenceEntries.map((conferenceEntry) =>
            updateConferenceEntry(conferenceEntriesConference.id, conferenceEntry.id, {
              name: conferenceEntry.name,
              price: conferenceEntry.price
            })
          )
        );
      }

      if (normalizedAdditionalConferenceEntries.length > 0) {
        await createConferenceEntries(conferenceEntriesConference.id, {
          conferenceEntries: normalizedAdditionalConferenceEntries
        });
      }

      setConferenceEntriesDialog(false);
      setConferenceEntriesConference(null);
      setEditConferenceEntries([]);
      setAdditionalConferenceEntries([createEmptyConferenceEntryForm()]);
      toast.success("Conference entry možnosti boli upravené.");
      loadConferences();
      loadParticipants();
    } catch (error) {
      console.error("Failed to update conference entries", error);
      toast.error("Úprava conference entry možností zlyhala.");
    }
  };

  const handleDeleteExistingConferenceEntry = async (conferenceEntryId: number) => {
    if (!conferenceEntriesConference || conferenceEntryId <= 0) return;

    try {
      await deleteConferenceEntry(conferenceEntriesConference.id, conferenceEntryId);
      setEditConferenceEntries((currentEntries) => currentEntries.filter((conferenceEntry) => conferenceEntry.id !== conferenceEntryId));
      toast.success("Conference entry bol vymazaný.");
      loadConferences();
      loadParticipants();
    } catch (error) {
      console.error("Failed to delete conference entry", error);
      toast.error("Vymazanie conference entry zlyhalo.");
    }
  };

  const updateEditFoodOption = (index: number, field: keyof FoodOptionUpdateForm, value: string) => {
    setEditFoodOptions((currentOptions) =>
      currentOptions.map((foodOption, currentIndex) =>
        currentIndex === index ? { ...foodOption, [field]: value } : foodOption
      )
    );
  };

  const updateAdditionalFoodOption = (index: number, field: keyof FoodOptionCreateForm, value: string) => {
    setAdditionalFoodOptions((currentOptions) =>
      currentOptions.map((foodOption, currentIndex) =>
        currentIndex === index ? { ...foodOption, [field]: value } : foodOption
      )
    );
  };

  const addAdditionalFoodOption = () => {
    setAdditionalFoodOptions((currentOptions) => [...currentOptions, createEmptyFoodOptionForm()]);
  };

  const removeAdditionalFoodOption = (index: number) => {
    setAdditionalFoodOptions((currentOptions) =>
      currentOptions.length === 1 ? [createEmptyFoodOptionForm()] : currentOptions.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSaveFoodOptions = async () => {
    if (!foodOptionsConference) return;

    try {
      if (normalizedEditFoodOptions.length > 0) {
        await Promise.all(
          normalizedEditFoodOptions.map((foodOption) =>
            updateConferenceFoodOption(foodOptionsConference.id, foodOption.id, foodOption)
          )
        );
      }

      if (normalizedAdditionalFoodOptions.length > 0) {
        await createConferenceFoodOptions(foodOptionsConference.id, {
          foodOptions: normalizedAdditionalFoodOptions
        });
      }

      setFoodOptionsDialog(false);
      setFoodOptionsConference(null);
      setEditFoodOptions([]);
      setAdditionalFoodOptions([createEmptyFoodOptionForm()]);
      toast.success("Stravovacie možnosti boli upravené.");
      loadConferences();
    } catch (error) {
      console.error("Failed to update food options", error);
      toast.error("Úprava stravovacích možností zlyhala.");
    }
  };

  const handleDeleteExistingFoodOption = async (foodOptionId: number) => {
    if (!foodOptionsConference || foodOptionId <= 0) return;

    try {
      await deleteConferenceFoodOption(foodOptionsConference.id, foodOptionId);
      setEditFoodOptions((currentOptions) => currentOptions.filter((foodOption) => foodOption.id !== foodOptionId));
      toast.success("Stravovacia možnosť bola vymazaná.");
      loadConferences();
    } catch (error) {
      console.error("Failed to delete food option", error);
      toast.error("Vymazanie stravovacej možnosti zlyhalo.");
    }
  };

  const updateEditBookingOption = (index: number, field: keyof BookingOptionUpdateForm, value: string) => {
    setEditBookingOptions((currentOptions) =>
      currentOptions.map((bookingOption, currentIndex) =>
        currentIndex === index ? { ...bookingOption, [field]: value } : bookingOption
      )
    );
  };

  const updateAdditionalBookingOption = (index: number, field: keyof BookingOptionCreateForm, value: string) => {
    setAdditionalBookingOptions((currentOptions) =>
      currentOptions.map((bookingOption, currentIndex) =>
        currentIndex === index ? { ...bookingOption, [field]: value } : bookingOption
      )
    );
  };

  const addAdditionalBookingOption = () => {
    setAdditionalBookingOptions((currentOptions) => [...currentOptions, createEmptyBookingOptionForm()]);
  };

  const removeAdditionalBookingOption = (index: number) => {
    setAdditionalBookingOptions((currentOptions) =>
      currentOptions.length === 1 ? [createEmptyBookingOptionForm()] : currentOptions.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSaveBookingOptions = async () => {
    if (!bookingOptionsConference) return;

    try {
      if (normalizedEditBookingOptions.length > 0) {
        await Promise.all(
          normalizedEditBookingOptions.map((bookingOption) =>
            updateConferenceBookingOption(bookingOptionsConference.id, bookingOption.id, bookingOption)
          )
        );
      }

      if (normalizedAdditionalBookingOptions.length > 0) {
        await createConferenceBookingOptions(bookingOptionsConference.id, {
          bookingOptions: normalizedAdditionalBookingOptions
        });
      }

      setBookingOptionsDialog(false);
      setBookingOptionsConference(null);
      setEditBookingOptions([]);
      setAdditionalBookingOptions([createEmptyBookingOptionForm()]);
      toast.success("Možnosti ubytovania boli upravené.");
      loadConferences();
    } catch (error) {
      console.error("Failed to update booking options", error);
      toast.error("Úprava možností ubytovania zlyhala.");
    }
  };

  const handleDeleteExistingBookingOption = async (bookingOptionId: number) => {
    if (!bookingOptionsConference || bookingOptionId <= 0) return;

    try {
      await deleteConferenceBookingOption(bookingOptionsConference.id, bookingOptionId);
      setEditBookingOptions((currentOptions) => currentOptions.filter((bookingOption) => bookingOption.id !== bookingOptionId));
      toast.success("Možnosť ubytovania bola vymazaná.");
      loadConferences();
    } catch (error) {
      console.error("Failed to delete booking option", error);
      toast.error("Vymazanie možnosti ubytovania zlyhalo.");
    }
  };

  const openStudentStatusDialog = (participant: Participant) => {
    if (!participant.isStudent) return;
    setStudentFileParticipant(participant);
    setStudentFileDialog(true);
  };

  const openSubmissionStatusDialog = (participant: Participant) => {
    if (getSubmissionLabel(participant) === "Nie") return;
    setSubmissionFileParticipant(participant);
    setSubmissionFileDialog(true);
  };

  const handleStudentStatusAction = async (action: "approve" | "reject", fileManagerId: number) => {
    if (!currentUser?.email) return;
    setStudentStatusActionLoading(action);
    try {
      if (action === "approve") {
        await approveFileManager(fileManagerId, currentUser.email);
        toast.success("Doklad bol schválený.");
      } else {
        await rejectFileManager(fileManagerId, currentUser.email);
        toast.success("Doklad bol zamietnutý.");
      }

      const refreshedParticipants = await loadParticipants();
      if (studentFileParticipant) {
        const refreshed = refreshedParticipants.find((p) => p.id === studentFileParticipant.id) ?? null;
        setStudentFileParticipant(refreshed);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operácia zlyhala";
      toast.error(message);
    } finally {
      setStudentStatusActionLoading(null);
    }
  };

  const handleSubmissionStatusAction = async (action: "approve" | "reject", fileManagerId: number) => {
    if (!currentUser?.email) return;
    setSubmissionStatusActionLoading(action);
    try {
      if (action === "approve") {
        await approveFileManager(fileManagerId, currentUser.email);
        toast.success("Príspevok bol schválený.");
      } else {
        await rejectFileManager(fileManagerId, currentUser.email);
        toast.success("Príspevok bol zamietnutý.");
      }

      const refreshedParticipants = await loadParticipants();
      if (submissionFileParticipant) {
        const refreshed = refreshedParticipants.find((p) => p.id === submissionFileParticipant.id) ?? null;
        setSubmissionFileParticipant(refreshed);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operácia zlyhala";
      toast.error(message);
    } finally {
      setSubmissionStatusActionLoading(null);
    }
  };

  const stats = {
    totalParticipants: participants.length,
    pendingInvoices: participants.filter(p => p.invoiceStatus === "pending").length,
    paidInvoices: participants.filter(p => p.invoiceStatus === "paid").length,
    totalRevenue: participants.filter(p => p.invoiceStatus === "paid").length * 100,
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
              <Badge variant="outline" className="text-xs">
                <span className="flex flex-col leading-tight">
                  <span>{currentUser.name}</span>
                  <span>{currentUser.email}</span>
                </span>
              </Badge>
            </div>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Správa konferencií a účastníkov</p>
          </div>
        </div>

        {/* Stats Cards */}
        {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium text-gray-600">*/}
        {/*        Účastníci*/}
        {/*      </CardTitle>*/}
        {/*      <Users className="w-4 h-4 text-gray-500" />*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold">{stats.totalParticipants}</div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}

        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium text-gray-600">*/}
        {/*        Čaká na zaplatenie*/}
        {/*      </CardTitle>*/}
        {/*      <Clock className="w-4 h-4 text-yellow-500" />*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold text-yellow-600">{stats.pendingInvoices}</div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}

        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium text-gray-600">*/}
        {/*        Zaplatené*/}
        {/*      </CardTitle>*/}
        {/*      <Check className="w-4 h-4 text-green-500" />*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold text-green-600">{stats.paidInvoices}</div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}

        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium text-gray-600">*/}
        {/*        Celkový príjem*/}
        {/*      </CardTitle>*/}
        {/*      <Receipt className="w-4 h-4 text-blue-500" />*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold text-blue-600">{stats.totalRevenue} €</div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}

        <Tabs defaultValue="conferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="conferences" className="text-xs sm:text-sm py-3">
              <Building2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Konferencie</span>
              <span className="sm:hidden">Konf.</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="text-xs sm:text-sm py-3">
              <Users className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Účastníci</span>
              <span className="sm:hidden">Účast.</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs sm:text-sm py-3">
              <Receipt className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Faktúry</span>
              <span className="sm:hidden">Fakt.</span>
            </TabsTrigger>
          </TabsList>

          {/* Conferences Tab */}
          <TabsContent value="conferences">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Správa konferencií</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Vytvorte a spravujte viac konferencií naraz
                  </p>
                </div>
                <Dialog open={newConferenceDialog} onOpenChange={setNewConferenceDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nová konferencia
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Vytvoriť novú konferenciu</DialogTitle>
                      <DialogDescription>
                        Vyplňte základné informácie o novej konferencii
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="confName">Názov konferencie</Label>
                        <Input
                          id="confName"
                          value={newConference.name}
                          onChange={(e) => setNewConference({ ...newConference, name: e.target.value })}
                          placeholder="Medzinárodná vedecká konferencia 2027"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confDescription">Popis konferencie</Label>
                        <Textarea
                          id="confDescription"
                          value={newConference.description}
                          onChange={(e) => setNewConference({ ...newConference, description: e.target.value })}
                          placeholder="Spojenie najlepších vedeckých myslí z celého sveta"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Dátum začiatku</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newConference.startDate}
                            onChange={(e) => setNewConference({ ...newConference, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Dátum konca</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newConference.endDate}
                            onChange={(e) => setNewConference({ ...newConference, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Miesto konania</Label>
                        <Input
                          id="location"
                          value={newConference.location}
                          onChange={(e) => setNewConference({ ...newConference, location: e.target.value })}
                          placeholder="Bratislava, Slovakia"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                          Dôležité termíny nastavíš po vytvorení konferencie v samostatnom okne.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewConferenceDialog(false)}>
                        Zrušiť
                      </Button>
                      <Button onClick={handleCreateConference}>Vytvoriť</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conferences.map((conf) => (
                    <div
                      key={conf.id}
                      className={`p-4 border rounded-lg ${conf.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{conf.name}</h3>
                            {conf.isActive && <Badge>Aktívna</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {conf.startDate} - {conf.endDate} • {conf.location}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {conf.participantsCount} účastníkov
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConferenceEntriesDialog(conf)}
                            className="gap-1"
                          >
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Entry</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImportantDatesDialog(conf)}
                            className="gap-1"
                          >
                            <Clock className="w-4 h-4" />
                            <span className="hidden sm:inline">Termíny</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFoodOptionsDialog(conf)}
                            className="gap-1"
                          >
                            <UtensilsCrossed className="w-4 h-4" />
                            <span className="hidden sm:inline">Strava</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBookingOptionsDialog(conf)}
                            className="gap-1"
                          >
                            <Hotel className="w-4 h-4" />
                            <span className="hidden sm:inline">Ubytovanie</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openProgramDialog(conf)}
                            className="gap-1"
                          >
                            <FolderTree className="w-4 h-4" />
                            <span className="hidden sm:inline">Program</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditConference(conf);
                              setEditImportantDates(mapImportantDatesToEditForm(conf.settings?.importantDates));
                              setAdditionalImportantDates([{ label: "", normalDate: "" }]);
                              setEditConferenceDialog(true);
                            }}
                            className="gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Upraviť</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfDialog(conf.id)}
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Vymazať</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Zoznam účastníkov</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meno</TableHead>
                        <TableHead>Conference entry</TableHead>
                        <TableHead>Študentský status</TableHead>
                        <TableHead>Príspevok</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            {participant.firstName} {participant.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getConferenceEntryLabel(participant.conferenceEntry)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getStudentStatusBadgeClass(participant)} ${participant.isStudent ? "cursor-pointer hover:opacity-80" : ""}`}
                              onClick={() => openStudentStatusDialog(participant)}
                            >
                              {getStudentLabel(participant)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getSubmissionStatusBadgeClass(participant)} ${getSubmissionLabel(participant) !== "Nie" ? "cursor-pointer hover:opacity-80" : ""}`}
                              onClick={() => openSubmissionStatusDialog(participant)}
                            >
                              {getSubmissionLabel(participant)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditParticipant(participant);
                                  setEditParticipantDialog(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletePartDialog(participant.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold break-words">
                          {participant.firstName} {participant.lastName}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditParticipant(participant);
                              setEditParticipantDialog(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletePartDialog(participant.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Conference entry:</span>
                        <Badge variant="secondary">{getConferenceEntryLabel(participant.conferenceEntry)}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Študentský status:</span>
                        <Badge
                          variant="outline"
                          className={`${getStudentStatusBadgeClass(participant)} ${participant.isStudent ? "cursor-pointer hover:opacity-80" : ""}`}
                          onClick={() => openStudentStatusDialog(participant)}
                        >
                          {getStudentLabel(participant)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Príspevok:</span>
                        <Badge
                          variant="outline"
                          className={`${getSubmissionStatusBadgeClass(participant)} ${getSubmissionLabel(participant) !== "Nie" ? "cursor-pointer hover:opacity-80" : ""}`}
                          onClick={() => openSubmissionStatusDialog(participant)}
                        >
                          {getSubmissionLabel(participant)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Správa faktúr</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Číslo faktúry</TableHead>
                        <TableHead>Účastník</TableHead>
                        <TableHead>Suma</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants
                        .filter(p => p.invoiceStatus !== "none")
                        .map((participant, index) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-mono">
                              INV-2026-{String(index + 1).padStart(3, '0')}
                            </TableCell>
                            <TableCell>
                              {participant.firstName} {participant.lastName}
                            </TableCell>
                            <TableCell className="font-semibold">100 €</TableCell>
                            <TableCell>
                              {participant.invoiceStatus === "paid" ? (
                                <Badge className="bg-green-500">Zaplatené</Badge>
                              ) : (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                  Čaká na zaplatenie
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                {participant.invoiceStatus === "pending" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateInvoiceStatus(participant.id, "paid")}
                                  >
                                    Označiť ako zaplatené
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {participants
                    .filter(p => p.invoiceStatus !== "none")
                    .map((participant, index) => (
                      <div key={participant.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-sm text-gray-600">
                              INV-2026-{String(index + 1).padStart(3, '0')}
                            </p>
                            <h3 className="font-semibold mt-1">
                              {participant.firstName} {participant.lastName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">100 €</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600">Status:</span>
                          {participant.invoiceStatus === "paid" ? (
                            <Badge className="bg-green-500">Zaplatené</Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              Čaká na zaplatenie
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Stiahnuť
                          </Button>
                          {participant.invoiceStatus === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateInvoiceStatus(participant.id, "paid")}
                              className="flex-1"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Zaplatené
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Conference Dialog */}
        <Dialog open={editConferenceDialog} onOpenChange={setEditConferenceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upraviť konferenciu</DialogTitle>
              <DialogDescription>Zmena informácií o konferencii</DialogDescription>
            </DialogHeader>
            {editConference && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Názov konferencie</Label>
                  <Input
                    id="editName"
                    value={editConference.name}
                    onChange={(e) => setEditConference({ ...editConference, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Popis konferencie</Label>
                  <Textarea
                    id="editDescription"
                    value={editConference.description}
                    onChange={(e) => setEditConference({ ...editConference, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStart">Dátum začiatku</Label>
                    <Input
                      id="editStart"
                      type="date"
                      value={editConference.startDate}
                      onChange={(e) => setEditConference({ ...editConference, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEnd">Dátum konca</Label>
                    <Input
                      id="editEnd"
                      type="date"
                      value={editConference.endDate}
                      onChange={(e) => setEditConference({ ...editConference, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLocation">Miesto konania</Label>
                  <Input
                    id="editLocation"
                    value={editConference.location}
                    onChange={(e) => setEditConference({ ...editConference, location: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                      id="editActive"
                      checked={!!editConference.isActive}
                      onCheckedChange={(checked) =>
                          setEditConference({ ...editConference, isActive: checked === true })
                      }
                  />
                  <Label htmlFor="editActive">Aktívna konferencia</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditConferenceDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleUpdateConference}>Uložiť</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={programDialog}
          onOpenChange={(open) => {
            setProgramDialog(open);
            if (!open) {
              setProgramConference(null);
              setProgramDaysForm([createEmptyProgramDay()]);
              setProgramExpanded({});
            }
          }}
        >
          <DialogContent className="h-[88vh] w-[88vw] min-w-[900px] max-w-[88vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Program konferencie</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {programConference
                  ? `Vytváranie a správa programu konferencie ${programConference.name}`
                  : "Vytváranie a správa programu konferencie po dňoch"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-md text-sm text-gray-600">
                  Vytváranie a správa programu konferencie po dňoch
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={clearProgramDays}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Vymazať všetko
                  </Button>
                  <Button type="button" onClick={addProgramDay}>
                    <Plus className="mr-2 h-4 w-4" />
                    Pridať deň
                  </Button>
                </div>
              </div>

              {programDaysForm.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-600">
                  Program je prázdny. Pridaj prvý deň.
                </div>
              ) : (
                <div className="space-y-5">
                  {programDaysForm.map((programDay, dayIndex) => {
                    const dayExpandedKey = `day-${programDay.clientId}`;
                    const isDayExpanded = programExpanded[dayExpandedKey] ?? true;

                    return (
                      <div key={programDay.clientId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 px-6 py-5">
                          <div className="flex min-w-0 items-start gap-4">
                            <button
                              type="button"
                              onClick={() => toggleProgramExpanded(dayExpandedKey)}
                              className="mt-1 rounded-md p-1 text-gray-600 hover:bg-white"
                            >
                              {isDayExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            </button>
                            <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(260px,1fr)_180px]">
                              <div className="space-y-2">
                                <Label htmlFor={`program-day-label-${dayIndex}`} className="text-sm font-medium text-gray-600">Názov dňa</Label>
                                <Input
                                  id={`program-day-label-${dayIndex}`}
                                  value={programDay.label}
                                  onChange={(e) => updateProgramDay(dayIndex, "label", e.target.value)}
                                  placeholder="Deň 1 - Streda"
                                  className="h-11 text-lg font-semibold"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`program-day-date-${dayIndex}`} className="text-sm font-medium text-gray-600">Dátum</Label>
                                <Input
                                  id={`program-day-date-${dayIndex}`}
                                  type="date"
                                  value={programDay.date}
                                  onChange={(e) => updateProgramDay(dayIndex, "date", e.target.value)}
                                  className="h-11"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <Button type="button" variant="outline" onClick={() => addProgramItem(dayIndex)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Položka
                            </Button>
                            <Button type="button" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeProgramDay(dayIndex)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {isDayExpanded ? (
                          <div className="space-y-4 px-6 py-5">
                            {programDay.items.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600">
                                Tento deň zatiaľ nemá žiadne položky.
                              </div>
                            ) : (
                              programDay.items.map((item, itemIndex) => {
                                const itemExpandedKey = `item-${item.clientId}`;
                                const isItemExpanded = programExpanded[itemExpandedKey] ?? true;

                                return (
                                  <div key={item.clientId} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex min-w-0 items-start gap-4">
                                        <button
                                          type="button"
                                          onClick={() => toggleProgramExpanded(itemExpandedKey)}
                                          className="mt-1 rounded-md p-1 text-gray-600 hover:bg-white"
                                        >
                                          {isItemExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                        </button>
                                        <div className="min-w-0">
                                          <h4 className="truncate text-xl font-semibold text-gray-900">
                                            {item.title || `Položka ${itemIndex + 1}`}
                                          </h4>
                                          <p className="mt-1 text-base text-gray-600">
                                            {item.startTime || "--:--"} - {item.endTime || "--:--"}
                                            {item.location ? ` • ${item.location}` : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="bg-white text-sm font-medium">
                                          {getProgramItemTypeLabel(item.type)}
                                        </Badge>
                                        <Button type="button" variant="outline" onClick={() => addProgramSession(dayIndex, itemIndex)}>
                                          <Plus className="mr-2 h-4 w-4" />
                                          Session
                                        </Button>
                                        <Button type="button" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeProgramItem(dayIndex, itemIndex)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>

                                    {isItemExpanded ? (
                                      <div className="mt-5 space-y-5">
                                        <div className="grid gap-4 md:grid-cols-[minmax(260px,1.5fr)_120px_120px_180px]">
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-title-${dayIndex}-${itemIndex}`}>Názov položky</Label>
                                            <Input
                                              id={`program-item-title-${dayIndex}-${itemIndex}`}
                                              value={item.title}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "title", e.target.value)}
                                              placeholder="Registrácia účastníkov"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-start-${dayIndex}-${itemIndex}`}>Začiatok</Label>
                                            <Input
                                              id={`program-item-start-${dayIndex}-${itemIndex}`}
                                              type="time"
                                              value={item.startTime}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "startTime", e.target.value)}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-end-${dayIndex}-${itemIndex}`}>Koniec</Label>
                                            <Input
                                              id={`program-item-end-${dayIndex}-${itemIndex}`}
                                              type="time"
                                              value={item.endTime}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "endTime", e.target.value)}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Typ</Label>
                                            <Select
                                              value={String(item.type)}
                                              onValueChange={(value) => updateProgramItem(dayIndex, itemIndex, "type", Number(value) as ProgramItemType)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="0">registration</SelectItem>
                                                <SelectItem value="1">opening</SelectItem>
                                                <SelectItem value="2">keynote</SelectItem>
                                                <SelectItem value="3">parallel</SelectItem>
                                                <SelectItem value="4">session</SelectItem>
                                                <SelectItem value="5">workshop</SelectItem>
                                                <SelectItem value="6">panel</SelectItem>
                                                <SelectItem value="7">break</SelectItem>
                                                <SelectItem value="8">social</SelectItem>
                                                <SelectItem value="9">poster</SelectItem>
                                                <SelectItem value="10">closing</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-location-${dayIndex}-${itemIndex}`}>Miesto</Label>
                                            <Input
                                              id={`program-item-location-${dayIndex}-${itemIndex}`}
                                              value={item.location}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "location", e.target.value)}
                                              placeholder="Tatra Hotel – Registračný bod"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-speaker-${dayIndex}-${itemIndex}`}>Speaker</Label>
                                            <Input
                                              id={`program-item-speaker-${dayIndex}-${itemIndex}`}
                                              value={item.speaker}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "speaker", e.target.value)}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor={`program-item-chair-${dayIndex}-${itemIndex}`}>Chair</Label>
                                            <Input
                                              id={`program-item-chair-${dayIndex}-${itemIndex}`}
                                              value={item.chair}
                                              onChange={(e) => updateProgramItem(dayIndex, itemIndex, "chair", e.target.value)}
                                            />
                                          </div>
                                        </div>

                                        <div className="space-y-3">
                                          {item.sessions.map((session, sessionIndex) => {
                                            const sessionExpandedKey = `session-${session.clientId}`;
                                            const isSessionExpanded = programExpanded[sessionExpandedKey] ?? true;

                                            return (
                                              <div key={session.clientId} className="rounded-xl border border-white bg-white/90 p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                  <div className="flex min-w-0 items-start gap-3">
                                                    <button
                                                      type="button"
                                                      onClick={() => toggleProgramExpanded(sessionExpandedKey)}
                                                      className="mt-1 rounded-md p-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                      {isSessionExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </button>
                                                    <div className="min-w-0">
                                                      <h5 className="truncate text-lg font-semibold">
                                                        {session.sessionName || `Session ${sessionIndex + 1}`}
                                                      </h5>
                                                      <p className="text-sm text-gray-600">
                                                        {session.startTime || "--:--"} - {session.endTime || "--:--"}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex shrink-0 gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => addProgramPresentation(dayIndex, itemIndex, sessionIndex)}>
                                                      <Plus className="mr-1 h-4 w-4" />
                                                      Príspevok
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeProgramSession(dayIndex, itemIndex, sessionIndex)}>
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>

                                                {isSessionExpanded ? (
                                                  <div className="mt-4 space-y-4">
                                                    <div className="grid gap-4 md:grid-cols-[minmax(260px,1.4fr)_120px_120px_1fr]">
                                                      <div className="space-y-2">
                                                        <Label htmlFor={`program-session-name-${dayIndex}-${itemIndex}-${sessionIndex}`}>Názov session</Label>
                                                        <Input
                                                          id={`program-session-name-${dayIndex}-${itemIndex}-${sessionIndex}`}
                                                          value={session.sessionName}
                                                          onChange={(e) => updateProgramSession(dayIndex, itemIndex, sessionIndex, "sessionName", e.target.value)}
                                                        />
                                                      </div>
                                                      <div className="space-y-2">
                                                        <Label htmlFor={`program-session-start-${dayIndex}-${itemIndex}-${sessionIndex}`}>Začiatok</Label>
                                                        <Input
                                                          id={`program-session-start-${dayIndex}-${itemIndex}-${sessionIndex}`}
                                                          type="time"
                                                          value={session.startTime}
                                                          onChange={(e) => updateProgramSession(dayIndex, itemIndex, sessionIndex, "startTime", e.target.value)}
                                                        />
                                                      </div>
                                                      <div className="space-y-2">
                                                        <Label htmlFor={`program-session-end-${dayIndex}-${itemIndex}-${sessionIndex}`}>Koniec</Label>
                                                        <Input
                                                          id={`program-session-end-${dayIndex}-${itemIndex}-${sessionIndex}`}
                                                          type="time"
                                                          value={session.endTime}
                                                          onChange={(e) => updateProgramSession(dayIndex, itemIndex, sessionIndex, "endTime", e.target.value)}
                                                        />
                                                      </div>
                                                      <div className="space-y-2">
                                                        <Label htmlFor={`program-session-chair-${dayIndex}-${itemIndex}-${sessionIndex}`}>Chair</Label>
                                                        <Input
                                                          id={`program-session-chair-${dayIndex}-${itemIndex}-${sessionIndex}`}
                                                          value={session.chair}
                                                          onChange={(e) => updateProgramSession(dayIndex, itemIndex, sessionIndex, "chair", e.target.value)}
                                                        />
                                                      </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                      {session.presentations.map((presentation, presentationIndex) => (
                                                        <div key={presentation.clientId} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[110px_110px_minmax(180px,1fr)_minmax(220px,1.4fr)_44px]">
                                                          <div className="space-y-2">
                                                            <Label htmlFor={`program-presentation-start-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}>Začiatok</Label>
                                                            <Input
                                                              id={`program-presentation-start-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                                                              type="time"
                                                              value={presentation.startTime}
                                                              onChange={(e) => updateProgramPresentation(dayIndex, itemIndex, sessionIndex, presentationIndex, "startTime", e.target.value)}
                                                            />
                                                          </div>
                                                          <div className="space-y-2">
                                                            <Label htmlFor={`program-presentation-end-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}>Koniec</Label>
                                                            <Input
                                                              id={`program-presentation-end-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                                                              type="time"
                                                              value={presentation.endTime}
                                                              onChange={(e) => updateProgramPresentation(dayIndex, itemIndex, sessionIndex, presentationIndex, "endTime", e.target.value)}
                                                            />
                                                          </div>
                                                          <div className="space-y-2">
                                                            <Label htmlFor={`program-presentation-authors-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}>Autori</Label>
                                                            <Input
                                                              id={`program-presentation-authors-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                                                              value={presentation.authors}
                                                              onChange={(e) => updateProgramPresentation(dayIndex, itemIndex, sessionIndex, presentationIndex, "authors", e.target.value)}
                                                            />
                                                          </div>
                                                          <div className="space-y-2">
                                                            <Label htmlFor={`program-presentation-title-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}>Názov príspevku</Label>
                                                            <Input
                                                              id={`program-presentation-title-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                                                              value={presentation.title}
                                                              onChange={(e) => updateProgramPresentation(dayIndex, itemIndex, sessionIndex, presentationIndex, "title", e.target.value)}
                                                            />
                                                          </div>
                                                          <div className="flex items-end">
                                                            <Button
                                                              type="button"
                                                              variant="outline"
                                                              size="default"
                                                              className="h-10 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                              onClick={() => removeProgramPresentation(dayIndex, itemIndex, sessionIndex, presentationIndex)}
                                                            >
                                                              <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                ) : null}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setProgramDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSaveProgram}>Uložiť program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={importantDatesDialog}
          onOpenChange={(open) => {
            setImportantDatesDialog(open);
            if (!open) {
              setImportantDatesConference(null);
              setEditImportantDates([{ id: 0, label: "", normalDate: "", updatedDate: "" }]);
              setAdditionalImportantDates([{ label: "", normalDate: "" }]);
            }
          }}
        >
          <DialogContent className="h-[86vh] w-[88vw] min-w-[600px] max-w-[88vw] overflow-x-hidden overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Správa dôležitých termínov</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {importantDatesConference
                  ? `Termíny pre konferenciu ${importantDatesConference.name}`
                  : "Úprava a doplnenie termínov konferencie"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div>
                  <Label>Existujúce termíny</Label>
                </div>
                <div className="space-y-4">
                  {editImportantDates.map((importantDate, index) => (
                      <div key={importantDate.id || index} className="grid grid-cols-[minmax(320px,2.8fr)_120px_120px_auto] gap-5 items-start rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                      <div className="space-y-2">
                        <Label htmlFor={`important-date-edit-label-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`important-date-edit-label-${index}`}
                          value={importantDate.label}
                          onChange={(e) => updateEditImportantDate(index, "label", e.target.value)}
                          rows={4}
                          className="h-10 resize-none overflow-y-auto text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`important-date-edit-normal-${index}`} className="text-xs font-medium text-gray-600">Pôvodný dátum</Label>
                        <Input
                          id={`important-date-edit-normal-${index}`}
                          value={importantDate.normalDate}
                          readOnly
                          disabled
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`important-date-edit-updated-${index}`} className="text-xs font-medium text-gray-600">Zmenený dátum</Label>
                        <Input
                          id={`important-date-edit-updated-${index}`}
                          type="date"
                          value={importantDate.updatedDate}
                          onChange={(e) => updateEditImportantDate(index, "updatedDate", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-11 px-3"
                          onClick={() => handleDeleteExistingImportantDate(importantDate.id)}
                          aria-label="Odstrániť existujúci termín"
                          disabled={importantDate.id <= 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label>Pridať nové termíny</Label>
                  </div>
                  <Button type="button" variant="outline" size="default" className="h-11 px-4" onClick={addAdditionalImportantDate}>
                    <Plus className="mr-1 h-4 w-4" />
                    Pridať dátum
                  </Button>
                </div>
                <div className="space-y-4">
                    {additionalImportantDates.map((importantDate, index) => (
                      <div key={index} className="grid grid-cols-[minmax(320px,2.8fr)_120px_auto] items-start gap-5 rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                      <div className="space-y-2">
                        <Label htmlFor={`important-date-additional-label-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`important-date-additional-label-${index}`}
                          value={importantDate.label}
                          onChange={(e) => updateAdditionalImportantDate(index, "label", e.target.value)}
                          placeholder="Early bird registrácia"
                          rows={4}
                          className="h-40 resize-none overflow-y-auto text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`important-date-additional-${index}`} className="text-xs font-medium text-gray-600">Dátum</Label>
                        <Input
                          id={`important-date-additional-${index}`}
                          type="date"
                          value={importantDate.normalDate}
                          onChange={(e) => updateAdditionalImportantDate(index, "normalDate", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="h-11 px-3 self-end"
                        onClick={() => removeAdditionalImportantDate(index)}
                        aria-label="Odstrániť nový termín"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImportantDatesDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSaveImportantDates}>Uložiť termíny</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={conferenceEntriesDialog}
          onOpenChange={(open) => {
            setConferenceEntriesDialog(open);
            if (!open) {
              setConferenceEntriesConference(null);
              setEditConferenceEntries([]);
              setAdditionalConferenceEntries([createEmptyConferenceEntryForm()]);
            }
          }}
        >
          <DialogContent className="h-[86vh] w-[88vw] min-w-[600px] max-w-[88vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Správa conference entry</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {conferenceEntriesConference
                  ? `Typy vstupu pre konferenciu ${conferenceEntriesConference.name}`
                  : "Úprava a doplnenie conference entry možností"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div>
                  <Label>Existujúce možnosti</Label>
                </div>
                <div className="space-y-4">
                  {editConferenceEntries.map((conferenceEntry, index) => (
                    <div
                      key={conferenceEntry.id}
                      className="grid grid-cols-[minmax(260px,1fr)_120px_44px] gap-3 items-end rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`conference-entry-edit-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`conference-entry-edit-name-${index}`}
                          value={conferenceEntry.name}
                          onChange={(e) => updateEditConferenceEntry(index, "name", e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`conference-entry-edit-price-${index}`} className="text-base font-semibold">Cena</Label>
                        <Input
                          id={`conference-entry-edit-price-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={conferenceEntry.price}
                          onChange={(e) => updateEditConferenceEntry(index, "price", e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => handleDeleteExistingConferenceEntry(conferenceEntry.id)}
                          aria-label="Odstrániť existujúci conference entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Label>Pridať nové možnosti</Label>
                  </div>
                  <Button type="button" variant="outline" size="default" className="h-10 shrink-0 px-4" onClick={addAdditionalConferenceEntry}>
                    <Plus className="mr-1 h-4 w-4" />
                    Pridať možnosť
                  </Button>
                </div>
                <div className="space-y-4">
                  {additionalConferenceEntries.map((conferenceEntry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[minmax(260px,1fr)_120px_44px] gap-3 items-end rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`conference-entry-add-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`conference-entry-add-name-${index}`}
                          value={conferenceEntry.name}
                          onChange={(e) => updateAdditionalConferenceEntry(index, "name", e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`conference-entry-add-price-${index}`} className="text-base font-semibold">Cena</Label>
                        <Input
                          id={`conference-entry-add-price-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={conferenceEntry.price}
                          onChange={(e) => updateAdditionalConferenceEntry(index, "price", e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => removeAdditionalConferenceEntry(index)}
                          aria-label="Odstrániť nový conference entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConferenceEntriesDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSaveConferenceEntries}>Uložiť conference entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={foodOptionsDialog}
          onOpenChange={(open) => {
            setFoodOptionsDialog(open);
            if (!open) {
              setFoodOptionsConference(null);
              setEditFoodOptions([]);
              setAdditionalFoodOptions([createEmptyFoodOptionForm()]);
            }
          }}
        >
          <DialogContent className="h-[86vh] w-[88vw] min-w-[1000px] max-w-[88vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Správa stravovacích možností</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {foodOptionsConference
                  ? `Stravovanie pre konferenciu ${foodOptionsConference.name}`
                  : "Úprava a doplnenie stravovania konferencie"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div>
                  <Label>Existujúce možnosti</Label>
                </div>
                <div className="space-y-4">
                  {editFoodOptions.map((foodOption, index) => (
                    <div key={foodOption.id} className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_88px_84px_110px_44px] gap-3 items-start rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`food-option-edit-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`food-option-edit-name-${index}`}
                          value={foodOption.name}
                          onChange={(e) => updateEditFoodOption(index, "name", e.target.value)}
                          className="h-10 min-w-0 text-sm"
                        />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`food-option-edit-description-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`food-option-edit-description-${index}`}
                          value={foodOption.description}
                          onChange={(e) => updateEditFoodOption(index, "description", e.target.value)}
                          rows={3}
                          className="h-32 min-w-0 resize-none overflow-y-auto text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-edit-type-${index}`} className="text-xs font-medium text-gray-600">Typ</Label>
                        <Select
                          value={String(foodOption.foodOptionsType)}
                          onValueChange={(value) => updateEditFoodOption(index, "foodOptionsType", normalizeFoodOptionType(value))}
                        >
                          <SelectTrigger id={`food-option-edit-type-${index}`} className="h-10 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Raňajky</SelectItem>
                            <SelectItem value="1">Obed</SelectItem>
                            <SelectItem value="2">Večera</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-edit-price-${index}`} className="text-xs font-medium text-gray-600">Cena</Label>
                        <Input
                          id={`food-option-edit-price-${index}`}
                          type="number"
                          value={foodOption.price}
                          onChange={(e) => updateEditFoodOption(index, "price", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-edit-date-${index}`} className="text-xs font-medium text-gray-600">Dátum</Label>
                        <Input
                          id={`food-option-edit-date-${index}`}
                          type="date"
                          value={foodOption.date}
                          onChange={(e) => updateEditFoodOption(index, "date", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => handleDeleteExistingFoodOption(foodOption.id)}
                          aria-label="Odstrániť existujúcu stravovaciu možnosť"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Label>Pridať nové možnosti</Label>
                  </div>
                  <Button type="button" variant="outline" size="default" className="h-10 shrink-0 px-4" onClick={addAdditionalFoodOption}>
                    <Plus className="mr-1 h-4 w-4" />
                    Pridať možnosť
                  </Button>
                </div>
                <div className="space-y-4">
                  {additionalFoodOptions.map((foodOption, index) => (
                    <div key={index} className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_88px_84px_110px_44px] gap-3 items-start rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`food-option-add-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`food-option-add-name-${index}`}
                          value={foodOption.name}
                          onChange={(e) => updateAdditionalFoodOption(index, "name", e.target.value)}
                          className="h-10 min-w-0 text-sm"
                        />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`food-option-add-description-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`food-option-add-description-${index}`}
                          value={foodOption.description}
                          onChange={(e) => updateAdditionalFoodOption(index, "description", e.target.value)}
                          rows={3}
                          className="h-32 min-w-0 resize-none overflow-y-auto text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-add-type-${index}`} className="text-xs font-medium text-gray-600">Typ</Label>
                        <Select
                          value={String(foodOption.foodOptionsType)}
                          onValueChange={(value) => updateAdditionalFoodOption(index, "foodOptionsType", normalizeFoodOptionType(value))}
                        >
                          <SelectTrigger id={`food-option-add-type-${index}`} className="h-10 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Raňajky</SelectItem>
                            <SelectItem value="1">Obed</SelectItem>
                            <SelectItem value="2">Večera</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-add-price-${index}`} className="text-xs font-medium text-gray-600">Cena</Label>
                        <Input
                          id={`food-option-add-price-${index}`}
                          type="number"
                          value={foodOption.price}
                          onChange={(e) => updateAdditionalFoodOption(index, "price", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`food-option-add-date-${index}`} className="text-xs font-medium text-gray-600">Dátum</Label>
                        <Input
                          id={`food-option-add-date-${index}`}
                          type="date"
                          value={foodOption.date}
                          onChange={(e) => updateAdditionalFoodOption(index, "date", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => removeAdditionalFoodOption(index)}
                          aria-label="Odstrániť novú stravovaciu možnosť"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFoodOptionsDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSaveFoodOptions}>Uložiť stravu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={bookingOptionsDialog}
          onOpenChange={(open) => {
            setBookingOptionsDialog(open);
            if (!open) {
              setBookingOptionsConference(null);
              setEditBookingOptions([]);
              setAdditionalBookingOptions([createEmptyBookingOptionForm()]);
            }
          }}
        >
          <DialogContent className="h-[86vh] w-[88vw] min-w-[1000px] max-w-[88vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Správa ubytovacích možností</DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {bookingOptionsConference
                  ? `Ubytovanie pre konferenciu ${bookingOptionsConference.name}`
                  : "Úprava a doplnenie ubytovania konferencie"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div>
                  <Label>Existujúce možnosti</Label>
                </div>
                <div className="space-y-4">
                  {editBookingOptions.map((bookingOption, index) => (
                    <div key={bookingOption.id} className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_84px_110px_110px_44px] gap-3 items-start rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`booking-option-edit-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`booking-option-edit-name-${index}`}
                          value={bookingOption.name}
                          onChange={(e) => updateEditBookingOption(index, "name", e.target.value)}
                          className="h-10 min-w-0 text-sm"
                        />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`booking-option-edit-description-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`booking-option-edit-description-${index}`}
                          value={bookingOption.description}
                          onChange={(e) => updateEditBookingOption(index, "description", e.target.value)}
                          rows={3}
                          className="h-32 min-w-0 resize-none overflow-y-auto text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-edit-price-${index}`} className="text-xs font-medium text-gray-600">Cena</Label>
                        <Input
                          id={`booking-option-edit-price-${index}`}
                          type="number"
                          value={bookingOption.price}
                          onChange={(e) => updateEditBookingOption(index, "price", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-edit-start-${index}`} className="text-xs font-medium text-gray-600">Od</Label>
                        <Input
                          id={`booking-option-edit-start-${index}`}
                          type="date"
                          value={bookingOption.startDate}
                          onChange={(e) => updateEditBookingOption(index, "startDate", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-edit-end-${index}`} className="text-xs font-medium text-gray-600">Do</Label>
                        <Input
                          id={`booking-option-edit-end-${index}`}
                          type="date"
                          value={bookingOption.endDate}
                          onChange={(e) => updateEditBookingOption(index, "endDate", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => handleDeleteExistingBookingOption(bookingOption.id)}
                          aria-label="Odstrániť existujúcu možnosť ubytovania"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Label>Pridať nové možnosti</Label>
                  </div>
                  <Button type="button" variant="outline" size="default" className="h-10 shrink-0 px-4" onClick={addAdditionalBookingOption}>
                    <Plus className="mr-1 h-4 w-4" />
                    Pridať možnosť
                  </Button>
                </div>
                <div className="space-y-4">
                  {additionalBookingOptions.map((bookingOption, index) => (
                    <div key={index} className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_84px_110px_110px_44px] gap-3 items-start rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`booking-option-add-name-${index}`} className="text-base font-semibold">Názov</Label>
                        <Input
                          id={`booking-option-add-name-${index}`}
                          value={bookingOption.name}
                          onChange={(e) => updateAdditionalBookingOption(index, "name", e.target.value)}
                          className="h-10 min-w-0 text-sm"
                        />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Label htmlFor={`booking-option-add-description-${index}`} className="text-base font-semibold">Popis</Label>
                        <Textarea
                          id={`booking-option-add-description-${index}`}
                          value={bookingOption.description}
                          onChange={(e) => updateAdditionalBookingOption(index, "description", e.target.value)}
                          rows={3}
                          className="h-32 min-w-0 resize-none overflow-y-auto text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-add-price-${index}`} className="text-xs font-medium text-gray-600">Cena</Label>
                        <Input
                          id={`booking-option-add-price-${index}`}
                          type="number"
                          value={bookingOption.price}
                          onChange={(e) => updateAdditionalBookingOption(index, "price", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-add-start-${index}`} className="text-xs font-medium text-gray-600">Od</Label>
                        <Input
                          id={`booking-option-add-start-${index}`}
                          type="date"
                          value={bookingOption.startDate}
                          onChange={(e) => updateAdditionalBookingOption(index, "startDate", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`booking-option-add-end-${index}`} className="text-xs font-medium text-gray-600">Do</Label>
                        <Input
                          id={`booking-option-add-end-${index}`}
                          type="date"
                          value={bookingOption.endDate}
                          onChange={(e) => updateAdditionalBookingOption(index, "endDate", e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                      <div className="flex h-full items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="h-10 px-3"
                          onClick={() => removeAdditionalBookingOption(index)}
                          aria-label="Odstrániť novú možnosť ubytovania"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookingOptionsDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSaveBookingOptions}>Uložiť ubytovanie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Conference Dialog */}
        <AlertDialog open={deleteConfDialog !== null} onOpenChange={() => setDeleteConfDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Odstrániť konferenciu?</AlertDialogTitle>
              <AlertDialogDescription>
                Táto akcia je nevratná. Naozaj chcete odstrániť túto konferenciu?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušiť</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteConfDialog && handleDeleteConference(deleteConfDialog)}>
                Odstrániť
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Participant Dialog */}
        <Dialog open={editParticipantDialog} onOpenChange={setEditParticipantDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upraviť účastníka</DialogTitle>
              <DialogDescription>Zmena informácií o účastníkovi</DialogDescription>
            </DialogHeader>
            {editParticipant && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">Meno</Label>
                    <Input
                      id="editFirstName"
                      value={editParticipant.firstName}
                      onChange={(e) => setEditParticipant({ ...editParticipant, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Priezvisko</Label>
                    <Input
                      id="editLastName"
                      value={editParticipant.lastName}
                      onChange={(e) => setEditParticipant({ ...editParticipant, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editParticipant.email}
                    onChange={(e) => setEditParticipant({ ...editParticipant, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Telefón</Label>
                  <Input
                    id="editPhone"
                    value={editParticipant.phone}
                    onChange={(e) => setEditParticipant({ ...editParticipant, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAffiliation">Pracovisko</Label>
                  <Input
                    id="editAffiliation"
                    value={editParticipant.affiliation}
                    onChange={(e) => setEditParticipant({ ...editParticipant, affiliation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCountry">Krajina</Label>
                  <Input
                    id="editCountry"
                    value={editParticipant.country}
                    onChange={(e) => setEditParticipant({ ...editParticipant, country: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditParticipantDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleUpdateParticipant}>Uložiť</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Student File Dialog */}
        <Dialog open={studentFileDialog} onOpenChange={setStudentFileDialog}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Študentský status</DialogTitle>
              <DialogDescription>Stiahnutie a správa overenia študentského statusu</DialogDescription>
            </DialogHeader>
            {studentFileParticipant && (
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Účastník</p>
                  <p className="font-medium break-words">
                    {studentFileParticipant.firstName} {studentFileParticipant.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="outline" className={getStudentStatusBadgeClass(studentFileParticipant)}>
                    {getStudentLabel(studentFileParticipant)}
                  </Badge>
                </div>
                {(() => {
                  const history = getStudentFileHistory(studentFileParticipant);
                  const latestStudentFile = history[0];
                  const historyWithoutLatest = history.slice(1);
                  if (!latestStudentFile) {
                    return (
                      <p className="text-sm text-gray-600">
                        Pre tohto účastníka zatiaľ nie je nahratý doklad študentského statusu.
                      </p>
                    );
                  }

                  const fileViewUrl = getFileViewUrl(latestStudentFile.id);
                  const fileDownloadUrl = getFileDownloadUrl(latestStudentFile.id);
                  const fileName = latestStudentFile.originalFileName || latestStudentFile.fileName;
                  const imageFile = isImageFile(fileName);
                  return (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Aktuálny súbor</p>
                        <p className="font-medium break-all">{fileName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open(fileViewUrl, "_blank", "noopener,noreferrer")}
                        className="w-full sm:w-64 border rounded-lg bg-gray-50 overflow-hidden text-left"
                        title="Otvoriť náhľad"
                      >
                        {imageFile ? (
                          <img
                            src={fileViewUrl}
                            alt={fileName}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center text-sm text-gray-600">
                            PDF náhľad
                          </div>
                        )}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = fileDownloadUrl;
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                          disabled={!latestStudentFile.id}
                        >
                          Stiahnuť
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleStudentStatusAction("approve", latestStudentFile.id)}
                          disabled={!latestStudentFile.id || studentStatusActionLoading !== null}
                        >
                          Schváliť
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleStudentStatusAction("reject", latestStudentFile.id)}
                          disabled={!latestStudentFile.id || studentStatusActionLoading !== null}
                        >
                          Zamietnuť
                        </Button>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-2">História dokladov</p>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Názov</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Akcie</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {historyWithoutLatest.map((file) => {
                                const fileHistoryViewUrl = getFileViewUrl(file.id);
                                const fileHistoryDownloadUrl = getFileDownloadUrl(file.id);
                                const fileHistoryName = file.originalFileName || file.fileName;
                                const historyImageFile = isImageFile(fileHistoryName);
                                return (
                                  <TableRow key={file.id}>
                                    <TableCell className="max-w-[320px] whitespace-normal break-all">
                                      <div className="space-y-2">
                                        <p>{fileHistoryName}</p>
                                        <button
                                          type="button"
                                          onClick={() => window.open(fileHistoryViewUrl, "_blank", "noopener,noreferrer")}
                                          className="w-24 border rounded bg-gray-50 overflow-hidden text-left"
                                          title="Otvoriť náhľad"
                                        >
                                          {historyImageFile ? (
                                            <img
                                              src={fileHistoryViewUrl}
                                              alt={fileHistoryName}
                                              className="w-full h-16 object-cover"
                                            />
                                          ) : (
                                            <div className="h-16 flex items-center justify-center text-[11px] text-gray-600">
                                              PDF
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className={getFileStatusBadgeClass(file)}>
                                        {getFileStatusLabel(file)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-wrap justify-end gap-2">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const link = document.createElement("a");
                                            link.href = fileHistoryDownloadUrl;
                                            link.download = fileHistoryName;
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                          }}
                                        >
                                          Stiahnuť
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {historyWithoutLatest.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-sm text-gray-600">
                                    Bez starších záznamov.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={submissionFileDialog} onOpenChange={setSubmissionFileDialog}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Príspevok</DialogTitle>
              <DialogDescription>Stiahnutie a správa nahraného príspevku alebo prezentácie</DialogDescription>
            </DialogHeader>
            {submissionFileParticipant && (
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Účastník</p>
                  <p className="font-medium break-words">
                    {submissionFileParticipant.firstName} {submissionFileParticipant.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="outline" className={getSubmissionStatusBadgeClass(submissionFileParticipant)}>
                    {getSubmissionLabel(submissionFileParticipant)}
                  </Badge>
                </div>
                {(() => {
                  const history = getSubmissionFileHistory(submissionFileParticipant);
                  const latestSubmissionFile = history[0];
                  const historyWithoutLatest = history.slice(1);
                  if (!latestSubmissionFile) {
                    return (
                      <p className="text-sm text-gray-600">
                        Pre tohto účastníka zatiaľ nie je nahratý príspevok ani prezentácia.
                      </p>
                    );
                  }

                  const fileViewUrl = getFileViewUrl(latestSubmissionFile.id);
                  const fileDownloadUrl = getFileDownloadUrl(latestSubmissionFile.id);
                  const fileName = latestSubmissionFile.originalFileName || latestSubmissionFile.fileName;
                  const imageFile = isImageFile(fileName);
                  return (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Aktuálny súbor</p>
                        <p className="font-medium break-all">{fileName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open(fileViewUrl, "_blank", "noopener,noreferrer")}
                        className="w-full sm:w-64 border rounded-lg bg-gray-50 overflow-hidden text-left"
                        title="Otvoriť náhľad"
                      >
                        {imageFile ? (
                          <img
                            src={fileViewUrl}
                            alt={fileName}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center text-sm text-gray-600">
                            Náhľad súboru
                          </div>
                        )}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = fileDownloadUrl;
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                          disabled={!latestSubmissionFile.id}
                        >
                          Stiahnuť
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSubmissionStatusAction("approve", latestSubmissionFile.id)}
                          disabled={!latestSubmissionFile.id || submissionStatusActionLoading !== null}
                        >
                          Schváliť
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleSubmissionStatusAction("reject", latestSubmissionFile.id)}
                          disabled={!latestSubmissionFile.id || submissionStatusActionLoading !== null}
                        >
                          Zamietnuť
                        </Button>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-2">História súborov</p>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Názov</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Akcie</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {historyWithoutLatest.map((file) => {
                                const fileHistoryViewUrl = getFileViewUrl(file.id);
                                const fileHistoryDownloadUrl = getFileDownloadUrl(file.id);
                                const fileHistoryName = file.originalFileName || file.fileName;
                                const historyImageFile = isImageFile(fileHistoryName);
                                return (
                                  <TableRow key={file.id}>
                                    <TableCell className="max-w-[320px] whitespace-normal break-all">
                                      <div className="space-y-2">
                                        <p>{fileHistoryName}</p>
                                        <button
                                          type="button"
                                          onClick={() => window.open(fileHistoryViewUrl, "_blank", "noopener,noreferrer")}
                                          className="w-24 border rounded bg-gray-50 overflow-hidden text-left"
                                          title="Otvoriť náhľad"
                                        >
                                          {historyImageFile ? (
                                            <img
                                              src={fileHistoryViewUrl}
                                              alt={fileHistoryName}
                                              className="w-full h-16 object-cover"
                                            />
                                          ) : (
                                            <div className="h-16 flex items-center justify-center text-[11px] text-gray-600">
                                              Súbor
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className={getFileStatusBadgeClass(file)}>
                                        {getFileStatusLabel(file)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-wrap justify-end gap-2">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const link = document.createElement("a");
                                            link.href = fileHistoryDownloadUrl;
                                            link.download = fileHistoryName;
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                          }}
                                        >
                                          Stiahnuť
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {historyWithoutLatest.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-sm text-gray-600">
                                    Bez starších záznamov.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Participant Dialog */}
        <AlertDialog open={deletePartDialog !== null} onOpenChange={() => setDeletePartDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Odstrániť účastníka?</AlertDialogTitle>
              <AlertDialogDescription>
                Táto akcia je nevratná. Naozaj chcete odstrániť tohto účastníka?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušiť</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletePartDialog && handleDeleteParticipant(deletePartDialog)}>
                Odstrániť
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
