import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { toast } from "sonner";
import { CheckCircle2, User, Hotel, UtensilsCrossed, FileText, Tag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

// Mock data for accommodation options
const accommodationOptions = [
  {
    id: 1,
    hotel: "Hotel Devín",
    address: "Riečna 4, Bratislava",
    roomType: "Jednolôžková izba",
    price: 85,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400",
    amenities: ["Wi-Fi", "Raňajky", "Klimatizácia"],
  },
  {
    id: 2,
    hotel: "Hotel Devín",
    address: "Riečna 4, Bratislava",
    roomType: "Dvojlôžková izba",
    price: 120,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
    amenities: ["Wi-Fi", "Raňajky", "Klimatizácia"],
  },
  {
    id: 3,
    hotel: "Hotel Marrol's",
    address: "Tobrucká 4, Bratislava",
    roomType: "Jednolôžková izba",
    price: 95,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400",
    amenities: ["Wi-Fi", "Raňajky", "Klimatizácia", "Fitnes"],
  },
];

// Mock data for catering options
const cateringOptions = [
  {
    id: 1,
    name: "Ranná káva a pečivo",
    description: "Káva, čaj, čerstvé pečivo (denne)",
    price: 5,
    perDay: true,
  },
  {
    id: 2,
    name: "Obed - Štandardné menu",
    description: "Polievka, hlavné jedlo, príloha, dezert (denne)",
    price: 12,
    perDay: true,
  },
  {
    id: 3,
    name: "Obed - Vegetariánske menu",
    description: "Polievka, vegetariánske jedlo, príloha, dezert (denne)",
    price: 12,
    perDay: true,
  },
  {
    id: 4,
    name: "Obed - Bezlepkové menu",
    description: "Polievka, bezlepkové jedlo, príloha, dezert (denne)",
    price: 15,
    perDay: true,
  },
  {
    id: 5,
    name: "Večerné prijatie (15.5.)",
    description: "Koktail, občerstvenie, nápoje",
    price: 25,
    perDay: false,
  },
];

// Registration fees
const registrationFees = {
  speaker: { name: "Prednášajúci", price: 350, description: "Prezentácia príspevku + účasť" },
  participant: { name: "Účastník", price: 450, description: "Účasť na konferencii" },
  student: { name: "Študent", price: 200, description: "Zľavnená cena pre študentov" },
};

// Mock coupons for validation
const availableCoupons = [
  {
    code: "STUDENT50",
    type: "fixed",
    value: 50,
    validFrom: "2026-01-01",
    validTo: "2026-05-14",
    active: true,
  },
  {
    code: "SPEAKER2026",
    type: "percentage",
    value: 20,
    validFrom: "2026-01-01",
    validTo: "2026-05-17",
    active: true,
  },
];

export function Registration() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    affiliation: "",
    country: "",
    address: "",
    
    // Registration type
    registrationType: "",
    
    // Paper submission
    submitPaper: false,
    paperTitle: "",
    paperAbstract: "",
    paperFile: null as File | null,
    
    // Accommodation
    needAccommodation: false,
    accommodationId: "",
    checkIn: "2026-05-14",
    checkOut: "2026-05-17",
    
    // Catering
    catering: {} as Record<number, boolean>,
    
    // Special requirements
    dietaryRequirements: "",
    specialNeeds: "",
    
    // Coupon
    couponCode: "",
    
    // Invoice
    invoiceCompany: "",
    invoiceAddress: "",
    invoiceICO: "",
    invoiceDIC: "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const validateCoupon = (code: string) => {
    const coupon = availableCoupons.find(
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
    
    toast.success(`Kupón "${code}" bol úspešne aplikovaný!`);
    return coupon;
  };

  const calculateDiscount = (subtotal: number) => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.value) / 100;
    } else {
      return Math.min(appliedCoupon.value, subtotal);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Registrácia bola úspešne odoslaná!");
  };

  const calculateAccommodationCost = () => {
    if (!formData.needAccommodation || !formData.accommodationId) return 0;
    
    const accommodation = accommodationOptions.find(
      (acc) => acc.id.toString() === formData.accommodationId
    );
    if (!accommodation) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return accommodation.price * nights;
  };

  const calculateCateringCost = () => {
    let total = 0;
    const days = 3; // Conference days
    
    Object.entries(formData.catering).forEach(([id, selected]) => {
      if (selected) {
        const option = cateringOptions.find((opt) => opt.id.toString() === id);
        if (option) {
          total += option.perDay ? option.price * days : option.price;
        }
      }
    });
    
    return total;
  };

  const calculateTotalCost = () => {
    const regFee = formData.registrationType 
      ? registrationFees[formData.registrationType as keyof typeof registrationFees].price 
      : 0;
    const accommodation = calculateAccommodationCost();
    const catering = calculateCateringCost();
    const subtotal = regFee + accommodation + catering;
    const discount = calculateDiscount(subtotal);
    
    return subtotal - discount;
  };

  const calculateSubtotal = () => {
    const regFee = formData.registrationType 
      ? registrationFees[formData.registrationType as keyof typeof registrationFees].price 
      : 0;
    const accommodation = calculateAccommodationCost();
    const catering = calculateCateringCost();
    
    return regFee + accommodation + catering;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Registrácia dokončená!</h2>
              <p className="text-gray-600 mb-6">
                Ďakujeme za registráciu na konferenciu INFORMATICS 2026.
              </p>
              
              <Card className="mb-6 text-left">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Súhrn registrácie:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Meno:</span>
                      <span className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Typ registrácie:</span>
                      <span className="font-medium">
                        {formData.registrationType && 
                          registrationFees[formData.registrationType as keyof typeof registrationFees].name}
                      </span>
                    </div>
                    {formData.needAccommodation && (
                      <div className="flex justify-between">
                        <span>Ubytovanie:</span>
                        <span className="font-medium">Áno</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Celková suma:</span>
                      <span>€{calculateTotalCost()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Referenčné číslo:</strong> SC2026-{Math.floor(Math.random() * 10000)}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Na váš email <strong>{formData.email}</strong> sme odoslali potvrdenie
                  s platobným odkazom a ďalšími pokynmi.
                </p>
              </div>
              
              <Button onClick={() => window.location.href = "/"} size="lg">
                Späť na hlavnú stránku
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Registrácia účastníka</h1>
          <p className="text-xl text-gray-600">SciConf 2026 - Bratislava</p>
          <p className="text-gray-600 mt-2">15-17 mája 2026</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 1 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400"}`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Osobné údaje</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 2 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400"}`}>
                2
              </div>
              <span className="ml-2 hidden sm:inline">Ubytovanie & Strava</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 3 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400"}`}>
                3
              </div>
              <span className="ml-2 hidden sm:inline">Súhrn</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Osobné údaje a typ registrácie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Meno *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Ján"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Priezvisko *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Novák"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jan.novak@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefón *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+421 901 234 567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="affiliation">Afiliácia (Univerzita/Firma) *</Label>
                    <Input
                      id="affiliation"
                      required
                      value={formData.affiliation}
                      onChange={(e) =>
                        setFormData({ ...formData, affiliation: e.target.value })
                      }
                      placeholder="STU Bratislava"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Krajina *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="Slovensko"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresa</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Ulica 123, Mesto"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Typ registrácie *</Label>
                  <RadioGroup
                    value={formData.registrationType}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        registrationType: value,
                        submitPaper: value === "speaker" // Automatically enable paper submission for speakers
                      });
                    }}
                    className="space-y-3"
                  >
                    {Object.entries(registrationFees).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                        <RadioGroupItem value={key} id={key} className="mt-1" />
                        <label htmlFor={key} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{value.name}</div>
                              <div className="text-sm text-gray-600">{value.description}</div>
                            </div>
                            <Badge variant="secondary" className="ml-2">€{value.price}</Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Paper submission section - shown for speakers OR when checkbox is checked */}
                {(formData.registrationType === "speaker" || formData.submitPaper) && (
                  <div className="border-t pt-6">
                    {formData.registrationType !== "speaker" && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="submitPaper"
                          checked={formData.submitPaper}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, submitPaper: checked as boolean })
                          }
                        />
                        <Label htmlFor="submitPaper" className="cursor-pointer">
                          Chcem prezentovať vedecký príspevok
                        </Label>
                      </div>
                    )}

                    {formData.registrationType === "speaker" && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900">Vedecký príspevok</h4>
                            <p className="text-sm text-blue-700">
                              Ako prednášajúci je potrebné vyplniť informácie o vašom príspevku
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paperTitle">
                          Názov príspevku {formData.registrationType === "speaker" && "*"}
                        </Label>
                        <Input
                          id="paperTitle"
                          required={formData.registrationType === "speaker"}
                          value={formData.paperTitle}
                          onChange={(e) =>
                            setFormData({ ...formData, paperTitle: e.target.value })
                          }
                          placeholder="Názov vášho vedeckého príspevku"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paperAbstract">
                          Abstrakt {formData.registrationType === "speaker" && "*"}
                        </Label>
                        <Textarea
                          id="paperAbstract"
                          required={formData.registrationType === "speaker"}
                          value={formData.paperAbstract}
                          onChange={(e) =>
                            setFormData({ ...formData, paperAbstract: e.target.value })
                          }
                          placeholder="Abstrakt (200-500 slov)"
                          rows={6}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Odporúčaná dĺžka: 200-500 slov
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="paperFile">
                          PDF príspevku {formData.registrationType === "speaker" && "*"}
                        </Label>
                        <Input
                          id="paperFile"
                          type="file"
                          accept=".pdf"
                          required={formData.registrationType === "speaker"}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFormData({ ...formData, paperFile: file });
                            if (file) {
                              toast.success(`Súbor "${file.name}" bol nahraný`);
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Formát: PDF, Max. veľkosť: 10 MB
                        </p>
                        {formData.paperFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 flex-1">
                              {formData.paperFile.name} ({(formData.paperFile.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.registrationType || !formData.firstName || !formData.email}
                  >
                    Pokračovať
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Accommodation & Catering */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Accommodation */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="w-5 h-5" />
                    Ubytovanie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needAccommodation"
                      checked={formData.needAccommodation}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, needAccommodation: checked as boolean })
                      }
                    />
                    <Label htmlFor="needAccommodation" className="cursor-pointer">
                      Potrebujem ubytovanie
                    </Label>
                  </div>

                  {formData.needAccommodation && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="checkIn">Check-in</Label>
                          <Input
                            id="checkIn"
                            type="date"
                            value={formData.checkIn}
                            onChange={(e) =>
                              setFormData({ ...formData, checkIn: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="checkOut">Check-out</Label>
                          <Input
                            id="checkOut"
                            type="date"
                            value={formData.checkOut}
                            onChange={(e) =>
                              setFormData({ ...formData, checkOut: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-3 block">Vyberte typ ubytovania</Label>
                        <RadioGroup
                          value={formData.accommodationId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, accommodationId: value })
                          }
                          className="space-y-4"
                        >
                          {accommodationOptions.map((acc) => {
                            const checkIn = new Date(formData.checkIn);
                            const checkOut = new Date(formData.checkOut);
                            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                            const totalPrice = acc.price * nights;

                            return (
                              <div
                                key={acc.id}
                                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col sm:flex-row">
                                  <div className="w-full sm:w-48 h-48 sm:h-auto">
                                    <ImageWithFallback
                                      src={acc.image}
                                      alt={acc.hotel}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 p-4">
                                    <div className="flex items-start space-x-3">
                                      <RadioGroupItem
                                        value={acc.id.toString()}
                                        id={`acc-${acc.id}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`acc-${acc.id}`}
                                        className="flex-1 cursor-pointer"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <div className="font-bold">{acc.hotel}</div>
                                            <div className="text-sm text-gray-600">{acc.address}</div>
                                          </div>
                                        </div>
                                        <div className="mb-2">
                                          <Badge>{acc.roomType}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {acc.amenities.map((amenity, idx) => (
                                            <span
                                              key={idx}
                                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                                            >
                                              {amenity}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-gray-600">
                                            €{acc.price}/noc × {nights} nocí
                                          </span>
                                          <span className="font-bold text-lg">€{totalPrice}</span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Catering */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Strava
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Vyberte si možnosti stravy, ktoré si želáte objednať počas konferencie.
                  </p>

                  {cateringOptions.map((option) => (
                    <div
                      key={option.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`catering-${option.id}`}
                          checked={formData.catering[option.id] || false}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              catering: {
                                ...formData.catering,
                                [option.id]: checked as boolean,
                              },
                            })
                          }
                        />
                        <label
                          htmlFor={`catering-${option.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold">{option.name}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold">
                                €{option.perDay ? option.price * 3 : option.price}
                              </div>
                              {option.perDay && (
                                <div className="text-xs text-gray-600">
                                  €{option.price}/deň × 3 dni
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <Label htmlFor="dietaryRequirements">
                      Špeciálne stravové požiadavky (alergie, intolerancie)
                    </Label>
                    <Textarea
                      id="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={(e) =>
                        setFormData({ ...formData, dietaryRequirements: e.target.value })
                      }
                      placeholder="Napr. bezlaktózová strava, alérgia na orechy..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialNeeds">Iné špeciálne požiadavky</Label>
                    <Textarea
                      id="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={(e) =>
                        setFormData({ ...formData, specialNeeds: e.target.value })
                      }
                      placeholder="Napr. bezbariérový prístup, tlmočenie do posunkového jazyka..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Späť
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Pokračovať
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Súhrn registrácie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold mb-3">Osobné údaje</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Meno:</div>
                      <div className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </div>
                      <div className="text-gray-600">Email:</div>
                      <div className="font-medium">{formData.email}</div>
                      <div className="text-gray-600">Telefón:</div>
                      <div className="font-medium">{formData.phone}</div>
                      <div className="text-gray-600">Afiliácia:</div>
                      <div className="font-medium">{formData.affiliation}</div>
                      <div className="text-gray-600">Krajina:</div>
                      <div className="font-medium">{formData.country}</div>
                    </div>
                  </div>

                  {/* Registration Type */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Typ registrácie</h3>
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                      <span>
                        {formData.registrationType &&
                          registrationFees[formData.registrationType as keyof typeof registrationFees].name}
                      </span>
                      <span className="font-bold">
                        €
                        {formData.registrationType &&
                          registrationFees[formData.registrationType as keyof typeof registrationFees].price}
                      </span>
                    </div>
                    {formData.submitPaper && (
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <div className="text-sm font-medium mb-1">Príspevok:</div>
                        <div className="text-sm">{formData.paperTitle}</div>
                      </div>
                    )}
                  </div>

                  {/* Accommodation */}
                  {formData.needAccommodation && formData.accommodationId && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Ubytovanie</h3>
                      {(() => {
                        const acc = accommodationOptions.find(
                          (a) => a.id.toString() === formData.accommodationId
                        );
                        if (!acc) return null;

                        const checkIn = new Date(formData.checkIn);
                        const checkOut = new Date(formData.checkOut);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                          <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">{acc.hotel} - {acc.roomType}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>
                                {formData.checkIn} → {formData.checkOut} ({nights} nocí)
                              </span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2">
                              <span>Spolu:</span>
                              <span>€{calculateAccommodationCost()}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Catering */}
                  {Object.values(formData.catering).some((v) => v) && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Strava</h3>
                      <div className="space-y-2">
                        {Object.entries(formData.catering).map(([id, selected]) => {
                          if (!selected) return null;
                          const option = cateringOptions.find((opt) => opt.id.toString() === id);
                          if (!option) return null;

                          const price = option.perDay ? option.price * 3 : option.price;

                          return (
                            <div
                              key={id}
                              className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                            >
                              <span>{option.name}</span>
                              <span className="font-medium">€{price}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Spolu:</span>
                          <span>€{calculateCateringCost()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coupon */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Zľavový kupón</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Zadajte kód kupónu"
                        value={formData.couponCode}
                        onChange={(e) =>
                          setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (formData.couponCode) {
                            const coupon = validateCoupon(formData.couponCode);
                            setAppliedCoupon(coupon);
                          }
                        }}
                      >
                        Aplikovať
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Kupón "{appliedCoupon.code}" - {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}%` : `€${appliedCoupon.value}`} zľava
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Medzisúčet:</span>
                        <span>€{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>Zľava ({appliedCoupon.code}):</span>
                          <span>-€{calculateDiscount(calculateSubtotal()).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-600 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold">Celková suma:</span>
                        <span className="font-bold">€{calculateTotalCost().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice details */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Fakturačné údaje (voliteľné)</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="invoiceCompany">Názov firmy</Label>
                        <Input
                          id="invoiceCompany"
                          value={formData.invoiceCompany}
                          onChange={(e) =>
                            setFormData({ ...formData, invoiceCompany: e.target.value })
                          }
                          placeholder="Názov spoločnosti"
                        />
                      </div>
                      <div>
                        <Label htmlFor="invoiceAddress">Fakturačná adresa</Label>
                        <Input
                          id="invoiceAddress"
                          value={formData.invoiceAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, invoiceAddress: e.target.value })
                          }
                          placeholder="Ulica, PSČ Mesto"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="invoiceICO">IČO</Label>
                          <Input
                            id="invoiceICO"
                            value={formData.invoiceICO}
                            onChange={(e) =>
                              setFormData({ ...formData, invoiceICO: e.target.value })
                            }
                            placeholder="12345678"
                          />
                        </div>
                        <div>
                          <Label htmlFor="invoiceDIC">DIČ</Label>
                          <Input
                            id="invoiceDIC"
                            value={formData.invoiceDIC}
                            onChange={(e) =>
                              setFormData({ ...formData, invoiceDIC: e.target.value })
                            }
                            placeholder="SK1234567890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm cursor-pointer">
                        Súhlasím s{" "}
                        <a href="#" className="text-blue-600 underline">
                          podmienkami účasti
                        </a>{" "}
                        a{" "}
                        <a href="#" className="text-blue-600 underline">
                          spracovaním osobných údajov
                        </a>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Späť
                </Button>
                <Button type="submit" size="lg" className="px-8">
                  Dokončiť registráciu
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}