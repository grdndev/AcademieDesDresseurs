"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import GuideCard from "../components/GuideCard";
import Link from "next/link";
import { ArrowRight, Search, ChevronDown } from "lucide-react";

const COURS_A_VENIR = [
  { image: "/res/course1.png", isLive: true, date: "15 Fév 2024", level: "Avancé",        title: "Analyse méta Championnats Régionaux",   authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h30", price: 44, href: "/apprendre/7" },
  { image: "/res/course2.png",              date: "20 Fév 2024", level: "Intermédiaire", title: "Deck Building : Lugia VSTAR",           authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h00", price: 29, href: "/apprendre/8" },
  { image: "/res/course3.png",              date: "1 Mar 2024",  level: "Débutant",      title: "Introduction aux formats de tournoi",  authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19, href: "/apprendre/9" },
];

const COURS_A_REVOIR = [
  { image: "/res/course1.png", date: "5 Jan 2024",  level: "Avancé",        title: "Analyse méta Régionaux de Lyon",         authorName: "Tonio",           authorRole: "Champion Régional", duration: "3h15", price: 39, href: "/apprendre/4" },
  { image: "/res/course2.png", date: "1 Jan 2024",  level: "Intermédiaire", title: "Gestion des ressources en tournoi",      authorName: "Sarah K.",        authorRole: "Coach certifiée",   duration: "2h00", price: 24, href: "/apprendre/5" },
  { image: "/res/course3.png", date: "28 Déc 2023", level: "Débutant",      title: "Construire son premier deck compétitif", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h45", price: 19, href: "/apprendre/6" },
];

const GUIDES = [
  { gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",  description: "Apprenez les bases et commencez votre aventure compétitive.", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "2h",   rating: 4.8, views: 234, price: 29, href: "/apprendre/guides/guide-1" },
  { gradientIndex: 1, level: "Avancé",        title: "Psychologie du Joueur Compétitif", description: "Maîtrisez l'aspect mental de la compétition.",                authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h",   rating: 4.9, views: 187, price: 59, href: "/apprendre/guides/guide-2" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",    description: "Optimisez chaque carte et chaque action.",                    authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", rating: 4.7, views: 142, price: 45, href: "/apprendre/guides/guide-3" },
];

const LEVELS    = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
const PROFS     = ["Tous", "Thomas Moreau", "Lucas Bernard", "Prof. M. Dubois", "Sarah K.", "Tonio"];
const FORMATS   = ["Tous", "Standard", "Expanded", "Live"];
const PRIX_OPTS = ["Tous", "< 20€", "20€ – 40€", "> 40€"];

const ALL_ITEMS = [
  ...COURS_A_VENIR.map(c => ({ ...c, kind: "cours" as const })),
  ...COURS_A_REVOIR.map(c => ({ ...c, kind: "cours" as const })),
  ...GUIDES.map(g => ({ ...g, kind: "guide" as const })),
];

function matchesPrix(price: number, opt: string) {
  if (opt === "Tous") return true;
  if (opt === "< 20€") return price < 20;
  if (opt === "20€ – 40€") return price >= 20 && price <= 40;
  return price > 40;
}

export default function ApprendrePage() {
  const [search, setSearch] = useState("");
  const [level,  setLevel]  = useState("Tous");
  const [prof,   setProf]   = useState("Tous");
  const [format, setFormat] = useState("Tous");
  const [prix,   setPrix]   = useState("Tous");

  const q = search.trim().toLowerCase();
  const isFiltering = q || level !== "Tous" || prof !== "Tous" || format !== "Tous" || prix !== "Tous";

  const filtered = isFiltering ? ALL_ITEMS.filter(item => {
    if (q && !item.title.toLowerCase().includes(q) && !item.authorName.toLowerCase().includes(q)) return false;
    if (level !== "Tous" && item.level !== level) return false;
    if (prof !== "Tous" && item.authorName !== prof) return false;
    if (!matchesPrix(item.price, prix)) return false;
    return true;
  }) : [];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />

      <main className="space-y-0">

        {/* Barre de recherche + filtres */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-3 flex items-center gap-3 mb-8 shadow-sm mx-6 lg:mx-[100px] mt-8 flex-wrap">
          <Search className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un cours, un guide…"
            className="flex-1 min-w-[160px] text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]" />
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Niveau",      opts: LEVELS,    val: level,  set: setLevel  },
              { label: "Professeur",  opts: PROFS,     val: prof,   set: setProf   },
              { label: "Format",      opts: FORMATS,   val: format, set: setFormat },
              { label: "Prix",        opts: PRIX_OPTS, val: prix,   set: setPrix   },
            ].map(({ label, opts, val, set }) => (
              <div key={label} className="relative">
                <select value={val} onChange={e => set(e.target.value)}
                  className="appearance-none h-8 pl-3 pr-7 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                  {opts.map(o => <option key={o} value={o}>{o === "Tous" ? label : o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#808896] pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Résultats filtrés */}
        {isFiltering && (
          <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
            {filtered.length === 0 ? (
              <p className="text-sm text-[#808896]">Aucun résultat.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item =>
                  item.kind === "guide"
                    ? <GuideCard key={item.href} {...(item as Parameters<typeof GuideCard>[0])} />
                    : <CourseCard key={item.href} {...(item as Parameters<typeof CourseCard>[0])} />
                )}
              </div>
            )}
          </section>
        )}

        {/* Sections normales */}
        {!isFiltering && (
          <>
            {/* Cours à venir */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-12">
              <div className="relative text-center mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Cours à venir</h2>
                <p className="text-sm text-[#808896] mt-1">Sessions live avec interaction en direct</p>
                <Link href="/apprendre/cours/venir" className="absolute right-0 top-0 flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURS_A_VENIR.map((c) => <CourseCard key={c.href} {...c} />)}
              </div>
            </section>

            {/* Cours à revoir */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
              <div className="relative text-center mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Cours à revoir</h2>
                <p className="text-sm text-[#808896] mt-1">Replays disponibles en accès illimité</p>
                <Link href="/apprendre/cours/revoir" className="absolute right-0 top-0 flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURS_A_REVOIR.map((c) => <CourseCard key={c.href} {...c} />)}
              </div>
            </section>

            {/* Guides stratégiques */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
              <div className="relative text-center mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Guides stratégiques</h2>
                <p className="text-sm text-[#808896] mt-1">Articles et ressources pour approfondir vos connaissances</p>
                <Link href="/apprendre/guides" className="absolute right-0 top-0 flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GUIDES.map((g) => <GuideCard key={g.href} {...g} />)}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
