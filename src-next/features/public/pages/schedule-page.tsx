import { useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Clock, Download, MapPin, User, Users } from "lucide-react";

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/ui";
import { useActiveConference } from "../../../shared/hooks";
import { downloadConferenceProgramPdf, type ProgramDay, type ProgramItem, type ProgramPresentation, type ProgramSession } from "../../../shared/api";
import { formatDate, formatDayTab, formatTimeRange, getProgramTone } from "../../../shared/lib";
import { SectionHeading } from "../components";

const sortPresentations = (presentations?: ProgramPresentation[] | null) => [...(presentations ?? [])].sort((a, b) => a.order - b.order);
const sortSessions = (sessions?: ProgramSession[] | null) => [...(sessions ?? [])].sort((a, b) => a.order - b.order);
const sortProgramItems = (items?: ProgramItem[] | null) => [...(items ?? [])].sort((a, b) => a.order - b.order);
const sortProgramDays = (days?: ProgramDay[] | null) => [...(days ?? [])].sort((a, b) => a.order - b.order);

function SessionDetailTable({ session }: { session: ProgramSession }) {
  const presentations = sortPresentations(session.presentations);

  return (
    <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
      {session.chair ? (
        <div className="mb-4 flex items-center gap-2 text-sm text-white/64">
          <Users className="size-4" />
          <span>
            <strong>Chair:</strong> {session.chair}
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        {presentations.map((presentation) => (
          <div key={presentation.id} className="grid gap-2 rounded-[1.25rem] border border-white/8 bg-[#081321] px-4 py-4 md:grid-cols-[140px_1fr_1.2fr]">
            <div className="text-sm font-medium text-cyan-100">{formatTimeRange(presentation.startTime, presentation.endTime)}</div>
            <div className="text-sm text-white/72">{presentation.authors}</div>
            <div className="text-sm italic text-white">{presentation.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchedulePage() {
  const { activeConference } = useActiveConference();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const programDays = sortProgramDays(activeConference?.settings?.programDays);

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadProgramPdf = async () => {
    if (!activeConference?.id || isDownloadingPdf) return;

    try {
      setIsDownloadingPdf(true);
      const { blob, fileName } = await downloadConferenceProgramPdf(activeConference.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const renderScheduleItem = (item: ProgramItem, dayKey: string) => {
    const itemKey = `${dayKey}-${item.id}`;
    const isExpanded = expandedItems[itemKey];
    const sessions = sortSessions(item.sessions);
    const tone = getProgramTone(item.type);

    return (
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-[2rem] border bg-[#0a1524]/92 p-5 shadow-[0_24px_80px_-48px_rgba(8,145,178,0.45)] backdrop-blur-sm md:p-7 ${tone.border}`}
      >
        <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${tone.accent}`} />
        <div className="grid gap-5 md:grid-cols-[160px_1fr_220px]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-cyan-100">
              <Clock className="size-4 shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/54">Čas</span>
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white">{formatTimeRange(item.startTime, item.endTime)}</div>
            <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${tone.pill}`}>
              {tone.label}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/64">
              {item.speaker ? (
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{item.speaker}</span>
                </div>
              ) : null}
              {item.chair && sessions.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Users className="size-4" />
                  <span>Chair: {item.chair}</span>
                </div>
              ) : null}
              {item.location ? (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="text-sm">{item.location}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-start justify-start md:justify-end">
            {sessions.length > 0 ? (
              <button
                onClick={() => toggleExpanded(itemKey)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {isExpanded ? "Skryť detail" : "Zobraziť detail"}
                <span className="text-white/48"> ({sessions.length})</span>
              </button>
            ) : null}
          </div>
        </div>

        {isExpanded ? (
          <div className="mt-6 flex flex-col gap-5 border-t border-white/10 pt-6">
            {sessions.map((session) => (
              <div key={session.id}>
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <h4 className="text-xl font-semibold tracking-tight text-white">{session.sessionName}</h4>
                  <div className="text-sm text-white/54">{formatTimeRange(session.startTime, session.endTime)}</div>
                </div>
                <SessionDetailTable session={session} />
              </div>
            ))}
          </div>
        ) : null}
      </motion.article>
    );
  };

  return (
    <div className="bg-[#06101d] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <SectionHeading
            eyebrow="Program"
            title="Program konferencie v čitateľnejšej skladbe."
            description={activeConference?.name ?? "Conference.Name"}
            invert
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-cyan-100">
              <CalendarDays className="size-5" />
              <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/54">Rozsah konferencie</span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {formatDate(activeConference?.startDate)}
              {activeConference?.endDate ? ` - ${formatDate(activeConference.endDate)}` : ""}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Programové dni, položky, sessions aj prezentácie zostávajú viazané na existujúce backend DTO.
            </p>
            {activeConference?.id ? (
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/14 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                  onClick={handleDownloadProgramPdf}
                  disabled={isDownloadingPdf}
                >
                  <Download data-icon="inline-start" />
                  {isDownloadingPdf ? "Sťahujem PDF..." : "Stiahnuť program (PDF)"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {programDays.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 py-16 text-center text-white/64">
            Program pre aktívnu konferenciu zatiaľ nie je dostupný.
          </div>
        ) : (
          <Tabs defaultValue={String(programDays[0]?.id ?? "")} className="mt-10 w-full gap-8">
            <TabsList className="grid h-auto w-full gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-2" style={{ gridTemplateColumns: `repeat(${programDays.length}, minmax(0, 1fr))` }}>
              {programDays.map((programDay) => (
                <TabsTrigger key={programDay.id} value={String(programDay.id)} className="min-h-16 rounded-[1.25rem] border border-transparent px-3 py-4 text-left text-white/72 data-[state=active]:border-white/10 data-[state=active]:bg-white data-[state=active]:text-slate-950">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Deň {programDay.order + 1}</span>
                    <span className="mt-1 text-sm font-semibold">{programDay.label || formatDayTab(programDay.date)}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {programDays.map((programDay) => (
              <TabsContent key={programDay.id} value={String(programDay.id)}>
                <div className="mb-6 flex flex-col gap-1">
                  <h3 className="text-3xl font-semibold tracking-tight text-white">{programDay.label || formatDayTab(programDay.date)}</h3>
                  <p className="text-white/54">{formatDate(programDay.date)}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {sortProgramItems(programDay.programItems).map((item) => renderScheduleItem(item, String(programDay.id)))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
