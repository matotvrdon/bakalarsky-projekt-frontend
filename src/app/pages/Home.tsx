import { Link } from "react-router";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Calendar, Users, FileText, MapPin } from "lucide-react";

const conferenceHighlights = [
  "INFORMATICS 2026 prepaja vyskum, aplikovany vyvoj a akademicku spolupracu.",
  "Program je postaveny na kratkych odbornych vystupeniach, diskusii a prezentacii aktualnych vysledkov.",
  "Struktura je pripravena tak, aby sa tento obsah dal neskor nahradzat datami z admin rozhrania.",
];

const conferenceScopes = [
  "Artificial Intelligence and Machine Learning",
  "Software Engineering and Information Systems",
  "Computer Networks and Cybersecurity",
  "Data Science and Knowledge Discovery",
  "Human-Computer Interaction",
  "Educational Technologies and Digital Learning",
];

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                18. ročník medzinárodnej vedeckej konferencia 2026
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Spojenie najlepších vedeckých myslí z celého sveta
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>18-20 november 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Poprad, Slovensko</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Registrovať sa
                  </Button>
                </Link>
                <Link to="/schedule">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                    Pozrieť program
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl font-semibold text-white">Dôležité termíny</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-lg font-bold text-white">1.3.2026</div>
                  <div className="mt-1 font-semibold text-white">Uzávierka prihlášok</div>
                  <div className="text-sm text-blue-100">Posledný termín na odoslanie príspevkov</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-lg font-bold text-white">1.4.2026</div>
                  <div className="mt-1 font-semibold text-white">Notifikácia o prijatí</div>
                  <div className="text-sm text-blue-100">Oznámenie o prijatí alebo zamietnutí príspevku</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-lg font-bold text-white">15.4.2026</div>
                  <div className="mt-1 font-semibold text-white">Skorá registrácia</div>
                  <div className="text-sm text-blue-100">Koniec zľavneného registračného poplatku</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-lg font-bold text-white">15-17.5.2026</div>
                  <div className="mt-1 font-semibold text-white">Konferencia</div>
                  <div className="text-sm text-blue-100">Hlavné dni podujatia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">40+ Prednášajúcich</h3>
                  <p className="text-gray-600">
                    Renomovaní vedci a odborníci z celého sveta
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">100+ Príspevkov</h3>
                  <p className="text-gray-600">
                    Najnovší výskum z rôznych vedeckých oblastí
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">3 Dni programu</h3>
                  <p className="text-gray-600">
                    Prednášky, workshopy a networkingové podujatia
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conference Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">O konferencii</h2>
            <p className="mt-3 text-gray-600">
              Stručný prehľad podujatia a hlavných tematických okruhov. Tento blok je pripravený tak,
              aby sa neskôr dal jednoducho spravovať aj z admin rozhrania.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Základné informácie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {conferenceHighlights.map((item, index) => (
                  <div
                    key={item}
                    className={`flex gap-4 ${index !== conferenceHighlights.length - 1 ? "border-b border-gray-100 pb-4" : ""}`}
                  >
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {index + 1}
                    </div>
                    <p className="text-gray-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Scopes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {conferenceScopes.map((scope) => (
                    <div
                      key={scope}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                    >
                      {scope}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pripravení sa pripojiť?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Registrácia je otvorená do 1. apríla 2026
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Registrovať sa teraz
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
