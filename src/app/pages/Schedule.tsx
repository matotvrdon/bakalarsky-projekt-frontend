import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Clock, Download, MapPin, User, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useActiveConference } from "../hooks/useActiveConference.ts";
import {
  downloadConferenceProgramPdf,
  type ProgramDay,
  type ProgramItem,
  type ProgramItemType,
  type ProgramPresentation,
  type ProgramSession,
} from "../api/conferenceApi.ts";

const PROGRAM_ITEM_TYPE = {
  registration: 0,
  opening: 1,
  keynote: 2,
  parallel: 3,
  session: 4,
  workshop: 5,
  panel: 6,
  break: 7,
  social: 8,
  poster: 9,
  closing: 10,
} as const;

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
};

const formatDayTab = (value?: string | null) => {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return formatDate(value);
  }

  return parsedDate.toLocaleDateString("sk-SK", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
};

const formatTime = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 5);
};

const formatTimeRange = (startTime?: string | null, endTime?: string | null) => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (start && end) return `${start} - ${end}`;
  return start || end || "";
};

const getTypeColor = (type: ProgramItemType) => {
  switch (type) {
    case PROGRAM_ITEM_TYPE.keynote:
      return "border-l-4 border-l-blue-500 bg-blue-50";
    case PROGRAM_ITEM_TYPE.parallel:
    case PROGRAM_ITEM_TYPE.session:
      return "border-l-4 border-l-green-500 bg-green-50";
    case PROGRAM_ITEM_TYPE.workshop:
      return "border-l-4 border-l-purple-500 bg-purple-50";
    case PROGRAM_ITEM_TYPE.panel:
      return "border-l-4 border-l-orange-500 bg-orange-50";
    case PROGRAM_ITEM_TYPE.break:
      return "border-l-4 border-l-gray-400 bg-gray-50";
    case PROGRAM_ITEM_TYPE.social:
      return "border-l-4 border-l-pink-500 bg-pink-50";
    case PROGRAM_ITEM_TYPE.poster:
      return "border-l-4 border-l-yellow-500 bg-yellow-50";
    case PROGRAM_ITEM_TYPE.registration:
      return "border-l-4 border-l-indigo-500 bg-indigo-50";
    case PROGRAM_ITEM_TYPE.opening:
      return "border-l-4 border-l-green-600 bg-green-100";
    case PROGRAM_ITEM_TYPE.closing:
      return "border-l-4 border-l-red-500 bg-red-50";
    default:
      return "border-l-4 border-l-gray-300 bg-gray-50";
  }
};

const sortPresentations = (presentations?: ProgramPresentation[] | null) =>
  [...(presentations ?? [])].sort((left, right) => left.order - right.order);

const sortSessions = (sessions?: ProgramSession[] | null) =>
  [...(sessions ?? [])].sort((left, right) => left.order - right.order);

const sortProgramItems = (items?: ProgramItem[] | null) =>
  [...(items ?? [])].sort((left, right) => left.order - right.order);

const sortProgramDays = (days?: ProgramDay[] | null) =>
  [...(days ?? [])].sort((left, right) => left.order - right.order);

const SessionDetailTable = ({ session }: { session: ProgramSession }) => {
  const presentations = sortPresentations(session.presentations);

  return (
    <div className="mt-4">
      {session.chair ? (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span><strong>Chair:</strong> {session.chair}</span>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Čas</TableHead>
              <TableHead>Autori</TableHead>
              <TableHead>Názov príspevku</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presentations.map((presentation) => (
              <TableRow key={presentation.id}>
                <TableCell className="font-medium text-sm whitespace-nowrap">
                  {formatTimeRange(presentation.startTime, presentation.endTime)}
                </TableCell>
                <TableCell className="text-sm">{presentation.authors}</TableCell>
                <TableCell className="text-sm italic">{presentation.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export function Schedule() {
  const activeConference = useActiveConference();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const programDays = sortProgramDays(activeConference?.settings?.programDays);

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDownloadProgramPdf = async () => {
    if (!activeConference?.id || isDownloadingPdf) {
      return;
    }

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

    return (
      <Card key={item.id} className={getTypeColor(item.type)}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{formatTimeRange(item.startTime, item.endTime)}</span>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-bold mb-1">{item.title}</h3>
              {item.speaker ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{item.speaker}</span>
                </div>
              ) : null}
              {item.chair && sessions.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Chair: {item.chair}</span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {item.location ? (
                <>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{item.location}</span>
                </>
              ) : null}
            </div>
          </div>

          {sessions.length > 0 ? (
            <div className="mt-6">
              <button
                onClick={() => toggleExpanded(itemKey)}
                className="text-blue-600 hover:text-blue-800 font-semibold mb-4 flex items-center gap-2"
              >
                {isExpanded ? "Skryť detail" : "Zobraziť detail"}
                <span className="text-xs">({sessions.length} {sessions.length === 1 ? "session" : "sessions"})</span>
              </button>

              {isExpanded ? (
                <div className="space-y-6">
                  {sessions.map((session) => (
                    <div key={session.id} className="border-t pt-4">
                      <h4 className="font-bold text-lg mb-2">{session.sessionName}</h4>
                      <SessionDetailTable session={session} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Program konferencie</h1>
          <p className="text-xl text-gray-600">
            {activeConference?.name ?? "Conference.Name"}
          </p>
          <p className="text-lg text-gray-500">
            {formatDate(activeConference?.startDate)}{activeConference?.endDate ? ` - ${formatDate(activeConference.endDate)}` : ""}
          </p>
          {activeConference?.id ? (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="lg" className="gap-2" onClick={handleDownloadProgramPdf} disabled={isDownloadingPdf}>
                <Download className="w-4 h-4" />
                {isDownloadingPdf ? "Sťahujem PDF..." : "Stiahnuť program (PDF)"}
              </Button>
            </div>
          ) : null}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Pozvané prednášky</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Paralelné sekcie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Workshopy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div>
                <span className="text-sm">Spoločenské</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm">Prestávky</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {programDays.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-600">
              Program pre aktívnu konferenciu zatiaľ nie je dostupný.
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={String(programDays[0]?.id ?? "")} className="w-full">
            <TabsList className={`grid w-full mb-8 h-auto`} style={{ gridTemplateColumns: `repeat(${programDays.length}, minmax(0, 1fr))` }}>
              {programDays.map((programDay) => (
                <TabsTrigger key={programDay.id} value={String(programDay.id)} className="text-xs sm:text-sm py-3">
                  <span className="hidden sm:inline">{programDay.label || formatDayTab(programDay.date)}</span>
                  <span className="sm:hidden">{formatDate(programDay.date).slice(0, 5)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {programDays.map((programDay) => (
              <TabsContent key={programDay.id} value={String(programDay.id)}>
                <div className="space-y-4">
                  {sortProgramItems(programDay.programItems).map((item) =>
                    renderScheduleItem(item, String(programDay.id))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
