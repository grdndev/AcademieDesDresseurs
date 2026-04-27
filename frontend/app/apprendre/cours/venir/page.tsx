"use client";

import { useMemo, useState } from "react";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import Pagination from "../../../components/ui/Pagination";
import Badge from "../../../components/ui/Badge";
import { Clock, ChevronDown, Search, MapPin, Users, Calendar } from "lucide-react";

const COURS = [
    { image: "/res/course1.png", isLive: true, date: "15 Fév 2024", level: "Avancé",        title: "Analyse méta Championnats Régionaux",   authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h30", price: 44, horaire: "14:00 – 17:30", places: 4,  href: "/apprendre/c1" },
    { image: "/res/course2.png",              date: "20 Fév 2024", level: "Avancé",        title: "Méta game et deck building avancé",     authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h00", price: 40, horaire: "18:00 – 20:00", places: 12, href: "/apprendre/c2" },
    { image: "/res/course3.png",              date: "1 Mar 2024",  level: "Intermédiaire", title: "Gestion de ressources et temps",        authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 30, horaire: "19:00 – 20:30", places: 8,  href: "/apprendre/c3" },
    { image: "/res/course1.png",              date: "5 Mar 2024",  level: "Avancé",        title: "Construire son premier deck compétitif",authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h15", price: 35, horaire: "17:00 – 19:15", places: 6,  href: "/apprendre/c4" },
    { image: "/res/course2.png",              date: "10 Mar 2024", level: "Débutant",      title: "Analyse méta et sideboard efficace",    authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "2h45", price: 30, horaire: "20:00 – 22:45", places: 15, href: "/apprendre/c5" },
    { image: "/res/course3.png",              date: "15 Mar 2024", level: "Intermédiaire", title: "Préparation aux tournois régionaux",    authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "3h00", price: 30, horaire: "15:00 – 18:00", places: 3,  href: "/apprendre/c6" },
];

const LEVELS    = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
const PROFS     = ["Tous", "Thomas Moreau", "Lucas Bernard", "Prof. M. Dubois", "Sarah K."];
const FORMATS   = ["Tous", "Standard", "Expanded", "Live"];
const PRIX_OPTS = ["Tous", "< 30€", "30€ – 40€", "> 40€"];
const SORTS     = ["Les plus récents", "Prix croissant", "Prix décroissant"];
const PER_PAGE  = 6;

function matchesPrix(price: number, opt: string) {
    if (opt === "Tous") return true;
    if (opt === "< 30€") return price < 30;
    if (opt === "30€ – 40€") return price >= 30 && price <= 40;
    return price > 40;
}

export default function CoursAVenirPage() {
    const [search, setSearch] = useState("");
    const [level,  setLevel]  = useState("Tous");
    const [prof,   setProf]   = useState("Tous");
    const [format, setFormat] = useState("Tous");
    const [prix,   setPrix]   = useState("Tous");
    const [sort,   setSort]   = useState(SORTS[0]);
    const [page,   setPage]   = useState(1);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        let list = COURS.filter(c => {
            if (q && !c.title.toLowerCase().includes(q) && !c.authorName.toLowerCase().includes(q)) return false;
            if (level !== "Tous" && c.level !== level) return false;
            if (prof !== "Tous" && c.authorName !== prof) return false;
            if (!matchesPrix(c.price, prix)) return false;
            return true;
        });
        if (sort === "Prix croissant")   list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "Prix décroissant") list = [...list].sort((a, b) => b.price - a.price);
        return list;
    }, [search, level, prof, format, prix, sort]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    function resetPage() { setPage(1); }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-8">

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm px-5 py-4 flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
                        <input type="text" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                            placeholder="Rechercher un cours ou un professeur…"
                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { label: "Niveau",     opts: LEVELS,    val: level,  set: setLevel  },
                            { label: "Professeur", opts: PROFS,     val: prof,   set: setProf   },
                            { label: "Format",     opts: FORMATS,   val: format, set: setFormat },
                            { label: "Prix",       opts: PRIX_OPTS, val: prix,   set: setPrix   },
                        ].map(({ label, opts, val, set }) => (
                            <div key={label} className="relative">
                                <select value={val} onChange={e => { set(e.target.value); resetPage(); }}
                                    className="appearance-none h-8 pl-3 pr-7 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                                    {opts.map(o => <option key={o} value={o}>{o === "Tous" ? label : o}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#808896] pointer-events-none" />
                            </div>
                        ))}
                        <div className="ml-auto relative">
                            <select value={sort} onChange={e => { setSort(e.target.value); resetPage(); }}
                                className="appearance-none h-8 pl-3 pr-7 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                                {SORTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#808896] pointer-events-none" />
                        </div>
                        <span className="text-xs text-[#808896]">{filtered.length} cours</span>
                    </div>
                </div>

                {/* Grid */}
                {paginated.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {paginated.map(c => (
                            <div key={c.href} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                {/* Thumbnail */}
                                <div className="relative h-44 bg-gray-200">
                                    {c.isLive && (
                                        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">LIVE</span>
                                    )}
                                    <span className="absolute top-3 right-3 z-10 bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {c.date}
                                    </span>
                                </div>

                                <div className="p-4 flex flex-col flex-1 gap-2">
                                    <Badge label={c.level} />
                                    <h3 className="font-['Inter'] font-bold text-[#140759] text-sm leading-snug">{c.title}</h3>
                                    <p className="text-xs text-[#808896]">{c.authorName} · {c.authorRole}</p>

                                    {/* Horaires + places */}
                                    <div className="flex items-center gap-3 text-xs text-[#4b5563] bg-[#f9fafb] rounded-xl px-3 py-2">
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#01509d]" /> {c.horaire}</span>
                                        <span className="text-[#e5e7eb]">|</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5 text-[#01509d]" />
                                            <span className={c.places <= 5 ? "text-orange-500 font-semibold" : ""}>{c.places} place{c.places > 1 ? "s" : ""} restante{c.places > 1 ? "s" : ""}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                        <span className="font-['Poppins'] font-bold text-[#140759] text-lg">{c.price}€</span>
                                        <div className="flex items-center gap-2">
                                            <Link href={c.href} className="h-8 px-3 border border-[#e5e7eb] text-[#140759] text-xs font-semibold rounded-xl hover:border-[#01509d] hover:text-[#01509d] transition-colors flex items-center">
                                                Détails
                                            </Link>
                                            <Link href={c.href} className="h-8 px-3 bg-[#01509d] hover:bg-[#014080] text-white text-xs font-bold rounded-xl flex items-center transition-colors">
                                                Réserver
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-[#808896]">Aucun cours trouvé.</div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination current={page} total={totalPages} onChange={setPage} />
                    </div>
                )}
            </main>
        </div>
    );
}
