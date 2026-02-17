import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

export function About() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">O konferencii</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SciConf 2026 je prestížne medzinárodné podujatie zamerané na pokročilý
            výskum a vedeckú spoluprácu
          </p>
        </div>

        {/* Main Image */}
        <div className="mb-12 rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1595327775795-3e798ac05117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY29uZmVyZW5jZSUyMGhhbGx8ZW58MXx8fHwxNzcwODM4MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Conference Hall"
            className="w-full h-auto"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Naša misia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Našou misiou je vytvoriť platformu pre výmenu najnovších vedeckých
                poznatkov, podporiť medzinárodnú spoluprácu a inšpirovať ďalšiu
                generáciu vedcov. Prinášame spolu odborníkov z rôznych oblastí, aby
                zdieľali svoje skúsenosti a poznatky.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Témy konferencie</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Umelá inteligencia a strojové učenie</li>
                <li>• Biotechnológie a medicína</li>
                <li>• Obnoviteľné zdroje energie</li>
                <li>• Kvantová fyzika a výpočty</li>
                <li>• Klimatické zmeny a udržateľnosť</li>
                <li>• Neurológia a kognitívne vedy</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Venue Info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Miesto konania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Slovenská technická univerzita</h3>
                <p className="text-gray-600 mb-4">
                  Konferencia sa uskutoční v moderných priestoroch Slovenskej
                  technickej univerzity v Bratislave, ktorá je známa svojím
                  špičkovým výskumom a vybavením.
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Adresa:</strong>
                    <br />
                    Vazovova 5, 812 43 Bratislava
                  </p>
                  <p>
                    <strong>Kapacita:</strong> 500 účastníkov
                  </p>
                  <p>
                    <strong>Vybavenie:</strong> Moderné konferenčné sály, Wi-Fi,
                    tlmočnícke zariadenia
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Doprava</h3>
                <p className="text-gray-600 mb-4">
                  Budova je ľahko dostupná mestskou hromadnou dopravou aj autom.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong>MHD:</strong> Tramvaj č. 1, 4, 9 - zastávka "Technická univerzita"
                  </li>
                  <li>
                    <strong>Parkovanie:</strong> Dostupné parkovacie miesta pre účastníkov
                  </li>
                  <li>
                    <strong>Letisko:</strong> 20 minút od letiska M.R. Štefánika
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Dôležité termíny</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-blue-600 font-bold text-lg">1.3.2026</div>
                <div>
                  <div className="font-semibold">Uzávierka prihlášok</div>
                  <div className="text-gray-600 text-sm">
                    Posledný termín na odoslanie príspevkov
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-600 font-bold text-lg">1.4.2026</div>
                <div>
                  <div className="font-semibold">Notifikácia o prijatí</div>
                  <div className="text-gray-600 text-sm">
                    Oznámenie o prijatí/zamietnutí príspevku
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-600 font-bold text-lg">15.4.2026</div>
                <div>
                  <div className="font-semibold">Skorá registrácia</div>
                  <div className="text-gray-600 text-sm">
                    Koniec zľavneného registračného poplatku
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-600 font-bold text-lg">15-17.5.2026</div>
                <div>
                  <div className="font-semibold">Konferencia</div>
                  <div className="text-gray-600 text-sm">
                    Hlavné dni podujatia
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
