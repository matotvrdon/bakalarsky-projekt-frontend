export function Committees() {
    return (
        <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-12">
    <h1 className="text-4xl font-bold mb-2">Komisie</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
    {/* General Chair */}
    <section>
    <h2 className="text-2xl font-bold mb-4">Hlavný predseda</h2>
    <ul className="space-y-2 text-gray-700">
        <li>prof. Ing. Liberios Vokorokos, PhD., Dekan Fakulty elektrotechniky a informatiky, Technická univerzita v Košiciach (SK)</li>
    </ul>
    </section>

    {/* Honorary Chair */}
    <section>
        <h2 className="text-2xl font-bold mb-4">Čestný predseda</h2>
    <ul className="space-y-2 text-gray-700">
        <li>prof. Ing. Mikuláš Alexík, PhD., Slovenská spoločnosť aplikovanej kybernetiky (SK)</li>
    </ul>
    </section>

    {/* Program Committee */}
    <section>
        <h2 className="text-2xl font-bold mb-4">Programová komisia</h2>

    <h3 className="text-xl font-semibold mb-3 mt-6">Čestný programový predseda</h3>
    <ul className="space-y-2 text-gray-700">
        <li>Valerie Novitzká, Technická univerzita v Košiciach (SK)</li>
    </ul>

    <h3 className="text-xl font-semibold mb-3 mt-6">Programový predseda</h3>
    <ul className="space-y-2 text-gray-700">
        <li>William Steingartner, Technická univerzita v Košiciach (SK)</li>
    </ul>

    <h3 className="text-xl font-semibold mb-3 mt-6">Členovia</h3>
        <ul className="space-y-2 text-gray-700">
        <li>Mikola Bartha, Memorial University of Newfoundland (CA)</li>
    <li>Fatma Bouzghit, University of Antwerp (BE)</li>
    <li>Jan Čapek, University of Pardubice (CZ)</li>
    <li>Erik Duvot, Katholieke Universiteit Leuven (BE)</li>
    <li>Dimitar Filov, Ohio State University (US)</li>
    <li>Zoltán Erdős, University of Szeged (HU)</li>
    <li>Gianna Gabor, University of Oradea (RO)</li>
    <li>Darko Goliner, Zagreb University of Applied Sciences (HR)</li>
    <li>Jan Genči, Technická univerzita v Košiciach (SK)</li>
    <li>Andrzej Grzykowski, Czestochowa University of Technology (PL)</li>
    <li>Tamás Hadberger, Óbuda University, Budapest (HU)</li>
    <li>Pedro Rangel Henriques, University of Minho, Braga (PT)</li>
    <li>Pavel Herout, University of West Bohemia, Pilsen (CZ)</li>
    <li>Elke Hochmüller, Carinthia University of Applied Sciences (AT)</li>
    <li>László Horváth, Óbuda University, Budapest (HU)</li>
    </ul>
    </section>
    </div>

    {/* Right Column */}
    <div className="space-y-8">
    {/* Organizing Committee */}
    <section>
    <h2 className="text-2xl font-bold mb-4">Organizačná komisia</h2>

    <h3 className="text-xl font-semibold mb-3">Hlavný manažér</h3>
    <ul className="space-y-2 text-gray-700">
    <li>William Steingartner, Technická univerzita v Košiciach, Slovensko</li>
    </ul>

    <h3 className="text-xl font-semibold mb-3 mt-6">Čestný predseda</h3>
    <ul className="space-y-2 text-gray-700">
        <li>Milan Šujánsky, Technická univerzita v Košiciach (SK)</li>
    </ul>

    <h3 className="text-xl font-semibold mb-3 mt-6">Finančný predseda</h3>
    <ul className="space-y-2 text-gray-700">
        <li>Aniko Szakal, Óbuda University, Budapest (HU)</li>
    </ul>

    <h3 className="text-xl font-semibold mb-3 mt-6">Členovia</h3>
        <ul className="space-y-2 text-gray-700">
    <li>Sergio Chediuaev, Technická univerzita v Košiciach (SK)</li>
    <li>Štefan Korecko, Technická univerzita v Košiciach (SK)</li>
    <li>Ján Perháč, Technická univerzita v Košiciach (SK)</li>
    <li>Samuel Novotný, Technická univerzita v Košiciach (SK)</li>
    </ul>
    </section>
    </div>
    </div>
    </div>
    </div>
);
}
