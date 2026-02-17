import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { toast } from "sonner";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  Receipt,
  Hotel,
  UtensilsCrossed,
  Download,
  Send,
  Eye,
  UserPlus,
  Mail,
  Link as LinkIcon,
  Copy,
  Tag,
  Percent
} from "lucide-react";

// Mock data for participants
const initialParticipants = [
  {
    id: 1,
    name: "Ján Novák",
    email: "jan@example.com",
    affiliation: "STU Bratislava",
    country: "Slovensko",
    phone: "+421 901 234 567",
    registrationType: "Prednášajúci",
    registrationDate: "2026-02-01",
    status: "confirmed",
  },
  {
    id: 2,
    name: "Peter Szabó",
    email: "peter@example.com",
    affiliation: "ČVUT Praha",
    country: "Česko",
    phone: "+420 777 888 999",
    registrationType: "Účastník",
    registrationDate: "2026-02-05",
    status: "confirmed",
  },
  {
    id: 3,
    name: "Eva Horváthová",
    email: "eva@example.com",
    affiliation: "Univerzita Pavla Jozefa Šafárika",
    country: "Slovensko",
    phone: "+421 905 678 901",
    registrationType: "Študent",
    registrationDate: "2026-01-28",
    status: "pending",
  },
  {
    id: 4,
    name: "Maria Schmidt",
    email: "maria@mit.edu",
    affiliation: "MIT",
    country: "USA",
    phone: "+1 555 123 4567",
    registrationType: "Keynote speaker",
    registrationDate: "2026-01-15",
    status: "confirmed",
  },
];

// Mock data for speakers
const initialSpeakers = [
  {
    id: 1,
    name: "Dr. Maria Schmidt",
    affiliation: "MIT, USA",
    topic: "Umelá inteligencia",
    email: "maria@mit.edu",
  },
  {
    id: 2,
    name: "Prof. Anna Kováčová",
    affiliation: "UK, Slovensko",
    topic: "Biotechnológie",
    email: "anna@uniba.sk",
  },
];

// Mock data for submissions
const initialSubmissions = [
  {
    id: 1,
    title: "Hlboké učenie v lekárskej diagnostike",
    author: "Ján Novák",
    email: "jan@example.com",
    status: "pending",
    category: "AI",
  },
  {
    id: 2,
    title: "Kvantové algoritmy pre kryptografiu",
    author: "Peter Szabó",
    email: "peter@example.com",
    status: "accepted",
    category: "Kvantová fyzika",
  },
  {
    id: 3,
    title: "Obnoviteľné zdroje energie v meste",
    author: "Eva Horváthová",
    email: "eva@example.com",
    status: "rejected",
    category: "Energia",
  },
];

// Mock data for schedule
const initialSchedule = [
  {
    id: 1,
    day: "1",
    time: "09:00 - 10:00",
    title: "Hlavná prednáška: AI",
    speaker: "Dr. Maria Schmidt",
    location: "Hlavná sála",
  },
  {
    id: 2,
    day: "1",
    time: "10:30 - 12:00",
    title: "Paralelné sekcie",
    speaker: "Viacerí",
    location: "Sály A, B, C",
  },
];

// Mock data for invoices with detailed items
const initialInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2026-001",
    participants: ["Ján Novák"],
    email: "jan@example.com",
    items: [
      { name: "Registrácia - Prednášajúci", price: 350, quantity: 1 },
    ],
    subtotal: 350,
    discount: 0,
    couponCode: null,
    total: 350,
    status: "paid",
    date: "2026-02-01",
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-002",
    participants: ["Peter Szabó"],
    email: "peter@example.com",
    items: [
      { name: "Registrácia - Účastník", price: 450, quantity: 1 },
      { name: "Ubytovanie - Hotel Devín (3 noci)", price: 285, quantity: 1 },
      { name: "Ranná káva", price: 5, quantity: 3 },
      { name: "Obed - Štandardné", price: 12, quantity: 3 },
    ],
    subtotal: 786,
    discount: 0,
    couponCode: null,
    total: 786,
    status: "pending",
    date: "2026-02-05",
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-003",
    participants: ["Eva Horváthová", "Katarína Nová"],
    email: "eva@example.com",
    items: [
      { name: "Registrácia - Študent", price: 200, quantity: 2 },
      { name: "Ranná káva", price: 5, quantity: 6 },
    ],
    subtotal: 430,
    discount: 50,
    couponCode: "STUDENT50",
    total: 380,
    status: "overdue",
    date: "2026-01-28",
  },
];

// Mock data for accommodation
const initialAccommodation = [
  {
    id: 1,
    hotel: "Hotel Devín",
    address: "Riečna 4, Bratislava",
    roomType: "Jednolôžková",
    price: 85,
    available: 15,
    total: 30,
  },
  {
    id: 2,
    hotel: "Hotel Devín",
    address: "Riečna 4, Bratislava",
    roomType: "Dvojlôžková",
    price: 120,
    available: 8,
    total: 20,
  },
  {
    id: 3,
    hotel: "Hotel Marrol's",
    address: "Tobrucká 4, Bratislava",
    roomType: "Jednolôžková",
    price: 95,
    available: 10,
    total: 15,
  },
];

// Mock data for bookings
const initialBookings = [
  {
    id: 1,
    participant: "Ján Novák",
    hotel: "Hotel Devín",
    roomType: "Jednolôžková",
    checkIn: "2026-05-14",
    checkOut: "2026-05-18",
    nights: 4,
    total: 340,
  },
  {
    id: 2,
    participant: "Peter Szabó",
    hotel: "Hotel Marrol's",
    roomType: "Jednolôžková",
    checkIn: "2026-05-14",
    checkOut: "2026-05-17",
    nights: 3,
    total: 285,
  },
];

// Mock data for catering
const initialCateringOptions = [
  {
    id: 1,
    name: "Ranná káva",
    description: "Káva, čaj, pečivo",
    price: 5,
    available: true,
  },
  {
    id: 2,
    name: "Obed - Štandardné menu",
    description: "Hlavné jedlo, polievka, dezert",
    price: 12,
    available: true,
  },
  {
    id: 3,
    name: "Obed - Vegetariánske menu",
    description: "Vegetariánske jedlo, polievka, dezert",
    price: 12,
    available: true,
  },
  {
    id: 4,
    name: "Večerné prijatie",
    description: "Občerstvenie, nápoje",
    price: 15,
    available: true,
  },
];

const initialCateringOrders = [
  {
    id: 1,
    participant: "Ján Novák",
    items: "Ranná káva (3x), Obed - Štandardné (3x)",
    total: 51,
    status: "confirmed",
  },
  {
    id: 2,
    participant: "Eva Horváthová",
    items: "Ranná káva (3x), Obed - Vegetariánske (3x), Večerné prijatie (1x)",
    total: 66,
    status: "pending",
  },
];

// Mock data for discount coupons
const initialCoupons = [
  {
    id: 1,
    code: "STUDENT50",
    description: "Študentská zľava - €50",
    type: "fixed",
    value: 50,
    validFrom: "2026-01-01",
    validTo: "2026-05-14",
    maxUses: 50,
    usedCount: 12,
    active: true,
  },
  {
    id: 2,
    code: "SPEAKER2026",
    description: "Zľava pre prednášajúcich - 20%",
    type: "percentage",
    value: 20,
    validFrom: "2026-01-01",
    validTo: "2026-05-17",
    maxUses: null,
    usedCount: 8,
    active: true,
  },
  {
    id: 3,
    code: "PROMO100",
    description: "Propagačná akcia - €100 zľava",
    type: "fixed",
    value: 100,
    validFrom: "2026-02-01",
    validTo: "2026-02-28",
    maxUses: 20,
    usedCount: 20,
    active: false,
  },
];

export function Admin() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [speakers, setSpeakers] = useState(initialSpeakers);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [accommodation, setAccommodation] = useState(initialAccommodation);
  const [bookings, setBookings] = useState(initialBookings);
  const [cateringOptions, setCateringOptions] = useState(initialCateringOptions);
  const [cateringOrders, setCateringOrders] = useState(initialCateringOrders);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    participants: [] as string[],
    items: [] as { name: string; price: number; quantity: number }[],
  });

  const handleDeleteParticipant = (id: number) => {
    setParticipants(participants.filter((p) => p.id !== id));
    toast.success("Účastník bol odstránený");
  };

  const handleDeleteSpeaker = (id: number) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
    toast.success("Prednášajúci bol odstránený");
  };

  const handleDeleteSubmission = (id: number) => {
    setSubmissions(submissions.filter((s) => s.id !== id));
    toast.success("Príspevok bol odstránený");
  };

  const handleDeleteScheduleItem = (id: number) => {
    setSchedule(schedule.filter((s) => s.id !== id));
    toast.success("Položka programu bola odstránená");
  };

  const handleDeleteInvoice = (id: number) => {
    setInvoices(invoices.filter((i) => i.id !== id));
    toast.success("Faktúra bola odstránená");
  };

  const handleDeleteAccommodation = (id: number) => {
    setAccommodation(accommodation.filter((a) => a.id !== id));
    toast.success("Ubytovanie bolo odstránené");
  };

  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter((b) => b.id !== id));
    toast.success("Rezervácia bola odstránená");
  };

  const handleDeleteCateringOption = (id: number) => {
    setCateringOptions(cateringOptions.filter((c) => c.id !== id));
    toast.success("Možnosť stravy bola odstránená");
  };

  const handleDeleteCateringOrder = (id: number) => {
    setCateringOrders(cateringOrders.filter((c) => c.id !== id));
    toast.success("Objednávka bola odstránená");
  };

  const handleDeleteCoupon = (id: number) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast.success("Kupón bol odstránený");
  };

  const handleToggleCouponStatus = (id: number) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c
      )
    );
    toast.success("Stav kupónu bol aktualizovaný");
  };

  const validateCoupon = (code: string) => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.active
    );
    
    if (!coupon) {
      toast.error("Kupón neexistuje alebo nie je aktívny");
      return null;
    }
    
    const today = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
    
    if (today < validFrom || today > validTo) {
      toast.error("Kupón nie je platný v tomto období");
      return null;
    }
    
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      toast.error("Kupón už bol použitý maximálny počet krát");
      return null;
    }
    
    toast.success(`Kupón "${code}" bol úspešne aplikovaný!`);
    return coupon;
  };

  const calculateDiscount = (subtotal: number, coupon: any) => {
    if (!coupon) return 0;
    
    if (coupon.type === "percentage") {
      return (subtotal * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status } : s))
    );
    toast.success("Stav bol aktualizovaný");
  };

  const handleParticipantStatusChange = (id: number, status: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, status } : p))
    );
    toast.success("Stav účastníka bol aktualizovaný");
  };

  const handleInvoiceStatusChange = (id: number, status: string) => {
    setInvoices(
      invoices.map((i) => (i.id === id ? { ...i, status } : i))
    );
    toast.success("Stav faktúry bol aktualizovaný");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500">Prijatý</Badge>;
      case "rejected":
        return <Badge variant="destructive">Zamietnutý</Badge>;
      default:
        return <Badge variant="secondary">Čaká</Badge>;
    }
  };

  const getParticipantStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Potvrdený</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Zrušený</Badge>;
      default:
        return <Badge variant="secondary">Čaká</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Zaplatená</Badge>;
      case "overdue":
        return <Badge variant="destructive">Po splatnosti</Badge>;
      default:
        return <Badge variant="secondary">Čaká na platbu</Badge>;
    }
  };

  const getCateringStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Potvrdená</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Zrušená</Badge>;
      default:
        return <Badge variant="secondary">Čaká</Badge>;
    }
  };

  // Calculate stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter((i) => i.status === "paid").length;
  const totalBookings = bookings.length;
  const totalParticipants = participants.length;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Administračný panel</h1>
          <p className="text-gray-600">Správa konferencie SciConf 2026</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Účastníci</p>
                  <p className="text-2xl font-bold">{totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Príspevky</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tržby</p>
                  <p className="text-2xl font-bold">€{totalRevenue}</p>
                </div>
                <Receipt className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rezervácie</p>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                </div>
                <Hotel className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
            <TabsTrigger value="participants">Účastníci</TabsTrigger>
            <TabsTrigger value="speakers">Prednášajúci</TabsTrigger>
            <TabsTrigger value="submissions">Príspevky</TabsTrigger>
            <TabsTrigger value="schedule">Program</TabsTrigger>
            <TabsTrigger value="invoices">Faktúry</TabsTrigger>
            <TabsTrigger value="accommodation">Ubytovanie</TabsTrigger>
            <TabsTrigger value="catering">Strava</TabsTrigger>
            <TabsTrigger value="coupons">Kupóny</TabsTrigger>
            <TabsTrigger value="settings">Nastavenia</TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Správa účastníkov</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Pridať účastníka
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pridať účastníka</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label>Meno a priezvisko</Label>
                          <Input placeholder="Ján Novák" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="jan@example.com" />
                        </div>
                        <div>
                          <Label>Afiliácia</Label>
                          <Input placeholder="Univerzita, Inštitúcia" />
                        </div>
                        <div>
                          <Label>Krajina</Label>
                          <Input placeholder="Slovensko" />
                        </div>
                        <div>
                          <Label>Telefón</Label>
                          <Input placeholder="+421 901 234 567" />
                        </div>
                        <div>
                          <Label>Typ registrácie</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte typ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="speaker">Prednášajúci</SelectItem>
                              <SelectItem value="participant">Účastník</SelectItem>
                              <SelectItem value="student">Študent</SelectItem>
                              <SelectItem value="keynote">Keynote speaker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">
                          Pridať účastníka
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Registration Link Card */}
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">Registračný odkaz</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Odošlite pozvánku s registračným odkazom potenciálnym účastníkom
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={window.location.origin + "/register"}
                            readOnly
                            className="bg-white"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + "/register");
                              toast.success("Odkaz bol skopírovaný!");
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Kopírovať
                          </Button>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <Send className="w-4 h-4" />
                            Odoslať pozvánku
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Odoslať registračnú pozvánku</DialogTitle>
                          </DialogHeader>
                          <form className="space-y-4">
                            <div>
                              <Label>Emailové adresy</Label>
                              <Textarea
                                placeholder="email1@example.com, email2@example.com, ..."
                                rows={4}
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Zadajte emailové adresy oddelené čiarkou
                              </p>
                            </div>
                            <div>
                              <Label>Predmet emailu</Label>
                              <Input defaultValue="Pozvánka na SciConf 2026" />
                            </div>
                            <div>
                              <Label>Správa</Label>
                              <Textarea
                                rows={6}
                                defaultValue={`Dobrý deň,

s potešením Vás pozývame na Medzinárodnú vedeckú konferenciu SciConf 2026, ktorá sa uskutoční 15-17 mája 2026 v Bratislave.

Pre dokončenie registrácie kliknite na nasledujúci odkaz:
${window.location.origin}/register

Tešíme sa na Vašu účasť!

S pozdravom,
Organizačný tým SciConf 2026`}
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.success("Pozvánky boli odoslané!");
                              }}
                            >
                              Odoslať pozvánky
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Celkom účastníkov</p>
                      <p className="text-2xl font-bold">{participants.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Potvrdení</p>
                      <p className="text-2xl font-bold">
                        {participants.filter((p) => p.status === "confirmed").length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Čakajúci</p>
                      <p className="text-2xl font-bold">
                        {participants.filter((p) => p.status === "pending").length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meno</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Afiliácia</TableHead>
                      <TableHead>Krajina</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Dátum reg.</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.affiliation}</TableCell>
                        <TableCell>{participant.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{participant.registrationType}</Badge>
                        </TableCell>
                        <TableCell>{participant.registrationDate}</TableCell>
                        <TableCell>
                          {getParticipantStatusBadge(participant.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Select
                              value={participant.status}
                              onValueChange={(value) =>
                                handleParticipantStatusChange(participant.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Čaká</SelectItem>
                                <SelectItem value="confirmed">Potvrdený</SelectItem>
                                <SelectItem value="cancelled">Zrušený</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteParticipant(participant.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Speakers Tab */}
          <TabsContent value="speakers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Správa prednášajúcich</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Pridať prednášajúceho
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pridať prednášajúceho</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label>Meno</Label>
                          <Input placeholder="Dr. Meno Priezvisko" />
                        </div>
                        <div>
                          <Label>Afiliácia</Label>
                          <Input placeholder="Univerzita, Krajina" />
                        </div>
                        <div>
                          <Label>Téma</Label>
                          <Input placeholder="Oblasť výskumu" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="email@example.com" />
                        </div>
                        <Button type="submit" className="w-full">
                          Pridať
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meno</TableHead>
                      <TableHead>Afiliácia</TableHead>
                      <TableHead>Téma</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {speakers.map((speaker) => (
                      <TableRow key={speaker.id}>
                        <TableCell className="font-medium">{speaker.name}</TableCell>
                        <TableCell>{speaker.affiliation}</TableCell>
                        <TableCell>{speaker.topic}</TableCell>
                        <TableCell>{speaker.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSpeaker(speaker.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Správa príspevkov</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Názov</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Kategória</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium max-w-xs">
                          {submission.title}
                        </TableCell>
                        <TableCell>{submission.author}</TableCell>
                        <TableCell>{submission.category}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Select
                              value={submission.status}
                              onValueChange={(value) =>
                                handleStatusChange(submission.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Čaká</SelectItem>
                                <SelectItem value="accepted">Prijatý</SelectItem>
                                <SelectItem value="rejected">Zamietnutý</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Správa programu</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Pridať položku
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pridať položku programu</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label>Deň</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte deň" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Deň 1</SelectItem>
                              <SelectItem value="2">Deň 2</SelectItem>
                              <SelectItem value="3">Deň 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Čas</Label>
                          <Input placeholder="09:00 - 10:00" />
                        </div>
                        <div>
                          <Label>Názov</Label>
                          <Input placeholder="Názov udalosti" />
                        </div>
                        <div>
                          <Label>Prednášajúci</Label>
                          <Input placeholder="Meno prednášajúceho" />
                        </div>
                        <div>
                          <Label>Miesto</Label>
                          <Input placeholder="Sála" />
                        </div>
                        <Button type="submit" className="w-full">
                          Pridať
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deň</TableHead>
                      <TableHead>Čas</TableHead>
                      <TableHead>Názov</TableHead>
                      <TableHead>Prednášajúci</TableHead>
                      <TableHead>Miesto</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>Deň {item.day}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.speaker}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteScheduleItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Správa faktúr</CardTitle>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Vytvoriť faktúru
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Vytvoriť novú faktúru</DialogTitle>
                          </DialogHeader>
                          <form className="space-y-4">
                            <div>
                              <Label>Číslo faktúry</Label>
                              <Input placeholder="INV-2026-XXX" />
                            </div>

                            <div>
                              <Label>Účastníci</Label>
                              <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
                                {participants.map((participant) => (
                                  <div key={participant.id} className="flex items-center space-x-2">
                                    <Checkbox id={`participant-${participant.id}`} />
                                    <label
                                      htmlFor={`participant-${participant.id}`}
                                      className="text-sm cursor-pointer flex-1"
                                    >
                                      {participant.name} ({participant.email})
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label>Email pre faktúru</Label>
                              <Input type="email" placeholder="email@example.com" />
                            </div>

                            <div className="border-t pt-4">
                              <Label className="text-base mb-3 block">Položky faktúry</Label>
                              
                              <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <Label className="text-sm font-semibold">Registrácia</Label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Checkbox id="reg-speaker" />
                                      <label htmlFor="reg-speaker" className="text-sm flex-1">
                                        Prednášajúci - €350
                                      </label>
                                      <Input 
                                        type="number" 
                                        placeholder="Počet" 
                                        className="w-20" 
                                        min="0"
                                        defaultValue="0"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox id="reg-participant" />
                                      <label htmlFor="reg-participant" className="text-sm flex-1">
                                        Účastník - €450
                                      </label>
                                      <Input 
                                        type="number" 
                                        placeholder="Počet" 
                                        className="w-20" 
                                        min="0"
                                        defaultValue="0"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox id="reg-student" />
                                      <label htmlFor="reg-student" className="text-sm flex-1">
                                        Študent - €200
                                      </label>
                                      <Input 
                                        type="number" 
                                        placeholder="Počet" 
                                        className="w-20" 
                                        min="0"
                                        defaultValue="0"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-md">
                                  <Label className="text-sm font-semibold">Ubytovanie</Label>
                                  <div className="mt-2 space-y-2">
                                    {accommodation.map((acc) => (
                                      <div key={acc.id} className="flex items-center gap-2">
                                        <Checkbox id={`acc-${acc.id}`} />
                                        <label htmlFor={`acc-${acc.id}`} className="text-sm flex-1">
                                          {acc.hotel} - {acc.roomType} (€{acc.price}/noc)
                                        </label>
                                        <Input 
                                          type="number" 
                                          placeholder="Nocí" 
                                          className="w-20" 
                                          min="0"
                                          defaultValue="0"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-md">
                                  <Label className="text-sm font-semibold">Strava</Label>
                                  <div className="mt-2 space-y-2">
                                    {cateringOptions.map((option) => (
                                      <div key={option.id} className="flex items-center gap-2">
                                        <Checkbox id={`food-${option.id}`} />
                                        <label htmlFor={`food-${option.id}`} className="text-sm flex-1">
                                          {option.name} - €{option.price}
                                        </label>
                                        <Input 
                                          type="number" 
                                          placeholder="Počet" 
                                          className="w-20" 
                                          min="0"
                                          defaultValue="0"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label>Dátum</Label>
                              <Input type="date" />
                            </div>

                            <div className="border-t pt-4">
                              <Label className="mb-2 block">Zľavový kupón</Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Zadajte kód kupónu"
                                  value={appliedCoupon}
                                  onChange={(e) => setAppliedCoupon(e.target.value.toUpperCase())}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    if (appliedCoupon) {
                                      validateCoupon(appliedCoupon);
                                    }
                                  }}
                                >
                                  Aplikovať
                                </Button>
                              </div>
                              {appliedCoupon && validateCoupon(appliedCoupon) && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                                  <Tag className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-700">
                                    Kupón "{appliedCoupon}" bol aplikovaný
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                              <div className="flex justify-between text-gray-600">
                                <span>Medzisúčet:</span>
                                <span>€0.00</span>
                              </div>
                              {appliedCoupon && validateCoupon(appliedCoupon) && (
                                <div className="flex justify-between text-green-600">
                                  <span>Zľava:</span>
                                  <span>-€0.00</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                <span>Celková suma:</span>
                                <span>€0.00</span>
                              </div>
                            </div>

                            <Button type="submit" className="w-full">
                              Vytvoriť faktúru
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Celkové tržby</p>
                        <p className="text-2xl font-bold">€{totalRevenue}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Zaplatené</p>
                        <p className="text-2xl font-bold">{paidInvoices}/{invoices.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Nezaplatené</p>
                        <p className="text-2xl font-bold text-red-600">
                          {invoices.filter((i) => i.status !== "paid").length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Číslo faktúry</TableHead>
                        <TableHead>Účastníci</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Suma</TableHead>
                        <TableHead>Dátum</TableHead>
                        <TableHead>Stav</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {invoice.participants.map((p, idx) => (
                                <span key={idx} className="text-sm">
                                  {p}
                                </span>
                              ))}
                              {invoice.participants.length > 1 && (
                                <Badge variant="secondary" className="w-fit mt-1">
                                  +{invoice.participants.length} účastníci
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{invoice.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {invoice.couponCode && (
                                <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{invoice.couponCode}</span>
                                </div>
                              )}
                              <span className="font-semibold">€{invoice.total.toFixed(2)}</span>
                              {invoice.discount > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                  €{invoice.subtotal}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Zobraziť detail"
                                    onClick={() => setSelectedInvoice(invoice)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Detail faktúry {invoice.invoiceNumber}</DialogTitle>
                                  </DialogHeader>
                                  {selectedInvoice && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm text-gray-600">Účastníci</Label>
                                        <p className="font-medium">
                                          {selectedInvoice.participants.join(", ")}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Email</Label>
                                        <p className="font-medium">{selectedInvoice.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600 mb-2 block">
                                          Položky faktúry
                                        </Label>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Položka</TableHead>
                                              <TableHead>Cena</TableHead>
                                              <TableHead>Počet</TableHead>
                                              <TableHead className="text-right">Spolu</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedInvoice.items.map((item: any, idx: number) => (
                                              <TableRow key={idx}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>€{item.price}</TableCell>
                                                <TableCell>{item.quantity}x</TableCell>
                                                <TableCell className="text-right">
                                                  €{item.price * item.quantity}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                      <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-gray-600">
                                          <span>Medzisúčet:</span>
                                          <span>€{selectedInvoice.subtotal}</span>
                                        </div>
                                        {selectedInvoice.couponCode && selectedInvoice.discount > 0 && (
                                          <div className="flex justify-between text-green-600">
                                            <span className="flex items-center gap-2">
                                              <Tag className="w-4 h-4" />
                                              Zľava ({selectedInvoice.couponCode}):
                                            </span>
                                            <span>-€{selectedInvoice.discount.toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                          <span>Celková suma:</span>
                                          <span>€{selectedInvoice.total.toFixed(2)}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Dátum</Label>
                                        <p className="font-medium">{selectedInvoice.date}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Stav</Label>
                                        <div className="mt-1">
                                          {getInvoiceStatusBadge(selectedInvoice.status)}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Select
                                value={invoice.status}
                                onValueChange={(value) =>
                                  handleInvoiceStatusChange(invoice.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Čaká</SelectItem>
                                  <SelectItem value="paid">Zaplatená</SelectItem>
                                  <SelectItem value="overdue">Po splatnosti</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm" title="Stiahnuť PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Odoslať email">
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteInvoice(invoice.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accommodation Tab */}
          <TabsContent value="accommodation">
            <div className="space-y-6">
              {/* Accommodation Options */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Možnosti ubytovania</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Pridať ubytovanie
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pridať možnosť ubytovania</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div>
                            <Label>Názov hotela</Label>
                            <Input placeholder="Hotel XYZ" />
                          </div>
                          <div>
                            <Label>Adresa</Label>
                            <Input placeholder="Ulica 123, Bratislava" />
                          </div>
                          <div>
                            <Label>Typ izby</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Vyberte typ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Jednolôžková</SelectItem>
                                <SelectItem value="double">Dvojlôžková</SelectItem>
                                <SelectItem value="suite">Apartmán</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Cena za noc (€)</Label>
                            <Input type="number" placeholder="85" />
                          </div>
                          <div>
                            <Label>Dostupné izby</Label>
                            <Input type="number" placeholder="15" />
                          </div>
                          <div>
                            <Label>Celkový počet izieb</Label>
                            <Input type="number" placeholder="30" />
                          </div>
                          <Button type="submit" className="w-full">
                            Pridať
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Adresa</TableHead>
                        <TableHead>Typ izby</TableHead>
                        <TableHead>Cena/noc</TableHead>
                        <TableHead>Dostupnosť</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accommodation.map((acc) => (
                        <TableRow key={acc.id}>
                          <TableCell className="font-medium">{acc.hotel}</TableCell>
                          <TableCell>{acc.address}</TableCell>
                          <TableCell>{acc.roomType}</TableCell>
                          <TableCell>€{acc.price}</TableCell>
                          <TableCell>
                            <span className={acc.available > 5 ? "text-green-600" : "text-red-600"}>
                              {acc.available}/{acc.total}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAccommodation(acc.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Bookings */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Rezervácie ubytovania</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Nová rezervácia
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Vytvoriť rezerváciu</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div>
                            <Label>Účastník</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Vyberte účastníka" />
                              </SelectTrigger>
                              <SelectContent>
                                {participants.map((p) => (
                                  <SelectItem key={p.id} value={p.name}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Hotel</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Vyberte hotel" />
                              </SelectTrigger>
                              <SelectContent>
                                {accommodation.map((acc) => (
                                  <SelectItem key={acc.id} value={acc.hotel}>
                                    {acc.hotel} - {acc.roomType}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Check-in</Label>
                            <Input type="date" />
                          </div>
                          <div>
                            <Label>Check-out</Label>
                            <Input type="date" />
                          </div>
                          <Button type="submit" className="w-full">
                            Vytvoriť rezerváciu
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Účastník</TableHead>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Typ izby</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Nocí</TableHead>
                        <TableHead>Celkom</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.participant}
                          </TableCell>
                          <TableCell>{booking.hotel}</TableCell>
                          <TableCell>{booking.roomType}</TableCell>
                          <TableCell>{booking.checkIn}</TableCell>
                          <TableCell>{booking.checkOut}</TableCell>
                          <TableCell>{booking.nights}</TableCell>
                          <TableCell>€{booking.total}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBooking(booking.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Catering Tab */}
          <TabsContent value="catering">
            <div className="space-y-6">
              {/* Catering Options */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Možnosti stravy</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Pridať možnosť
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pridať možnosť stravy</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div>
                            <Label>Názov</Label>
                            <Input placeholder="Obed - Štandardné menu" />
                          </div>
                          <div>
                            <Label>Popis</Label>
                            <Textarea placeholder="Hlavné jedlo, polievka, dezert" />
                          </div>
                          <div>
                            <Label>Cena (€)</Label>
                            <Input type="number" placeholder="12" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="available" />
                            <Label htmlFor="available">Dostupné</Label>
                          </div>
                          <Button type="submit" className="w-full">
                            Pridať
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Názov</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead>Cena</TableHead>
                        <TableHead>Dostupnosť</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cateringOptions.map((option) => (
                        <TableRow key={option.id}>
                          <TableCell className="font-medium">{option.name}</TableCell>
                          <TableCell>{option.description}</TableCell>
                          <TableCell>€{option.price}</TableCell>
                          <TableCell>
                            {option.available ? (
                              <Badge className="bg-green-500">Dostupné</Badge>
                            ) : (
                              <Badge variant="destructive">Nedostupné</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCateringOption(option.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Catering Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Objednávky stravy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Celkový počet objednávok: <strong>{cateringOrders.length}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Celková hodnota: <strong>
                        €{cateringOrders.reduce((sum, order) => sum + order.total, 0)}
                      </strong>
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Účastník</TableHead>
                        <TableHead>Položky</TableHead>
                        <TableHead>Celkom</TableHead>
                        <TableHead>Stav</TableHead>
                        <TableHead className="text-right">Akcie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cateringOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.participant}
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>€{order.total}</TableCell>
                          <TableCell>{getCateringStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCateringOrder(order.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Správa zľavových kupónov</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Vytvoriť kupón
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Vytvoriť nový kupón</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label>Kód kupónu *</Label>
                          <Input placeholder="EARLY2026" className="uppercase" />
                          <p className="text-sm text-gray-500 mt-1">
                            Zadajte jedinečný kód (napr. EARLY2026, STUDENT50)
                          </p>
                        </div>
                        <div>
                          <Label>Popis</Label>
                          <Input placeholder="Skorá registrácia - 15% zľava" />
                        </div>
                        <div>
                          <Label>Typ zľavy *</Label>
                          <Select defaultValue="percentage">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentuálna zľava (%)</SelectItem>
                              <SelectItem value="fixed">Fixná suma (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Hodnota zľavy *</Label>
                          <Input type="number" placeholder="15" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Platné od</Label>
                            <Input type="date" defaultValue="2026-01-01" />
                          </div>
                          <div>
                            <Label>Platné do</Label>
                            <Input type="date" defaultValue="2026-03-31" />
                          </div>
                        </div>
                        <div>
                          <Label>Max. počet použití</Label>
                          <Input type="number" placeholder="100" />
                          <p className="text-sm text-gray-500 mt-1">
                            Nechajte prázdne pre neobmedzený počet
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="active" defaultChecked />
                          <Label htmlFor="active">Aktívny</Label>
                        </div>
                        <Button type="submit" className="w-full">
                          Vytvoriť kupón
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Celkom kupónov</p>
                          <p className="text-2xl font-bold">{coupons.length}</p>
                        </div>
                        <Tag className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Aktívne</p>
                          <p className="text-2xl font-bold">
                            {coupons.filter((c) => c.active).length}
                          </p>
                        </div>
                        <Tag className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Celkom použití</p>
                          <p className="text-2xl font-bold">
                            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                          </p>
                        </div>
                        <Percent className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kód</TableHead>
                      <TableHead>Popis</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Hodnota</TableHead>
                      <TableHead>Platnosť</TableHead>
                      <TableHead>Použitia</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead className="text-right">Akcie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="font-mono font-semibold">{coupon.code}</span>
                          </div>
                        </TableCell>
                        <TableCell>{coupon.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {coupon.type === "percentage" ? "Percentuálna" : "Fixná suma"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {coupon.type === "percentage" ? `${coupon.value}%` : `€${coupon.value}`}
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.validFrom} - {coupon.validTo}
                        </TableCell>
                        <TableCell>
                          <span className={coupon.maxUses && coupon.usedCount >= coupon.maxUses ? "text-red-600 font-semibold" : ""}>
                            {coupon.usedCount}
                            {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          {coupon.active ? (
                            <Badge className="bg-green-500">Aktívny</Badge>
                          ) : (
                            <Badge variant="secondary">Neaktívny</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleCouponStatus(coupon.id)}
                            >
                              {coupon.active ? "Deaktivovať" : "Aktivovaťť"}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Nastavenia konferencie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Názov konferencie</Label>
                  <Input defaultValue="SciConf 2026" />
                </div>
                <div>
                  <Label>Dátum konferencie</Label>
                  <Input defaultValue="15-17 mája 2026" />
                </div>
                <div>
                  <Label>Miesto konania</Label>
                  <Input defaultValue="Bratislava, Slovensko" />
                </div>
                <div>
                  <Label>Kontaktný email</Label>
                  <Input defaultValue="info@sciconf2026.sk" />
                </div>
                <div>
                  <Label>Telefón</Label>
                  <Input defaultValue="+421 123 456 789" />
                </div>
                <div>
                  <Label>Uvítacia správa</Label>
                  <Textarea
                    rows={4}
                    defaultValue="Vitajte na Medzinárodnej vedeckej konferencii 2026. Spojenie najlepších vedeckých myslí z celého sveta."
                  />
                </div>
                <div>
                  <Label>Registračný poplatok - Prednášajúci (€)</Label>
                  <Input type="number" defaultValue="350" />
                </div>
                <div>
                  <Label>Registračný poplatok - Účastník (€)</Label>
                  <Input type="number" defaultValue="450" />
                </div>
                <div>
                  <Label>Registračný poplatok - Študent (€)</Label>
                  <Input type="number" defaultValue="200" />
                </div>
                <div>
                  <Label>Skorá registrácia - zľava (%)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <Button>Uložiť zmeny</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
