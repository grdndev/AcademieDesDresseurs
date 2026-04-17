"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import GuideCard from "../../components/GuideCard";
import Pagination from "../../components/ui/Pagination";
import { Search, ChevronDown } from "lucide-react";

const GUIDES = [
  { gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",       description: "Apprenez les bases et commencez votre aventure compétitive.",              authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "2h",    rating: 4.8, views: 234, price: 29, href: "/apprendre/guide-1" },
  { gradientIndex: 1, level: "Avancé",        title: "Psychologie du Joueur Compétitif",       description: "Maîtrisez l'aspect mental de la compétition.",                            authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h",    rating: 4.9, views: 187, price: 59, href: "/apprendre/guide-2" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",          description: "Optimisez chaque carte et chaque action.",                                authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30",  rating: 4.7, views: 142, price: 45, href: "/apprendre/guide-3" },
  { gradientIndex: 3, level: "Débutant",      title: "Stratégies de base pour débuter",        description: "Apprenez les fondamentaux du TCG Pokémon et construisez votre premier deck.", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "45min", rating: 4.8, views: 198, price: 29, href: "/apprendre/guide-4" },
  { gradientIndex: 1, level: "Avancé",        title: "Analyse des decks Tier 1",               description: "Décryptez les meilleures listes et leurs lignes de jeu.",                 authorName: "Tonio",           authorRole: "Champion Régional", duration: "4h",    rating: 4.9, views: 312, price: 69, href: "/apprendre/guide-5" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Comprendre les matchups",                description: "Apprenez à adapter votre jeu en fonction de l'adversaire.",               authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h",    rating: 4.6, views: 98,  price: 39, href: "/apprendre/guide-6" },
  { gradientIndex: 0, level: "Débutant",      title: "Introduction aux tournois locaux",       description: "Tout ce qu'il faut savoir avant votre premier tournoi.",                   authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30",  rating: 4.7, views: 156, price: 25, href: "/apprendre/guide-7" },
  { gradientIndex: 3, level: "Avancé",        title: "Draft et Limited : maîtriser le chaos",  description: "Les clés pour exceller dans les formats non-construits.",                  authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "3h30",  rating: 4.8, views: 89,  price: 55, href: "/apprendre/guide-8" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Économie du deck building",              description: "Construire un deck compétitif sans exploser son budget.",                  authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "1h45",  rating: 4.5, views: 203, price: 35, href: "/apprendre/guide-9" },
];

const LEVELS = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PER_PAGE = 6;

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel]   = useState("Tous les niveaux");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GUIDES.filter((g) => {
      const matchSearch = !q || g.title.toLowerCase().includes(q) || g.authorName.toLowerCase().includes(q);
      const matchLevel  = level === "Tous les niveaux" || g.level === level;
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
              placeholder="Rechercher un guide..."
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
            {paginated.map((g) => <GuideCard key={g.href} {...g} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-[#808896]">Aucun guide trouvé.</div>
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
