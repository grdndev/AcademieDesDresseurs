"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CourseCard from "../../components/CourseCard";
import Pagination from "../../components/ui/Pagination";
import { Search, ChevronDown } from "lucide-react";
import { apiGet } from "../../lib/apiClient";

type Cours = { id: string; image: string; date: string; level: string; title: string; authorName: string; authorRole: string; duration: string; price: number; href: string; };

const LEVELS = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PER_PAGE = 6;

export default function CoursPage() {
  const [cours, setCours]     = useState<Cours[]>([]);
  const [search, setSearch]   = useState("");
  const [level, setLevel]     = useState("Tous les niveaux");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    apiGet<Cours[]>("/courses?format=LIVE").then(setCours).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cours.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q);
      const matchLevel  = level === "Tous les niveaux" || c.level === level;
      return matchSearch && matchLevel;
    });
  }, [cours, search, level]);

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
            {paginated.map(({ id, ...props }) => <CourseCard key={id} {...props} />)}
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
