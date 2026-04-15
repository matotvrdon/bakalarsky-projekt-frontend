import { Link } from "react-router";
import { motion } from "motion/react";
import { AlertCircle, FileText } from "lucide-react";

import { Alert, AlertDescription, Button } from "../../../shared/ui";
import { SectionHeading } from "../components";

type SubmissionSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const submissionSections: SubmissionSection[] = [
  {
    title: "Príprava a odoslanie finálneho príspevku",
    paragraphs: [
      "Pred odoslaním finálneho príspevku musia autori použiť IEEE PDF eXpress, aby sa uistili, že príspevok je kompatibilný s IEEE Xplore. ID konferencie je 622MM.",
      "Keď je status príspevku \"Pass\", kliknite na tlačidlo \"Approve\" v poli Action. Potom sa status zmení na \"Approved\".",
      "Stránka na odovzdanie finálnych príspevkov je otvorená do 2. novembra. Po tomto termíne systém nové odovzdanie neprijíma.",
      "Nahrajte schválenú verziu PDF do EasyChair systému.",
    ],
  },
  {
    title: "Príprava príspevku",
    paragraphs: [
      "Odoslané príspevky by mali obsahovať pôvodné nepublikované výsledky v téme konferencie. Príspevok by nemal prekročiť 6 strán.",
      "Príspevky sú určené na publikovanie v IEEE šablóne. Autori môžu použiť LaTeX (preferované) alebo Microsoft Word šablónu od IEEE.",
      "Príspevky sú spravované cez EasyChair systém. Proces odoslania má dva kroky.",
    ],
    bullets: [
      "Odoslanie abstraktu: abstrakt má mať viac ako 150 slov vrátane názvu, mien, afiliácie autorov a navrhnutej témy.",
      "Odoslanie plného príspevku: doplnenie plného textu vo formáte PDF k existujúcemu odoslaniu.",
    ],
  },
];

export function SubmissionsPage() {
  return (
    <div className="bg-[#06101d] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.36fr] lg:items-end">
          <SectionHeading
            eyebrow="Príspevky"
            title="Pokyny pre prípravu a odovzdanie príspevku"
            description="Obsah ostáva zachovaný z pôvodnej stránky, ale je vyskladaný pre lepšie skenovanie a orientáciu."
            invert
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/72">Konferenčné ID</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">622MM</p>
            <p className="mt-2 text-sm leading-7 text-white/62">Použite pri validácii PDF v IEEE PDF eXpress.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.36fr]">
          <div className="flex flex-col gap-6">
            {submissionSections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: index * 0.07, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-white">{section.title}</h2>
                <div className="mt-5 flex flex-col gap-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-white/72 md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-cyan-200" />
                        <p className="text-sm leading-7 text-white/72 md:text-base">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </motion.section>
            ))}

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/72">LaTeX snippet</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0a1422] p-4 text-sm text-cyan-100">
                <code>{"\\documentclass[conference, a4paper]{IEEEtran}"}</code>
              </pre>
            </section>
          </div>

          <aside className="flex flex-col gap-4">
            <Alert className="border-white/12 bg-white/6 text-white">
              <AlertCircle className="h-4 w-4 text-cyan-200" />
              <AlertDescription className="text-white/75">
                Minimálne jeden autor musí príspevok odprezentovať na konferencii, inak nebude publikovaný.
              </AlertDescription>
            </Alert>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <FileText className="size-4" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">Dôležité</h3>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-sm leading-7 text-white/70">
                <p>Príspevky budú kontrolované proti plagiátorstvu.</p>
                <p>Duplicitné odoslania nie sú akceptované.</p>
                <p>Po konferencii sa príspevky publikujú podľa IEEE pravidiel.</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">Navigácia</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button className="h-11 rounded-full bg-cyan-300 px-5 text-slate-950 hover:bg-cyan-200">
                    Registrácia
                  </Button>
                </Link>
                <Link to="/schedule">
                  <Button variant="outline" className="h-11 rounded-full border-white/14 bg-white/6 px-5 text-white hover:bg-white/10 hover:text-white">
                    Program
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
