import { Card, CardContent } from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Clock, MapPin, User } from "lucide-react";

const scheduleData = {
  day1: [
    {
      time: "08:00 - 09:00",
      title: "Registrácia a ranná káva",
      location: "Vstupná hala",
      type: "other",
    },
    {
      time: "09:00 - 09:30",
      title: "Otvorenie konferencie",
      speaker: "Prof. Ján Novák",
      location: "Hlavná sála",
      type: "keynote",
    },
    {
      time: "09:30 - 10:30",
      title: "Hlavná prednáška: Budúcnosť umelej inteligencie",
      speaker: "Dr. Maria Schmidt",
      location: "Hlavná sála",
      type: "keynote",
    },
    {
      time: "10:30 - 11:00",
      title: "Prestávka na kávu",
      location: "Foyer",
      type: "break",
    },
    {
      time: "11:00 - 12:30",
      title: "Paralelné sekcie: AI a strojové učenie",
      location: "Sály A, B, C",
      type: "session",
    },
    {
      time: "12:30 - 14:00",
      title: "Obed",
      location: "Reštaurácia",
      type: "break",
    },
    {
      time: "14:00 - 15:30",
      title: "Workshop: Praktické aplikácie AI",
      speaker: "Dr. Peter Horváth",
      location: "Laboratórium 1",
      type: "workshop",
    },
    {
      time: "15:30 - 16:00",
      title: "Prestávka na kávu",
      location: "Foyer",
      type: "break",
    },
    {
      time: "16:00 - 17:30",
      title: "Panelová diskusia: Etika v AI",
      location: "Hlavná sála",
      type: "panel",
    },
    {
      time: "18:00 - 20:00",
      title: "Otváracie večerné prijatie",
      location: "Terasa",
      type: "social",
    },
  ],
  day2: [
    {
      time: "09:00 - 10:00",
      title: "Hlavná prednáška: Biotechnológie a medicína",
      speaker: "Prof. Anna Kováčová",
      location: "Hlavná sála",
      type: "keynote",
    },
    {
      time: "10:00 - 10:30",
      title: "Prestávka na kávu",
      location: "Foyer",
      type: "break",
    },
    {
      time: "10:30 - 12:00",
      title: "Paralelné sekcie: Biotechnológie",
      location: "Sály A, B, C",
      type: "session",
    },
    {
      time: "12:00 - 13:30",
      title: "Obed",
      location: "Reštaurácia",
      type: "break",
    },
    {
      time: "13:30 - 15:00",
      title: "Paralelné sekcie: Obnoviteľné zdroje",
      location: "Sály A, B, C",
      type: "session",
    },
    {
      time: "15:00 - 15:30",
      title: "Prestávka na kávu",
      location: "Foyer",
      type: "break",
    },
    {
      time: "15:30 - 17:00",
      title: "Workshop: Udržateľná energia",
      speaker: "Dr. Martin Svoboda",
      location: "Laboratórium 2",
      type: "workshop",
    },
    {
      time: "17:00 - 18:00",
      title: "Posterová sekcia",
      location: "Foyer",
      type: "poster",
    },
  ],
  day3: [
    {
      time: "09:00 - 10:00",
      title: "Hlavná prednáška: Kvantový výpočet",
      speaker: "Dr. James Wilson",
      location: "Hlavná sála",
      type: "keynote",
    },
    {
      time: "10:00 - 10:30",
      title: "Prestávka na kávu",
      location: "Foyer",
      type: "break",
    },
    {
      time: "10:30 - 12:00",
      title: "Paralelné sekcie: Fyzika a matematika",
      location: "Sály A, B, C",
      type: "session",
    },
    {
      time: "12:00 - 13:30",
      title: "Obed",
      location: "Reštaurácia",
      type: "break",
    },
    {
      time: "13:30 - 15:00",
      title: "Záverečná plenárna sekcia",
      location: "Hlavná sála",
      type: "session",
    },
    {
      time: "15:00 - 15:30",
      title: "Záverečná reč a odovzdávanie cien",
      speaker: "Prof. Ján Novák",
      location: "Hlavná sála",
      type: "keynote",
    },
    {
      time: "15:30 - 16:00",
      title: "Uzavretie konferencie",
      location: "Hlavná sála",
      type: "other",
    },
  ],
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "keynote":
      return "border-l-4 border-l-blue-500 bg-blue-50";
    case "session":
      return "border-l-4 border-l-green-500 bg-green-50";
    case "workshop":
      return "border-l-4 border-l-purple-500 bg-purple-50";
    case "panel":
      return "border-l-4 border-l-orange-500 bg-orange-50";
    case "break":
      return "border-l-4 border-l-gray-400 bg-gray-50";
    case "social":
      return "border-l-4 border-l-pink-500 bg-pink-50";
    case "poster":
      return "border-l-4 border-l-yellow-500 bg-yellow-50";
    default:
      return "border-l-4 border-l-gray-300 bg-gray-50";
  }
};

export function Schedule() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Program konferencie</h1>
          <p className="text-xl text-gray-600">
            15-17 mája 2026
          </p>
        </div>

        {/* Legend */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Hlavné prednášky</span>
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
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Panelové diskusie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div>
                <span className="text-sm">Spoločenské</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Tabs */}
        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto">
            <TabsTrigger value="day1" className="text-xs sm:text-sm py-3">
              <span className="hidden sm:inline">Deň 1 - 15.5.</span>
              <span className="sm:hidden">15.5.</span>
            </TabsTrigger>
            <TabsTrigger value="day2" className="text-xs sm:text-sm py-3">
              <span className="hidden sm:inline">Deň 2 - 16.5.</span>
              <span className="sm:hidden">16.5.</span>
            </TabsTrigger>
            <TabsTrigger value="day3" className="text-xs sm:text-sm py-3">
              <span className="hidden sm:inline">Deň 3 - 17.5.</span>
              <span className="sm:hidden">17.5.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day1">
            <div className="space-y-4">
              {scheduleData.day1.map((item, index) => (
                <Card key={index} className={getTypeColor(item.type)}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{item.time}</span>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        {item.speaker && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{item.speaker}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="day2">
            <div className="space-y-4">
              {scheduleData.day2.map((item, index) => (
                <Card key={index} className={getTypeColor(item.type)}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{item.time}</span>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        {item.speaker && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{item.speaker}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="day3">
            <div className="space-y-4">
              {scheduleData.day3.map((item, index) => (
                <Card key={index} className={getTypeColor(item.type)}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{item.time}</span>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        {item.speaker && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{item.speaker}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}