import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, AlertCircle } from "lucide-react";

export function Submissions() {
  return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Príspevky</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Final Paper Preparation */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Príprava a odoslanie finálneho príspevku</h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    Pred odoslaním finálneho príspevku musia autori použiť{" "}
                    <a href="#" className="text-blue-600 hover:underline">IEEE PDF eXpress</a>{" "}
                    aby sa uistili, že príspevok je kompatibilný s IEEE Xplore. Ak spĺňa formát a požiadavky, bude
                    zahrnutý do databázy IEEE Xplore po konferencii. ID konferencie je{" "}
                    <strong className="text-red-600">622MM</strong>.
                  </p>

                  <p>
                    Keď je status príspevku "Pass", kliknite na tlačidlo "Approve" v poli Action.
                    Potom sa status zmení na "Approved".
                  </p>

                  <p>
                    Stránka na odovzdanie finálnych príspevkov je otvorená do{" "}
                    <strong>2. novembra</strong>. Žiadny príspevok nie je akceptovaný po tomto termíne.
                    Autori môžu odoslať príspevok len raz, duplicitné príspevky nie sú akceptované.
                  </p>

                  <p>
                    Nahrajte schválenú verziu PDF do{" "}
                    <a href="#" className="text-blue-600 hover:underline">EasyChair systému</a>.
                  </p>
                </div>
              </section>

              {/* Paper Preparation */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Príprava príspevku</h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    Odoslané príspevky by mali obsahovať pôvodné nepublikované výsledky v téme konferencie.{" "}
                    <strong>Príspevky by nemali prekročiť 6 strán</strong>. Extra strany stoja 10€ za stranu.
                    Všetky príspevky prejdú peer review procesom a každý príspevok bude posúdený dvoma recenzentmi.
                  </p>

                  <p>
                    Príspevky sú určené na publikovanie v IEEE šablóne. Autori môžu použiť buď LaTeX{" "}
                    <em>(preferované)</em> alebo Microsoft Word{" "}
                    <a href="#" className="text-blue-600 hover:underline">šablónu od IEEE</a>.
                    Pre Word verziu by ste mali vybrať <strong>A4 verziu</strong> šablóny.
                  </p>

                  <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                    \documentclass[conference, a4paper]&#123;IEEEtran&#125;
                  </div>

                  <p className="text-sm">Pre viac informácií pozri dokumentáciu šablóny.</p>

                  <p>
                    Príspevky sú spravované cez{" "}
                    <a href="#" className="text-blue-600 hover:underline">EasyChair systém</a>.
                    Proces odoslania príspevku pozostáva z dvoch krokov:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                      <strong>Odoslanie abstraktu</strong> – musíte vytvoriť nové odoslanie v EasyChair
                      bez plného textu príspevku. <em>Abstrakt by mal obsahovať viac ako 150 slov</em> vrátane
                      názvu, mien, afiliácie autorov a navrhnutej témy.
                    </li>
                    <li>
                      <strong>Odoslanie plného príspevku</strong> – pridáte plný príspevok vo formáte PDF k odoslaniu.
                    </li>
                  </ol>
                </div>
              </section>
            </div>

            {/* Sidebar - Right Column (1/3) */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Dôležité informácie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-700">
                  <p>
                    Konferencia sa riadi štandardami IEEE Conference Search Conference proceedings,
                    ktoré spĺňajú normy pre kvalitný peer review a môžu byť oprávnené na zahrnutie v IEEE Xplore.
                  </p>

                  <p>
                    Autori sú vyzvaní, aby sa vyhýbali tomu, aby sa príspevok distribuoval po konferencii
                    (napr. odstránený z IEEE Xplore). Ak príspevok nie je prezentovaný na konferencii,
                    nebude publikovaný.
                  </p>

                  <div className="border-t pt-4 mt-4">
                    <p className="font-semibold mb-2">
                      "Pay to publish" nie je povolené IEEE:
                    </p>
                    <p>
                      Najmenej jeden autor príspevku sa musí ukázať a prezentovať príspevok na konferencii.
                    </p>
                  </div>

                  <p className="border-t pt-4 mt-4">
                    Príspevky budú kontrolované proti plagiátorstvu.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}