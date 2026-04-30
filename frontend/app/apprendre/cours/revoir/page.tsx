"use client";

import { useMemo, useState } from "react";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import Pagination from "../../../components/ui/Pagination";
import Badge from "../../../components/ui/Badge";
import { Clock, ChevronDown, Search, Users, Calendar, Play } from "lucide-react";

const COURS = [
    { image: "/res/course1.png", date: "5 Jan 2024",  level: "Avancé",        title: "Analyse méta Régionaux de Lyon",         authorName: "Tonio",           authorRole: "Champion Régional", duration: "3h15", price: 39, href: "/apprendre/r1", owned: true },
    { image: "/res/course2.png", date: "1 Jan 2024",  level: "Intermédiaire", title: "Gestion des ressources en tournoi",      authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h00", price: 24, href: "/apprendre/r2", owned: false },
    { image: "/res/course3.png", date: "28 Déc 2023", level: "Débutant",      title: "Construire son premier deck compétitif", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h45", price: 19, href: "/apprendre/r3", owned: true },
    { image: "/res/course1.png", date: "20 Déc 2023", level: "Avancé",        title: "Construire son premier deck compétitif", authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "3h15", price: 35, href: "/apprendre/r4", owned: false },
    { image: "/res/course2.png", date: "15 Déc 2023", level: "Débutant",      title: "Analyse méta et sideboard efficace",     authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "2h00", price: 30, href: "/apprendre/r5", owned: false },
    { image: "/res/course3.png", date: "10 Déc 2023", level: "Intermédiaire", title: "Préparation aux tournois régionaux",     authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "1h45", price: 30, href: "/apprendre/r6", owned: true },
];

const LEVELS    = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
const PROFS     = ["Tous", "Thomas Moreau", "Lucas Bernard", "Prof. M. Dubois", "Sarah K.", "Tonio"];
const FORMATS   = ["Tous", "Standard", "Expanded"];
const PRIX_OPTS = ["Tous", "< 25€", "25€ – 35€", "> 35€"];
const SORTS     = ["Les plus récents", "Prix croissant", "Prix décroissant"];
const PER_PAGE  = 6;

function matchesPrix(price: number, opt: string) {
    if (opt === "Tous") return true;
    if (opt === "< 25€") return price < 25;
    if (opt === "25€ – 35€") return price >= 25 && price <= 35;
    return price > 35;
}

export default function CoursARevoirPage() {
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
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm px-5 py-3 flex items-center gap-3 mb-8 flex-wrap">
                    <Search className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
                    <input type="text" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                        placeholder="Rechercher un cours ou un professeur…"
                        className="flex-1 min-w-[160px] text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]" />
                    <div className="flex items-center gap-2 flex-wrap">
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
                        <div className="relative">
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
                                    <span className="absolute top-3 right-3 z-10 bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {c.date}
                                    </span>
                                    {c.owned && (
                                        <span className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <Play className="w-3 h-3" /> Acheté
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1 gap-2">
                                    <Badge label={c.level} />
                                    <h3 className="font-['Inter'] font-bold text-[#140759] text-sm leading-snug">{c.title}</h3>
                                    <p className="text-xs text-[#808896]">{c.authorName} · {c.authorRole}</p>

                                    <div className="flex items-center gap-1 text-xs text-[#808896]">
                                        <Clock className="w-3.5 h-3.5" /> {c.duration}
                                    </div>

                                    <div className="flex items-stretch gap-2 mt-auto pt-2 border-t border-gray-50">
                                        <span className="font-['Poppins'] font-bold text-[#140759] text-lg flex items-center mr-auto">{c.price}€</span>
                                        {c.owned ? (
                                            <Link href={c.href}
                                                className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                                                <Play className="w-3.5 h-3.5" /> Voir le cours
                                            </Link>
                                        ) : (
                                            <Link href={c.href}
                                                className="flex-1 h-10 bg-[#01509d] hover:bg-[#014080] text-white text-xs font-bold rounded-xl flex items-center justify-center transition-colors">
                                                Acheter l&apos;accès
                                            </Link>
                                        )}
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
