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

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [participationType, setParticipationType] = useState<string>("");
  const [hasSubmission, setHasSubmission] = useState(false);
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
    if (participationType === "participant") {
      total += 100;
      // Add extra for presentation
      if (hasSubmission && willPresent) {
        total += 50; // Extra fee for presentation
      }
    } else if (participationType === "student") {
      total += 50;
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

  if (!currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vitajte, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2">Správa vašej účasti na konferencii</p>
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
                    htmlFor="participant"
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="participant" id="participant" />
                    <div className="flex-1">
                      <div className="font-semibold">
                        Účastník
                      </div>
                      <p className="text-sm text-gray-600">Príspevok v ďalšej fáze</p>
                    </div>
                    <Badge variant="secondary">100 €</Badge>
                  </Label>

                  <Label 
                    htmlFor="student"
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="student" id="student" />
                    <div className="flex-1">
                      <div className="font-semibold">
                        Študent
                      </div>
                      <p className="text-sm text-gray-600">Študentská zľava</p>
                    </div>
                    <Badge variant="secondary">50 €</Badge>
                  </Label>
                </RadioGroup>

                {participationType && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                      Vybrali ste si: <strong>{participationType === "student" ? "Študent" : "Účastník"}</strong>
                    </AlertDescription>
                  </Alert>
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
                  {participationType === "participant" 
                    ? "Vyplňte informácie o vašom príspevku"
                    : "Dostupné len pre účastníkov"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {participationType === "participant" ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="hasSubmission" 
                        checked={hasSubmission}
                        onCheckedChange={(checked) => setHasSubmission(checked as boolean)}
                      />
                      <Label htmlFor="hasSubmission">Chcem odoslať príspevok</Label>
                    </div>

                    {hasSubmission && (
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

                        {willPresent && (
                          <Alert className="bg-blue-50 border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-900 text-sm">
                              Prezentácia príspevku má príplatok <strong>50 €</strong>, ktorý sa pripočíta k faktúre.
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button className="w-full">Uložiť príspevok</Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pre odoslanie príspevku musíte vybrať typ účasti "Účastník"
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
                          <span>Registračný poplatok ({participationType === "student" ? "Študent" : "Účastník"})</span>
                          <span className="font-semibold whitespace-nowrap">
                            {participationType === "student" ? "50" : "100"} €
                          </span>
                        </div>
                      )}
                      {hasSubmission && willPresent && participationType === "participant" && (
                        <div className="flex justify-between py-2 border-b">
                          <span>Prezentácia príspevku</span>
                          <span className="font-semibold whitespace-nowrap">50 €</span>
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