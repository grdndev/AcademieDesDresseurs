"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import CourseCard from "../../components/CourseCard";
import Pagination from "../../components/ui/Pagination";
import { Search, ChevronDown } from "lucide-react";

const COURS = [
  { image: "/res/course1.png", date: "22 Jan 2024", level: "Avancé",        title: "Préparation tournoi régional",           authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "4h00", price: 49,  href: "/apprendre/1" },
  { image: "/res/course2.png", date: "15 Jan 2024", level: "Intermédiaire", title: "Maîtriser le deck Miraidon ex",          authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", price: 29,  href: "/apprendre/2" },
  { image: "/res/course3.png", date: "10 Jan 2024", level: "Débutant",      title: "Les bases du JCC Pokémon",               authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19,  href: "/apprendre/3" },
  { image: "/res/course1.png", date: "5 Jan 2024",  level: "Avancé",        title: "Analyse méta Régionaux de Lyon",         authorName: "Tonio",           authorRole: "Champion Régional", duration: "3h15", price: 39,  href: "/apprendre/4" },
  { image: "/res/course2.png", date: "1 Jan 2024",  level: "Intermédiaire", title: "Gestion des ressources en tournoi",      authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h00", price: 24,  href: "/apprendre/5" },
  { image: "/res/course3.png", date: "28 Déc 2023", level: "Débutant",      title: "Construire son premier deck compétitif", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h45", price: 19,  href: "/apprendre/6" },
  { image: "/res/course1.png", date: "20 Déc 2023", level: "Avancé",        title: "Live coaching — Lugia VSTAR",            authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "2h00", price: 35,  href: "/apprendre/7" },
  { image: "/res/course2.png", date: "15 Déc 2023", level: "Intermédiaire", title: "Draft et Sealed : survivre au chaos",    authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "3h00", price: 29,  href: "/apprendre/8" },
  { image: "/res/course3.png", date: "10 Déc 2023", level: "Débutant",      title: "Économie et budget en TCG",              authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h00", price: 15,  href: "/apprendre/9" },
];

const LEVELS = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PER_PAGE = 6;

export default function CoursPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel]   = useState("Tous les niveaux");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COURS.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q);
      const matchLevel  = level === "Tous les niveaux" || c.level === level;
      return matchSearch && matchLevel;
    });
  }, [search, level]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleFilter(val: string) { setLevel(val); setPage(1); }
  function handleSearch(val: string) { setSearch(val); setPage(1); }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar /> 

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

        {/* Barre recherche + filtres */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-10 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un cours ou un guide..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]"
            />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={level}
              onChange={(e) => handleFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none"
            >
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
          </div>
        </div>

        {/* Grille */}
        {paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginated.map((c) => <CourseCard key={c.href} {...c} />)}
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
