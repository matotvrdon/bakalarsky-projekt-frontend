import { Link } from "react-router";
import { Calendar, Users, FileText, MapPin } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { type ImportantDate } from "../api/conferenceApi.ts";
import { useActiveConference } from "../hooks/useActiveConference.ts";

const conferenceHighlights = [
  "INFORMATICS prepaja vyskum, aplikovany vyvoj a akademicku spolupracu.",
  "Program je postaveny na kratkych odbornych vystupeniach, diskusii a prezentacii aktualnych vysledkov.",
  "Obsah domovskej stranky je pripraveny na napojenie na data spravovane z admin rozhrania.",
];

const conferenceScopes = [
  "Artificial Intelligence and Machine Learning",
  "Software Engineering and Information Systems",
  "Computer Networks and Cybersecurity",
  "Data Science and Knowledge Discovery",
  "Human-Computer Interaction",
  "Educational Technologies and Digital Learning",
];

const fallbackImportantDates = [
  {
    id: 1,
    label: "Uzávierka abstraktov",
    normalDate: "2026-03-01",
    updatedDate: null,
    importantDatesStatus: "Normal" as const,
  },
  {
    id: 2,
    label: "Odovzdanie finálnych príspevkov",
    normalDate: "2026-04-01",
    updatedDate: "2026-04-10",
    importantDatesStatus: "Extended" as const,
  },
  {
    id: 3,
    label: "Early bird registrácia",
    normalDate: "2026-04-15",
    updatedDate: "2026-04-10",
    importantDatesStatus: "Shortened" as const,
  },
];

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
};

const formatConferenceRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "";

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start} - ${end}`;
};

const isDateUpdated = (importantDate: ImportantDate) =>
  Boolean(importantDate.updatedDate && importantDate.updatedDate !== importantDate.normalDate);

const getDateStatusLabel = (importantDate: ImportantDate) => {
  if (importantDate.importantDatesStatus === "Extended") return "Predĺžené";
  if (importantDate.importantDatesStatus === "Shortened") return "Skrátené";
  return null;
};

const getDateStatusClassName = (importantDate: ImportantDate) => {
  if (importantDate.importantDatesStatus === "Extended") return "bg-emerald-400/12 text-emerald-50 border border-emerald-200/20";
  if (importantDate.importantDatesStatus === "Shortened") return "bg-amber-300/14 text-amber-50 border border-amber-200/20";
  return "bg-white/8 text-white/88 border border-white/10";
};

const getDateCardClassName = (importantDate: ImportantDate) => {
  if (importantDate.importantDatesStatus === "Extended") return "border-emerald-100/18 bg-white/10";
  if (importantDate.importantDatesStatus === "Shortened") return "border-amber-100/18 bg-white/10";
  return "border-white/10 bg-white/10";
};

export function Home() {
  const activeConference = useActiveConference();

  const conferenceName = activeConference?.name || "Conference.Name";
  const conferenceDescription = activeConference?.description || "Conference.Description";
  const conferenceLocation = activeConference?.location || "Conference.Location";
  const conferenceDateRange =
    formatConferenceRange(activeConference?.startDate, activeConference?.endDate) || "Conference.StartDate - Conference.EndDate";
  const importantDates = activeConference?.settings?.importantDates?.length
    ? activeConference.settings.importantDates
    : fallbackImportantDates;

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{conferenceName}</h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">{conferenceDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{conferenceDateRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{conferenceLocation}</span>
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

            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/12 to-white/6 p-6 md:p-8 backdrop-blur-md">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-white md:text-3xl">Dôležité termíny</h2>
              <div className="space-y-3 md:space-y-4">
                {importantDates.map((importantDate) => (
                  <div
                    key={`${importantDate.label}-${importantDate.normalDate}-${importantDate.updatedDate ?? "normal"}`}
                    className={`group rounded-2xl p-5 md:p-6 transition-all duration-300 backdrop-blur-sm border ${
                      importantDate.importantDatesStatus === "Extended"
                        ? "border-emerald-400/30 bg-gradient-to-br from-emerald-400/12 to-emerald-500/6"
                        : importantDate.importantDatesStatus === "Shortened"
                          ? "border-amber-300/30 bg-gradient-to-br from-amber-300/12 to-amber-400/6"
                          : "border-white/20 bg-gradient-to-br from-white/12 to-white/6"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-fit">
                        {isDateUpdated(importantDate) ? (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-white/40 line-through decoration-white/30">
                              {formatDate(importantDate.normalDate)}
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                              {formatDate(importantDate.updatedDate)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            {formatDate(importantDate.normalDate)}
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="text-sm md:text-base font-semibold leading-tight text-white/95">
                          {importantDate.label || "Názov termínu"}
                        </p>
                        {getDateStatusLabel(importantDate) && (
                          <span
                            className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ${getDateStatusClassName(
                              importantDate
                            )}`}
                          >
                            {getDateStatusLabel(importantDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pripravení sa pripojiť?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Registrácia je otvorená počas aktívnej konferencie
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
