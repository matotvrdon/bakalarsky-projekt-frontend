import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Badge } from "../components/ui/badge.tsx";
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
  Pencil, Trash2, Users, Receipt
} from "lucide-react";
import {
  getAllConferences,
  createConference,
  updateConference,
  deleteConference
} from "../api/conferenceApi.ts";
import { getParticipantsByActiveConference, type FileManagerPayload } from "../api/participantApi.ts";
import { BASE_URL } from "../api/baseApi.ts";
import { approveFileManager, rejectFileManager } from "../api/fileManagerApi.ts";
import { toast } from "sonner";

type Conference = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  participantsCount: number;
};

type Participant = {
  id: number;
  firstName: string;
  lastName: string;
  registrationType: number | null;
  isStudent: boolean;
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

const getRegistrationTypeLabel = (registrationType: number | null) => {
  if (registrationType === 1) return "Účastník s príspevkom";
  if (registrationType === 2) return "Účastník bez príspevku";
  return "Nezvolený";
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

const getStudentStatusBadgeClass = (participant: Participant) => {
  const label = getStudentLabel(participant);
  if (label === "Schválené") return "bg-green-100 text-green-800 border-green-200";
  if (label === "Čaká na schválenie") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (label === "Zamietnutý") return "bg-red-100 text-red-800 border-red-200";
  if (label === "Zvolený, neschválený") return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getStudentFileHistory = (participant: Participant) =>
  participant.fileManagers
    .filter((file) => normalizeFileType(file.fileType) === STUDENT_VERIFICATION_FILE_TYPE)
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
  const [deleteConfDialog, setDeleteConfDialog] = useState<number | null>(null);
  const [editParticipantDialog, setEditParticipantDialog] = useState(false);
  const [studentFileDialog, setStudentFileDialog] = useState(false);
  const [studentFileParticipant, setStudentFileParticipant] = useState<Participant | null>(null);
  const [studentStatusActionLoading, setStudentStatusActionLoading] = useState<"approve" | "reject" | null>(null);
  const [deletePartDialog, setDeletePartDialog] = useState<number | null>(null);
  const [newInvoiceDialog, setNewInvoiceDialog] = useState(false);
  const [editInvoiceDialog, setEditInvoiceDialog] = useState(false);
  const [deleteInvoiceDialog, setDeleteInvoiceDialog] = useState<number | null>(null);

  // Form data
  const [newConference, setNewConference] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [editConference, setEditConference] = useState<Conference | null>(null);
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
              registrationType: participant.registrationType,
              isStudent: participant.isStudent,
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

  const handleCreateConference = async () => {
    if (!newConference.name || !newConference.startDate || !newConference.endDate) return;
    try {
      await createConference({
        name: newConference.name,
        startDate: newConference.startDate,
        endDate: newConference.endDate,
        location: newConference.location
      });
      setNewConferenceDialog(false);
      setNewConference({ name: "", startDate: "", endDate: "", location: "" });
      loadConferences();
    } catch (error) {
      console.error("Failed to create conference", error);
    }
  };

  const handleUpdateConference = async () => {
    if (!editConference) return;
    try {
      await updateConference(editConference.id, {
        name: editConference.name,
        startDate: editConference.startDate,
        endDate: editConference.endDate,
        location: editConference.location,
        isActive: editConference.isActive
      });
      setEditConferenceDialog(false);
      setEditConference(null);
      loadConferences();
    } catch (error) {
      console.error("Failed to update conference", error);
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

  const openStudentStatusDialog = (participant: Participant) => {
    if (!participant.isStudent) return;
    setStudentFileParticipant(participant);
    setStudentFileDialog(true);
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
                            onClick={() => {
                              setEditConference(conf);
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
                        <TableHead>Typ registrácie</TableHead>
                        <TableHead>Študentský status</TableHead>
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
                              {getRegistrationTypeLabel(participant.registrationType)}
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
                        <span className="text-gray-600">Typ registrácie:</span>
                        <Badge variant="secondary">{getRegistrationTypeLabel(participant.registrationType)}</Badge>
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
