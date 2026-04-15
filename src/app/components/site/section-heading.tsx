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
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const titleColor = invert ? "text-white" : "text-slate-950";
  const descriptionColor = invert ? "text-white/68" : "text-slate-600";
  const eyebrowColor = invert ? "text-cyan-200" : "text-cyan-700";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.32em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl leading-tight font-semibold tracking-tight md:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-7 md:text-lg ${descriptionColor}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
