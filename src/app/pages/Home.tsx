import { Link } from "react-router";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent } from "../components/ui/card.tsx";
import { Calendar, Users, FileText, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
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

      {/* Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Prečo sa zúčastniť?</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Networking</h4>
                    <p className="text-gray-600">
                      Spojte sa s vedcami a odborníkmi z vašej oblasti
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Najnovší výskum</h4>
                    <p className="text-gray-600">
                      Dozviete sa o najnovších trendoch a objavoch
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Workshopy</h4>
                    <p className="text-gray-600">
                      Praktické workshopy a interaktívne sekcie
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760420940953-3958ad9f6287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NzA3NzczMDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Conference"
                className="w-full h-auto"
              />
            </div>
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