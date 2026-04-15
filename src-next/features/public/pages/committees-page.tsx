import { motion } from "motion/react";
import { Users } from "lucide-react";

import { SectionHeading } from "../components";

type CommitteeGroup = {
  title: string;
  members: string[];
};

type CommitteeColumn = {
  heading: string;
  groups: CommitteeGroup[];
};

const committeeColumns: CommitteeColumn[] = [
  {
    heading: "Programová časť",
    groups: [
      {
        title: "Hlavný predseda",
        members: [
          "prof. Ing. Liberios Vokorokos, PhD., Dekan Fakulty elektrotechniky a informatiky, Technická univerzita v Košiciach (SK)",
        ],
      },
      {
        title: "Čestný predseda",
        members: [
          "prof. Ing. Mikuláš Alexík, PhD., Slovenská spoločnosť aplikovanej kybernetiky (SK)",
        ],
      },
      {
        title: "Čestný programový predseda",
        members: ["Valerie Novitzká, Technická univerzita v Košiciach (SK)"],
      },
      {
        title: "Programový predseda",
        members: ["William Steingartner, Technická univerzita v Košiciach (SK)"],
      },
      {
        title: "Programová komisia - členovia",
        members: [
          "Mikola Bartha, Memorial University of Newfoundland (CA)",
          "Fatma Bouzghit, University of Antwerp (BE)",
          "Jan Čapek, University of Pardubice (CZ)",
          "Erik Duvot, Katholieke Universiteit Leuven (BE)",
          "Dimitar Filov, Ohio State University (US)",
          "Zoltán Erdős, University of Szeged (HU)",
          "Gianna Gabor, University of Oradea (RO)",
          "Darko Goliner, Zagreb University of Applied Sciences (HR)",
          "Jan Genči, Technická univerzita v Košiciach (SK)",
          "Andrzej Grzykowski, Czestochowa University of Technology (PL)",
          "Tamás Hadberger, Óbuda University, Budapest (HU)",
          "Pedro Rangel Henriques, University of Minho, Braga (PT)",
          "Pavel Herout, University of West Bohemia, Pilsen (CZ)",
          "Elke Hochmüller, Carinthia University of Applied Sciences (AT)",
          "László Horváth, Óbuda University, Budapest (HU)",
        ],
      },
    ],
  },
  {
    heading: "Organizačná časť",
    groups: [
      {
        title: "Hlavný manažér",
        members: ["William Steingartner, Technická univerzita v Košiciach, Slovensko"],
      },
      {
        title: "Čestný predseda",
        members: ["Milan Šujánsky, Technická univerzita v Košiciach (SK)"],
      },
      {
        title: "Finančný predseda",
        members: ["Aniko Szakal, Óbuda University, Budapest (HU)"],
      },
      {
        title: "Organizačná komisia - členovia",
        members: [
          "Sergio Chediuaev, Technická univerzita v Košiciach (SK)",
          "Štefan Korecko, Technická univerzita v Košiciach (SK)",
          "Ján Perháč, Technická univerzita v Košiciach (SK)",
          "Samuel Novotný, Technická univerzita v Košiciach (SK)",
        ],
      },
    ],
  },
];

function CommitteeBlock({ group }: { group: CommitteeGroup }) {
  return (
    <section className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-xl font-semibold tracking-tight text-white">{group.title}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {group.members.map((member) => (
          <p key={member} className="text-sm leading-7 text-white/70">
            {member}
          </p>
        ))}
      </div>
    </section>
  );
}

export function CommitteesPage() {
  return (
    <div className="bg-[#06101d] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Komisie"
          title="Odborné a organizačné vedenie konferencie"
          description="Zoznam ostáva obsahovo rovnaký ako v pôvodnej verzii, zmenili sme len kompozíciu a čitateľnosť."
          invert
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {committeeColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Users className="size-4" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">{column.heading}</h2>
                </div>
                <div className="flex flex-col gap-6">
                  {column.groups.map((group) => (
                    <CommitteeBlock key={group.title} group={group} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
