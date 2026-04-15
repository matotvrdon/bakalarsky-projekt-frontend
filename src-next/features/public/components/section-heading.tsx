import { cn } from "../../../shared/ui";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : undefined)}>
      {eyebrow ? (
        <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[0.32em]", invert ? "text-cyan-200" : "text-cyan-700")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-3xl font-semibold tracking-tight leading-tight md:text-5xl", invert ? "text-white" : "text-slate-950")}>{title}</h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-7 md:text-lg", invert ? "text-white/68" : "text-slate-600")}>{description}</p>
      ) : null}
    </div>
  );
}
