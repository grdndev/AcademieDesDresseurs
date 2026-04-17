"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import CourseCard from "../../components/CourseCard";
import Pagination from "../../components/ui/Pagination";
import { Search, ChevronDown, Users, Clock, Trophy } from "lucide-react";

const FEATURED_TOURNOI = {
    title: "Préparation Championnat National",
    desc: "Programme intensif de 8 semaines pour aborder le Championnat National avec les meilleures stratégies, une préparation mentale solide et un deck optimisé.",
    image: "/res/course1.png",
    coach: "Alexandre Moreau",
    coachRole: "Coach Premium · Champion National 2023",
    coachAvatar: "/res/avatar1.png",
    inscrits: 71,
    places: 100,
    duration: "8 semaines",
    price: 200,
    href: "/progresser/tournois/featured",
};

const TOURNOIS = [
  { image: "/res/course1.png", isLive: false, date: "10 Fév 2024", level: "Avancé",        title: "Préparation Régionaux de Paris 2024",      authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "4h00", price: 49,  href: "/progresser/tournois/1" },
  { image: "/res/course2.png", isLive: false, date: "17 Fév 2024", level: "Intermédiaire", title: "Qualifier — Stratégies Juniors",            authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h30", price: 29,  href: "/progresser/tournois/2" },
  { image: "/res/course3.png", isLive: true,  date: "24 Fév 2024", level: "Avancé",        title: "Live : Analyse méta avant Internationaux",  authorName: "Tonio",           authorRole: "Champion Régional", duration: "3h00", price: 39,  href: "/progresser/tournois/3" },
  { image: "/res/course1.png", isLive: false, date: "2 Mar 2024",  level: "Débutant",      title: "Mon premier tournoi local — guide complet", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19,  href: "/progresser/tournois/4" },
  { image: "/res/course2.png", isLive: false, date: "9 Mar 2024",  level: "Avancé",        title: "Championnat Régional — prépa intensive",   authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "6h00", price: 79,  href: "/progresser/tournois/5" },
  { image: "/res/course3.png", isLive: false, date: "16 Mar 2024", level: "Intermédiaire", title: "Deck techs anti-méta pour Régionaux",      authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h00", price: 29,  href: "/progresser/tournois/6" },
];

const LEVELS = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PER_PAGE = 6;

export default function TournoisPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel]   = useState("Tous les niveaux");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TOURNOIS.filter((t) => {
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.authorName.toLowerCase().includes(q);
      const matchLevel  = level === "Tous les niveaux" || t.level === level;
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

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10 space-y-10">

        {/* ── Featured tournament ── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
              <div className="absolute top-3 left-3 z-10 bg-[#dbb42b] text-[#140759] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Programme phare
              </div>
              <Image src={FEATURED_TOURNOI.image} alt={FEATURED_TOURNOI.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-2">{FEATURED_TOURNOI.title}</h2>
                <p className="text-sm text-[#808896] leading-relaxed mb-4 max-w-xl">{FEATURED_TOURNOI.desc}</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image src={FEATURED_TOURNOI.coachAvatar} alt={FEATURED_TOURNOI.coach} width={32} height={32} className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#140759]">{FEATURED_TOURNOI.coach}</p>
                    <p className="text-[10px] text-[#808896]">{FEATURED_TOURNOI.coachRole}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#808896]">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {FEATURED_TOURNOI.inscrits}/{FEATURED_TOURNOI.places} inscrits</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {FEATURED_TOURNOI.duration}</span>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                      <div className="h-full bg-[#01509d] rounded-full" style={{ width: `${(FEATURED_TOURNOI.inscrits / FEATURED_TOURNOI.places) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#01509d]">{Math.round((FEATURED_TOURNOI.inscrits / FEATURED_TOURNOI.places) * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
                <p className="font-['Poppins'] font-bold text-2xl text-[#140759]">
                  {FEATURED_TOURNOI.price}€ <span className="text-sm font-normal text-[#808896]">/ programme</span>
                </p>
                <Link href={FEATURED_TOURNOI.href}
                  className="h-9 px-5 bg-[#dbb42b] hover:bg-[#c9a020] text-[#140759] font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center">
                  S&apos;inscrire au programme
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search / Filter ── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher une préparation tournoi..."
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

        {paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((t) => <CourseCard key={t.href} {...t} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-[#808896]">Aucune préparation trouvée.</div>
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
