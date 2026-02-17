import { Card, CardContent, CardHeader } from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

const speakers = [
  {
    id: 1,
    name: "Dr. Maria Schmidt",
    title: "Profesorka AI a strojového učenia",
    affiliation: "MIT, USA",
    bio: "Vedúca výskumného tímu v oblasti hlbokého učenia s 15-ročnými skúsenosťami. Autorka 50+ vedeckých článkov.",
    topics: ["Umelá inteligencia", "Strojové učenie", "Neurónové siete"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
  },
  {
    id: 2,
    name: "Prof. Anna Kováčová",
    title: "Vedúca katedry biotechnológií",
    affiliation: "Univerzita Komenského, Slovensko",
    bio: "Špecializuje sa na genetické inžinierstvo a molekulárnu biológiu. Nositeľka mnohých vedeckých ocenení.",
    topics: ["Biotechnológie", "Genetika", "Medicína"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    title: "Senior výskumník",
    affiliation: "Oxford University, UK",
    bio: "Priekopník v oblasti kvantového výpočtu. Pracoval na mnohých prelomových projektoch.",
    topics: ["Kvantová fyzika", "Kvantové výpočty"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    id: 4,
    name: "Dr. Peter Horváth",
    title: "AI Researcher",
    affiliation: "Google DeepMind, UK",
    bio: "Zameriava sa na aplikácie AI v reálnom svete. Autor populárnych workshopov a školení.",
    topics: ["Praktické AI", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
  },
  {
    id: 5,
    name: "Prof. Elena Petrova",
    title: "Vedúca výskumu klimatických zmien",
    affiliation: "ETH Zürich, Švajčiarsko",
    bio: "Renomovaná klimatologička s 20-ročnými skúsenosťami. Poradkyňa OSN pre klimatické zmeny.",
    topics: ["Klimatické zmeny", "Udržateľnosť"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: 6,
    name: "Dr. Martin Svoboda",
    title: "Expert na obnoviteľnú energiu",
    affiliation: "Technická univerzita v Prahe, Česko",
    bio: "Špecialista na solárne a veterné technológie. Autor 30+ patentov v oblasti energetiky.",
    topics: ["Obnoviteľné zdroje", "Energia"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: 7,
    name: "Prof. Sarah Johnson",
    title: "Neurológ a kognitívny vedec",
    affiliation: "Harvard Medical School, USA",
    bio: "Priekopníčka výskumu mozgu a pamäti. Nositeľka prestížnych vedeckých ocenení.",
    topics: ["Neurológia", "Kognitívne vedy"],
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
  },
  {
    id: 8,
    name: "Dr. Robert Chen",
    title: "Bioinformatik",
    affiliation: "Stanford University, USA",
    bio: "Špecialista na analýzu genomických dát a personalizovanú medicínu.",
    topics: ["Bioinformatika", "Genomika"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
];

export function Speakers() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Prednášajúci</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stretnite sa s renomovanými vedcami a odborníkmi z celého sveta
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <Card key={speaker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <h3 className="font-bold text-xl mb-1">{speaker.name}</h3>
                <p className="text-sm text-gray-600">{speaker.title}</p>
                <p className="text-sm text-blue-600">{speaker.affiliation}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{speaker.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {speaker.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
