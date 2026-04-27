"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import { Search, ChevronDown, Clock, Star, BookOpen } from "lucide-react";

const GUIDES = [
  { gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",       description: "Apprenez les bases et commencez votre aventure compétitive.",              authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "2h",    rating: 4.8, views: 234, price: 29,  owned: true,  href: "/apprendre/guide-1" },
  { gradientIndex: 1, level: "Avancé",        title: "Psychologie du Joueur Compétitif",       description: "Maîtrisez l'aspect mental de la compétition.",                            authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h",    rating: 4.9, views: 187, price: 59,  owned: false, href: "/apprendre/guide-2" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",          description: "Optimisez chaque carte et chaque action.",                                authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30",  rating: 4.7, views: 142, price: 45,  owned: false, href: "/apprendre/guide-3" },
  { gradientIndex: 3, level: "Débutant",      title: "Stratégies de base pour débuter",        description: "Apprenez les fondamentaux du TCG Pokémon et construisez votre premier deck.", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "45min", rating: 4.8, views: 198, price: 29,  owned: true,  href: "/apprendre/guide-4" },
  { gradientIndex: 1, level: "Avancé",        title: "Analyse des decks Tier 1",               description: "Décryptez les meilleures listes et leurs lignes de jeu.",                 authorName: "Tonio",           authorRole: "Champion Régional", duration: "4h",    rating: 4.9, views: 312, price: 69,  owned: false, href: "/apprendre/guide-5" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Comprendre les matchups",                description: "Apprenez à adapter votre jeu en fonction de l'adversaire.",               authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h",    rating: 4.6, views: 98,  price: 39,  owned: false, href: "/apprendre/guide-6" },
  { gradientIndex: 0, level: "Débutant",      title: "Introduction aux tournois locaux",       description: "Tout ce qu'il faut savoir avant votre premier tournoi.",                   authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30",  rating: 4.7, views: 156, price: 25,  owned: true,  href: "/apprendre/guide-7" },
  { gradientIndex: 3, level: "Avancé",        title: "Draft et Limited : maîtriser le chaos",  description: "Les clés pour exceller dans les formats non-construits.",                  authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "3h30",  rating: 4.8, views: 89,  price: 55,  owned: false, href: "/apprendre/guide-8" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Économie du deck building",              description: "Construire un deck compétitif sans exploser son budget.",                  authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "1h45",  rating: 4.5, views: 203, price: 35,  owned: false, href: "/apprendre/guide-9" },
];

const GRADIENTS = [
    "from-pink-400 to-purple-500",
    "from-orange-400 to-red-500",
    "from-green-400 to-teal-500",
    "from-blue-400 to-indigo-500",
];

const LEVELS    = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PROFS     = ["Tous", "Thomas Moreau", "Lucas Bernard", "Prof. M. Dubois", "Sarah K.", "Tonio"];
const PRIX_OPTS = ["Tous", "< 30€", "30€ – 50€", "> 50€"];
const PER_PAGE  = 6;

function matchesPrix(price: number, opt: string) {
    if (opt === "Tous") return true;
    if (opt === "< 30€") return price < 30;
    if (opt === "30€ – 50€") return price >= 30 && price <= 50;
    return price > 50;
}

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [level,  setLevel]  = useState("Tous les niveaux");
  const [prof,   setProf]   = useState("Tous");
  const [prix,   setPrix]   = useState("Tous");
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GUIDES.filter((g) => {
      if (q && !g.title.toLowerCase().includes(q) && !g.authorName.toLowerCase().includes(q)) return false;
      if (level !== "Tous les niveaux" && g.level !== level) return false;
      if (prof !== "Tous" && g.authorName !== prof) return false;
      if (!matchesPrix(g.price, prix)) return false;
      return true;
    });
  }, [search, level, prof, prix]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function resetPage() { setPage(1); }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col gap-3 mb-10 shadow-sm">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
              placeholder="Rechercher un guide ou un auteur…"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Niveau",     opts: LEVELS,    val: level, set: setLevel, allLabel: "Tous les niveaux" },
              { label: "Professeur", opts: PROFS,     val: prof,  set: setProf,  allLabel: "Tous" },
              { label: "Prix",       opts: PRIX_OPTS, val: prix,  set: setPrix,  allLabel: "Tous" },
            ].map(({ label, opts, val, set, allLabel }) => (
              <div key={label} className="relative">
                <select value={val} onChange={e => { set(e.target.value); resetPage(); }}
                  className="appearance-none h-8 pl-3 pr-7 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                  {opts.map(o => <option key={o} value={o}>{o === allLabel ? label : o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#808896] pointer-events-none" />
              </div>
            ))}
            <span className="ml-auto text-xs text-[#808896]">{filtered.length} guides</span>
          </div>
        </div>

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginated.map((g) => (
              <div key={g.href} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className={`h-36 bg-gradient-to-br ${GRADIENTS[g.gradientIndex % GRADIENTS.length]}`} />
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <Badge label={g.level} />
                  <h3 className="font-['Inter'] font-bold text-[#140759] text-sm leading-snug">{g.title}</h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">{g.description}</p>
                  <p className="text-xs text-[#808896]">{g.authorName} · {g.authorRole}</p>

                  <div className="flex items-center gap-3 text-xs text-[#808896]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{g.rating} · {g.views} vues</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{g.duration}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                    <span className="font-['Poppins'] font-bold text-[#140759] text-lg mr-auto">{g.price}€</span>
                    {g.owned ? (
                      <Link href={g.href}
                        className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                        <BookOpen className="w-3.5 h-3.5" /> Lire le guide
                      </Link>
                    ) : (
                      <Link href={g.href}
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
