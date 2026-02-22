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
import { toast } from "sonner";

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

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [participationType, setParticipationType] = useState<string>("");
  const [isStudent, setIsStudent] = useState(false);
  const [studentProofFile, setStudentProofFile] = useState<File | null>(null);
  const [participantDraft, setParticipantDraft] = useState<ParticipantPayload | null>(null);
  const [savedRegistrationType, setSavedRegistrationType] = useState<ParticipantPayload["registrationType"]>(null);
  const [savedIsStudent, setSavedIsStudent] = useState(false);
  const [savingParticipant, setSavingParticipant] = useState(false);
  const [saveParticipantError, setSaveParticipantError] = useState("");
  const [willPresent, setWillPresent] = useState(false);
  const [submission, setSubmission] = useState({
    title: "",
    abstract: "",
    keywords: "",
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
    setParticipationType(
      participant.registrationType === 1
        ? "participantWithSubmission"
        : participant.registrationType === 2
          ? "participantWithoutSubmission"
          : ""
    );
    setIsStudent(participant.isStudent);
    setSavedRegistrationType(participant.registrationType);
    setSavedIsStudent(participant.isStudent);
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
            registrationType: null,
            isStudent: false,
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

  const updateDraft = (updates: Partial<ParticipantPayload>) => {
    setParticipantDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("participantDraft", JSON.stringify(next));
      return next;
    });
  };

  const handleSaveParticipation = async () => {
    if (!participantDraft) return;
    if (participantDraft.registrationType === null && !participantDraft.isStudent) {
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

      if (
        savedParticipant.isStudent &&
        studentProofFile &&
        !isStudentStatusLocked &&
        savedParticipant.id > 0
      ) {
        await uploadParticipantFile(savedParticipant.id, STUDENT_VERIFICATION_FILE_TYPE, studentProofFile);
      }

      const refreshedParticipant = await getParticipantByUserId(currentUser.id);
      applyParticipantState(refreshedParticipant);
      setStudentProofFile(null);
      toast.success("Zmeny sú uložené v databáze");
    } catch (error) {
      setSaveParticipantError(error instanceof Error ? error.message : "Uloženie zlyhalo");
    } finally {
      setSavingParticipant(false);
    }
  };

  useEffect(() => {
    if (!participantDraft) return;
    const registrationType =
      participationType === "participantWithSubmission"
        ? 1
        : participationType === "participantWithoutSubmission"
          ? 2
          : null;

    updateDraft({ registrationType, isStudent });
  }, [participationType, isStudent, studentProofFile]);

  const accommodationOptions = [
    { id: 1, name: "Hotel Devín - Jednolôžková", price: 85 },
    { id: 2, name: "Hotel Devín - Dvojlôžková", price: 120 },
    { id: 3, name: "Hotel Marrol's - Jednolôžková", price: 95 },
  ];

  const cateringOptions = [
    { id: 1, name: "Celodňové stravovanie (3 dni)", price: 120 },
    { id: 2, name: "Obed + večera (3 dni)", price: 85 },
    { id: 3, name: "Len obed (3 dni)", price: 45 },
  ];

  const calculateTotal = () => {
    let total = 0;
    
    // Registration fee
    if (participationType === "participantWithSubmission" || participationType === "participantWithoutSubmission") {
      total += 100;
    }

    // Accommodation
    if (accommodation) {
      const option = accommodationOptions.find(o => o.id === accommodation);
      if (option) total += option.price * 3; // 3 nights
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

  const participationTypeLabel =
    savedRegistrationType === 1
      ? "Účastník s príspevkom"
      : savedRegistrationType === 2
        ? "Účastník bez príspevku"
        : "Nezvolený";

  const studentVerificationFile = participantDraft?.fileManagers?.find(
    (file) => normalizeFileType(file.fileType) === STUDENT_VERIFICATION_FILE_TYPE
  );
  const studentVerificationStatus = studentVerificationFile
    ? normalizeFileStatus(studentVerificationFile.fileStatus)
    : null;
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

  const hasParticipationChanges = Boolean(
    participantDraft &&
      (participantDraft.registrationType !== savedRegistrationType ||
        participantDraft.isStudent !== savedIsStudent ||
        (participantDraft.isStudent && !isStudentStatusLocked && Boolean(studentProofFile)))
  );

  if (!currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vitajte, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2">Správa vašej účasti na konferencii</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Účasť</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold">{participationTypeLabel}</div>
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
                <CardTitle>Typ účasti</CardTitle>
                <CardDescription>Vyberte si typ vašej účasti na konferencii</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={participationType} onValueChange={setParticipationType}>
                  <Label 
                    htmlFor="participantWithSubmission"
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="participantWithSubmission" id="participantWithSubmission" />
                    <div className="flex-1">
                      <div className="font-semibold">
                        Účastník s príspevkom
                      </div>
                      <p className="text-sm text-gray-600">Účasť + vedecký príspevok</p>
                    </div>
                    <Badge variant="secondary">100 €</Badge>
                  </Label>

                  <Label 
                    htmlFor="participantWithoutSubmission"
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="participantWithoutSubmission" id="participantWithoutSubmission" />
                    <div className="flex-1">
                      <div className="font-semibold">
                        Účastník bez príspevku
                      </div>
                      <p className="text-sm text-gray-600">Účasť bez príspevku</p>
                    </div>
                    <Badge variant="secondary">100 €</Badge>
                  </Label>
                </RadioGroup>

                {participationType && (
                  <>
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                      <Label className="text-base font-semibold">Študentský status</Label>
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

                      {isStudentStatusLocked && studentVerificationStatus === WAITING_FOR_APPROVAL_STATUS && (
                        <p className="text-sm text-gray-600">
                          Študentský status čaká na schválenie. Zmenu momentálne nie je možné vykonať.
                        </p>
                      )}

                      {isStudentStatusLocked && studentVerificationStatus === APPROVED_STATUS && (
                        <p className="text-sm text-gray-600">
                          Študentský status bol schválený. Zmenu nie je možné vykonať.
                        </p>
                      )}

                      {isStudent && !isStudentStatusLocked && (
                        <div className="space-y-2">
                          <Label htmlFor="studentProofDashboard">Nahrať overenie študentského statusu</Label>
                          <Input
                            id="studentProofDashboard"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setStudentProofFile(e.target.files?.[0] || null)}
                          />
                        </div>
                      )}

                      {saveParticipantError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{saveParticipantError}</AlertDescription>
                        </Alert>
                      )}

                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
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
                  {participationType === "participantWithSubmission" 
                    ? "Vyplňte informácie o vašom príspevku"
                    : "Dostupné len pre účastníkov"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {participationType === "participantWithSubmission" ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Názov príspevku *</Label>
                        <Input
                          id="title"
                          value={submission.title}
                          onChange={(e) => setSubmission({...submission, title: e.target.value})}
                          placeholder="Názov vášho príspevku"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="abstract">Abstrakt *</Label>
                        <Textarea
                          id="abstract"
                          value={submission.abstract}
                          onChange={(e) => setSubmission({...submission, abstract: e.target.value})}
                          placeholder="Stručný popis vášho príspevku (max 300 slov)"
                          rows={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keywords">Kľúčové slová</Label>
                        <Input
                          id="keywords"
                          value={submission.keywords}
                          onChange={(e) => setSubmission({...submission, keywords: e.target.value})}
                          placeholder="AI, Machine Learning, Deep Learning"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="willPresent" 
                          checked={willPresent}
                          onCheckedChange={(checked) => setWillPresent(checked as boolean)}
                        />
                        <Label htmlFor="willPresent">Som prezentér príspevku</Label>
                      </div>

                      <Button className="w-full">Uložiť príspevok</Button>
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
                  <CardDescription>Vyberte si ubytovanie počas konferencie (14-17 mája)</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={accommodation?.toString()} onValueChange={(val) => setAccommodation(parseInt(val))}>
                    {accommodationOptions.map((option) => (
                      <Label 
                        key={option.id} 
                        htmlFor={`accom-${option.id}`} 
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem value={option.id.toString()} id={`accom-${option.id}`} />
                        <div className="flex-1">
                          <div className="font-semibold">
                            {option.name}
                          </div>
                          <p className="text-sm text-gray-600">3 noci (14-17 mája)</p>
                        </div>
                        <Badge variant="secondary">{option.price * 3} €</Badge>
                      </Label>
                    ))}
                  </RadioGroup>
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
                  {cateringOptions.map((option) => (
                    <Label 
                      key={option.id} 
                      htmlFor={`catering-${option.id}`} 
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
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
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {option.name}
                        </div>
                      </div>
                      <Badge variant="secondary">{option.price} €</Badge>
                    </Label>
                  ))}
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
                      {participationType && (
                        <div className="flex justify-between py-2 border-b">
                          <span>
                            Registračný poplatok ({participationType === "participantWithSubmission" ? "Účastník s príspevkom" : "Účastník bez príspevku"})
                          </span>
                          <span className="font-semibold whitespace-nowrap">
                            100 €
                          </span>
                        </div>
                      )}
                      {accommodation && (
                        <div className="flex justify-between py-2 border-b">
                          <span>Ubytovanie (3 noci)</span>
                          <span className="font-semibold whitespace-nowrap">
                            {accommodationOptions.find(o => o.id === accommodation)!.price * 3} €
                          </span>
                        </div>
                      )}
                      {catering.map(id => {
                        const option = cateringOptions.find(o => o.id === id)!;
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
                      disabled={!participationType || (invoiceType === "join-shared" && !joinCode)}
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
