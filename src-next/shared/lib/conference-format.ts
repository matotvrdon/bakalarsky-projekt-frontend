import type { ImportantDate, ProgramItemType } from "../api/conference-api";

export function formatDate(value?: string | null) {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
}

export function formatConferenceRange(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return "";
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function formatDayTab(value?: string | null) {
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
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 5);
}

export function formatTimeRange(startTime?: string | null, endTime?: string | null) {
  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (start && end) return `${start} - ${end}`;
  return start || end || "";
}

export function isDateUpdated(importantDate: ImportantDate) {
  return Boolean(importantDate.updatedDate && importantDate.updatedDate !== importantDate.normalDate);
}

export function getDateStatusLabel(importantDate: ImportantDate) {
  if (importantDate.importantDatesStatus === "Extended") return "Predĺžené";
  if (importantDate.importantDatesStatus === "Shortened") return "Skrátené";
  return "V termíne";
}

export function getProgramTone(type: ProgramItemType) {
  switch (type) {
    case 2:
      return { label: "Keynote", accent: "from-sky-400 to-cyan-300", border: "border-sky-400/30", pill: "bg-sky-500/12 text-sky-100 border-sky-300/30" };
    case 3:
    case 4:
      return { label: "Sekcia", accent: "from-emerald-300 to-lime-200", border: "border-emerald-400/30", pill: "bg-emerald-500/12 text-emerald-50 border-emerald-300/30" };
    case 5:
      return { label: "Workshop", accent: "from-fuchsia-300 to-pink-300", border: "border-fuchsia-400/30", pill: "bg-fuchsia-500/12 text-fuchsia-50 border-fuchsia-300/30" };
    case 6:
      return { label: "Panel", accent: "from-amber-300 to-orange-300", border: "border-amber-400/30", pill: "bg-amber-500/12 text-amber-50 border-amber-300/30" };
    case 7:
      return { label: "Prestávka", accent: "from-stone-300 to-zinc-200", border: "border-white/12", pill: "bg-white/8 text-white/72 border-white/12" };
    case 8:
      return { label: "Spoločenský program", accent: "from-rose-300 to-orange-200", border: "border-rose-400/30", pill: "bg-rose-500/12 text-rose-50 border-rose-300/30" };
    case 9:
      return { label: "Poster", accent: "from-yellow-300 to-amber-200", border: "border-yellow-400/30", pill: "bg-yellow-500/12 text-yellow-50 border-yellow-300/30" };
    case 0:
      return { label: "Registrácia", accent: "from-indigo-300 to-violet-200", border: "border-indigo-400/30", pill: "bg-indigo-500/12 text-indigo-50 border-indigo-300/30" };
    case 1:
      return { label: "Otvorenie", accent: "from-teal-300 to-emerald-200", border: "border-teal-400/30", pill: "bg-teal-500/12 text-teal-50 border-teal-300/30" };
    case 10:
      return { label: "Záver", accent: "from-red-300 to-orange-200", border: "border-red-400/30", pill: "bg-red-500/12 text-red-50 border-red-300/30" };
    default:
      return { label: "Program", accent: "from-white to-zinc-300", border: "border-white/12", pill: "bg-white/8 text-white/72 border-white/12" };
  }
}
