"use client";

import { useMemo, useState } from "react";
import Navbar from "../../../components/Navbar";
import CourseCard from "../../../components/CourseCard";
import Pagination from "../../../components/ui/Pagination";
import { ChevronDown } from "lucide-react";

const COURS = [
    { image: "/res/course1.png", date: "5 Jan 2024",  level: "Avancé",        title: "Stratégies de base pour débutant",       authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "4h00", price: 49, href: "/apprendre/r1" },
    { image: "/res/course2.png", date: "1 Jan 2024",  level: "Avancé",        title: "Méta game et deck building avancé",      authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", price: 40, href: "/apprendre/r2" },
    { image: "/res/course3.png", date: "28 Déc 2023", level: "Intermédiaire", title: "Gestion de ressources et temps",         authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 39, href: "/apprendre/r3" },
    { image: "/res/course1.png", date: "20 Déc 2023", level: "Avancé",        title: "Construire son premier deck compétitif", authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "3h15", price: 35, href: "/apprendre/r4" },
    { image: "/res/course2.png", date: "15 Déc 2023", level: "Débutant",      title: "Analyse méta et sideboard efficace",     authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "2h00", price: 30, href: "/apprendre/r5" },
    { image: "/res/course3.png", date: "10 Déc 2023", level: "Intermédiaire", title: "Préparation aux tournois régionaux",     authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "1h45", price: 30, href: "/apprendre/r6" },
];

const LEVELS = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
const SORTS  = ["Les plus récents", "Prix croissant", "Prix décroissant"];
const PER_PAGE = 6;

export default function CoursARevoirPage() {
    const [level,  setLevel]  = useState("Tous");
    const [sort,   setSort]   = useState(SORTS[0]);
    const [page,   setPage]   = useState(1);

    const filtered = useMemo(() => {
        let list = level === "Tous" ? COURS : COURS.filter(c => c.level === level);
        if (sort === "Prix croissant")   list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "Prix décroissant") list = [...list].sort((a, b) => b.price - a.price);
        return list;
    }, [level, sort]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    function handleLevel(val: string) { setLevel(val); setPage(1); }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-8">

                {/* Filters bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <p className="text-sm text-[#808896]">
                        <span className="font-bold text-[#140759]">{filtered.length}</span> cours disponibles
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Level pills */}
                        <div className="flex items-center gap-2">
                            {LEVELS.map(l => (
                                <button key={l} onClick={() => handleLevel(l)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${level === l ? "bg-[#01509d] text-white" : "bg-white border border-[#e5e7eb] text-[#808896] hover:border-[#01509d] hover:text-[#01509d]"}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        {/* Sort */}
                        <div className="relative">
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                className="appearance-none pl-4 pr-8 py-2 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                                {SORTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#808896] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {paginated.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {paginated.map(c => <CourseCard key={c.href} {...c} />)}
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
