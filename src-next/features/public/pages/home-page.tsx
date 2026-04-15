import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock3, MapPin } from "lucide-react";

import { Button } from "../../../shared/ui";
import { useActiveConference } from "../../../shared/hooks";
import {
  formatConferenceRange,
  formatDate,
  getDateStatusLabel,
  isDateUpdated,
} from "../../../shared/lib";
import { SectionHeading } from "../components";

type FallbackDate = {
  id: number;
  label: string;
  normalDate: string;
  updatedDate: string | null;
  importantDatesStatus: "Normal" | "Shortened" | "Extended";
};

const fallbackImportantDates: FallbackDate[] = [
  {
    id: 1,
    label: "Uzávierka abstraktov",
    normalDate: "2026-03-01",
    updatedDate: null,
    importantDatesStatus: "Normal",
  },
  {
    id: 2,
    label: "Odovzdanie finálnych príspevkov",
    normalDate: "2026-04-01",
    updatedDate: "2026-04-10",
    importantDatesStatus: "Extended",
  },
  {
    id: 3,
    label: "Early bird registrácia",
    normalDate: "2026-04-15",
    updatedDate: "2026-04-10",
    importantDatesStatus: "Shortened",
  },
];

function getDateStatusClassName(date: { importantDatesStatus: "Normal" | "Shortened" | "Extended" }) {
  if (date.importantDatesStatus === "Extended") return "border-emerald-300/30 bg-emerald-300/10 text-emerald-50";
  if (date.importantDatesStatus === "Shortened") return "border-amber-300/30 bg-amber-300/10 text-amber-50";
  return "border-white/14 bg-white/7 text-white/80";
}

export function HomePage() {
  const { activeConference } = useActiveConference();

  const conferenceName = activeConference?.name || "Conference.Name";
  const conferenceDescription = activeConference?.description || "Conference.Description";
  const conferenceLocation = activeConference?.location || "Conference.Location";
  const conferenceDateRange =
    formatConferenceRange(activeConference?.startDate, activeConference?.endDate) ||
    "Conference.StartDate - Conference.EndDate";
  const importantDates =
    activeConference?.settings?.importantDates && activeConference.settings.importantDates.length > 0
      ? activeConference.settings.importantDates
      : fallbackImportantDates;

  return (
    <div className="bg-[#06101d] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-8rem] size-[24rem] rounded-full bg-cyan-400/14 blur-3xl" />
          <div className="absolute right-[-12rem] top-[4rem] size-[26rem] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-14rem] left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl" />
        </div>

        <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="z-10 flex flex-col justify-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200/72">Medzinárodná vedecká konferencia</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">{conferenceName}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">{conferenceDescription}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cyan-100">
                  <Calendar className="size-5" />
                  <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/54">Termín</span>
                </div>
                <p className="mt-4 text-xl font-semibold text-white">{conferenceDateRange}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-cyan-100">
                  <MapPin className="size-5" />
                  <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/54">Miesto</span>
                </div>
                <p className="mt-4 text-xl font-semibold text-white">{conferenceLocation}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="h-12 rounded-full bg-cyan-300 px-7 text-slate-950 hover:bg-cyan-200">
                  Registrovať sa
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
              <Link to="/schedule">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/14 bg-white/6 px-7 text-white hover:bg-white/10 hover:text-white"
                >
                  Pozrieť program
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            className="relative z-10 flex items-end"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.24),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
            <div className="relative w-full rounded-[2.5rem] border border-white/10 bg-[#091524]/92 p-6 shadow-2xl shadow-cyan-950/35 backdrop-blur-xl md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/72">Dôležité termíny</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Čo treba stihnúť</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/64">
                  {importantDates.length} termínov
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                {importantDates.map((importantDate, index) => (
                  <motion.div
                    key={`${importantDate.label}-${importantDate.normalDate}-${importantDate.updatedDate ?? "normal"}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + index * 0.07, duration: 0.4 }}
                    className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/8"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-semibold tracking-tight text-white">
                            {formatDate(importantDate.updatedDate || importantDate.normalDate)}
                          </span>
                          {isDateUpdated(importantDate) ? (
                            <span className="text-sm text-white/38 line-through">{formatDate(importantDate.normalDate)}</span>
                          ) : null}
                        </div>
                        <p className="mt-3 max-w-md text-base text-white/76">{importantDate.label || "Názov termínu"}</p>
                      </div>

                      <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${getDateStatusClassName(importantDate)}`}>
                        {getDateStatusLabel(importantDate)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#081321] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <SectionHeading
            eyebrow="Zameranie"
            title="Jedna platforma pre konferenciu, registráciu aj publikovanie programu."
            description="Dôraz je na čitateľnosť, rytmus a rýchly prechod k dôležitým krokom bez zmeny backend kontraktov."
            invert
          />

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Registrácia", value: "01", text: "Napojená na existujúce konferenčné entry a auth toky." },
                { label: "Program", value: "02", text: "Programové dni, položky a sessions ostávajú viazané na API DTO." },
                { label: "Admin", value: "03", text: "UI je modernejšie, dátový kontrakt s backendom ostáva bez obchádzok." },
              ].map((item) => (
                <div key={item.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-4xl font-semibold tracking-tight text-white">{item.value}</div>
                  <h3 className="mt-6 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/62">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Ďalší krok"
            title="Registrácia a program ostávajú napojené na backend, nie na mock dáta."
            description="Redesign nemení dátový tok. Stále používa aktívnu konferenciu, settings a programové entity z existujúceho API."
            align="center"
            invert
          />
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="h-12 rounded-full bg-cyan-300 px-7 text-slate-950 hover:bg-cyan-200">
                Registrovať sa teraz
              </Button>
            </Link>
            <Link to="/schedule">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/14 bg-white/6 px-7 text-white hover:bg-white/10 hover:text-white"
              >
                Otvoriť program
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
