import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.tsx";
import { toast } from "sonner";
import { FileText, CheckCircle } from "lucide-react";

export function Submissions() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    authors: "",
    email: "",
    affiliation: "",
    category: "",
    keywords: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    toast.success("Príspevok bol úspešne odoslaný!");
  };

  if (submitted) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Úspešne odoslané!</h2>
              <p className="text-gray-600 mb-6">
                Váš príspevok bol úspešne prijatý. Do 1. apríla 2026 obdržíte
                notifikáciu o prijatí či zamietnutí.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Referenčné číslo: SC2026-{Math.floor(Math.random() * 10000)}
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Odoslať ďalší príspevok
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Odoslať príspevok</h1>
          <p className="text-xl text-gray-600">
            Uzávierka prihlášok: 1. marca 2026
          </p>
        </div>

        {/* Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pokyny pre autorov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Abstrakt by mal obsahovať 200-500 slov</li>
              <li>• Uveďte všetkých autorov a ich afiliácie</li>
              <li>• Vyberte kategóriu, ktorá najlepšie opisuje váš výskum</li>
              <li>• Príspevky môžu byť v slovenčine alebo angličtine</li>
              <li>• Prijaté príspevky budú prezentované ako prednáška alebo poster</li>
            </ul>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulár na odoslanie príspevku</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Názov príspevku *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Zadajte názov vášho príspevku"
                />
              </div>

              <div>
                <Label htmlFor="abstract">Abstrakt *</Label>
                <Textarea
                  id="abstract"
                  required
                  value={formData.abstract}
                  onChange={(e) =>
                    setFormData({ ...formData, abstract: e.target.value })
                  }
                  placeholder="Stručne popíšte váš výskum (200-500 slov)"
                  rows={8}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.abstract.split(" ").filter((w) => w).length} slov
                </p>
              </div>

              <div>
                <Label htmlFor="authors">Autori *</Label>
                <Input
                  id="authors"
                  required
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                  placeholder="Meno Priezvisko, Meno Priezvisko, ..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Uveďte všetkých autorov oddelených čiarkou
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="vas@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="affiliation">Inštitúcia *</Label>
                  <Input
                    id="affiliation"
                    required
                    value={formData.affiliation}
                    onChange={(e) =>
                      setFormData({ ...formData, affiliation: e.target.value })
                    }
                    placeholder="Názov univerzity alebo inštitúcie"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Kategória *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategóriu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">
                      Umelá inteligencia a strojové učenie
                    </SelectItem>
                    <SelectItem value="bio">Biotechnológie a medicína</SelectItem>
                    <SelectItem value="energy">Obnoviteľné zdroje energie</SelectItem>
                    <SelectItem value="quantum">
                      Kvantová fyzika a výpočty
                    </SelectItem>
                    <SelectItem value="climate">
                      Klimatické zmeny a udržateľnosť
                    </SelectItem>
                    <SelectItem value="neuro">
                      Neurológia a kognitívne vedy
                    </SelectItem>
                    <SelectItem value="other">Iné</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keywords">Kľúčové slová</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="kľúčové slovo 1, kľúčové slovo 2, ..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Zadajte 3-5 kľúčových slov oddelených čiarkou
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Odoslať príspevok
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      title: "",
                      abstract: "",
                      authors: "",
                      email: "",
                      affiliation: "",
                      category: "",
                      keywords: "",
                    })
                  }
                >
                  Vyčistiť
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Potrebujete pomoc?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Ak máte otázky týkajúce sa odoslania príspevku, kontaktujte nás na:
              <br />
              <strong>martin@mtvrdon.sk</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
