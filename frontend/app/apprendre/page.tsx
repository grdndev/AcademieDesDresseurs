"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import GuideCard from "../components/GuideCard";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, FileText, Users, Search } from "lucide-react";

const COURS_A_SUIVRE = [
  { image: "/res/course1.png", isLive: true, date: "22 Jan 2024", level: "Avancé",        title: "Préparation tournoi régional",        authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "4h00", price: 49, href: "/apprendre/1" },
  { image: "/res/course2.png",              date: "28 Jan 2024", level: "Intermédiaire", title: "Maîtriser le deck Miraidon ex",       authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", price: 29, href: "/apprendre/2" },
  { image: "/res/course3.png",              date: "3 Fév 2024",  level: "Débutant",      title: "Les bases du JCC Pokémon",            authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19, href: "/apprendre/3" },
];

const COURS_A_VENIR = [
  { image: "/res/course1.png", date: "15 Fév 2024", level: "Avancé",        title: "Analyse méta Championnats Régionaux",   authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h30", price: 44, href: "/apprendre/7" },
  { image: "/res/course2.png", date: "20 Fév 2024", level: "Intermédiaire", title: "Deck Building : Lugia VSTAR",           authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h00", price: 29, href: "/apprendre/8" },
  { image: "/res/course3.png", date: "1 Mar 2024",  level: "Débutant",      title: "Introduction aux formats de tournoi",  authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19, href: "/apprendre/9" },
];

const COURS_A_REVOIR = [
  { image: "/res/course1.png", date: "5 Jan 2024",  level: "Avancé",        title: "Analyse méta Régionaux de Lyon",        authorName: "Tonio",         authorRole: "Champion Régional", duration: "3h15", price: 39, href: "/apprendre/4" },
  { image: "/res/course2.png", date: "1 Jan 2024",  level: "Intermédiaire", title: "Gestion des ressources en tournoi",     authorName: "Sarah K.",      authorRole: "Coach certifiée",   duration: "2h00", price: 24, href: "/apprendre/5" },
  { image: "/res/course3.png", date: "28 Déc 2023", level: "Débutant",      title: "Construire son premier deck compétitif", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h45", price: 19, href: "/apprendre/6" },
];

const GUIDES = [
  { gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",  description: "Apprenez les bases et commencez votre aventure compétitive.", authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "2h",   rating: 4.8, views: 234, price: 29, href: "/apprendre/guide-1" },
  { gradientIndex: 1, level: "Avancé",        title: "Psychologie du Joueur Compétitif", description: "Maîtrisez l'aspect mental de la compétition.",                authorName: "Thomas Moreau",   authorRole: "Coach compétitif",  duration: "3h",   rating: 4.9, views: 187, price: 59, href: "/apprendre/guide-2" },
  { gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",    description: "Optimisez chaque carte et chaque action.",                    authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", rating: 4.7, views: 142, price: 45, href: "/apprendre/guide-3" },
];

const ACCOMPAGNEMENT = [
  { icon: Video,     title: "Cours en live",          desc: "Sessions interactives en direct avec les meilleurs coaches. Posez vos questions en temps réel." },
  { icon: FileText,  title: "Guides stratégiques",    desc: "Analyses approfondies des decks, métas et stratégies rédigées par nos experts." },
  { icon: BookOpen,  title: "Replays disponibles",    desc: "Accédez à toutes les sessions passées. Révisez à votre rythme, autant de fois que vous voulez." },
];

const PROFESSEURS = [
  { name: "Thomas Moreau",   role: "Coach compétitif",  avatar: "/res/avatar1.png", courses: 12, rating: 4.9 },
  { name: "Prof. M. Dubois", role: "Professeur validé", avatar: "/res/avatar2.png", courses: 8,  rating: 4.8 },
  { name: "Lucas Bernard",   role: "Joueur Top 16",     avatar: "/res/avatar3.png", courses: 6,  rating: 4.7 },
  { name: "Sarah K.",        role: "Coach certifiée",   avatar: "/res/avatar1.png", courses: 9,  rating: 4.8 },
];

export default function ApprendrePage() {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const matchesCourse = (c: { title: string; authorName: string }) =>
    c.title.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q);
  const matchesGuide = (g: { title: string; authorName: string }) =>
    g.title.toLowerCase().includes(q) || g.authorName.toLowerCase().includes(q);

  const filteredCours = q
    ? [...COURS_A_SUIVRE, ...COURS_A_VENIR, ...COURS_A_REVOIR].filter(matchesCourse)
    : [];
  const filteredGuides = q ? GUIDES.filter(matchesGuide) : [];
  const hasResults = filteredCours.length > 0 || filteredGuides.length > 0;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />

      <main className="space-y-0">

        {/* Barre de recherche */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex items-center gap-4 mb-8 shadow-sm mx-6 lg:mx-[100px] mt-8">
          <Search className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un cours, un guide…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]" />
        </div>

        {/* Résultats de recherche */}
        {q && (
          <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
            {!hasResults ? (
              <p className="text-sm text-[#808896]">Aucun résultat pour « {search} ».</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCours.map((c) => <CourseCard key={c.href} {...c} />)}
                {filteredGuides.map((g) => <GuideCard key={g.href} {...g} />)}
              </div>
            )}
          </section>
        )}

        {/* Sections normales (masquées quand recherche active) */}
        {!q && (
          <>
            {/* Cours à suivre */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Cours à suivre</h2>
                <Link href="/progresser/ateliers" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURS_A_SUIVRE.map((c) => <CourseCard key={c.href} {...c} />)}
              </div>
            </section>

            {/* Cours à venir */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Cours à venir</h2>
                <Link href="/apprendre/cours/venir" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURS_A_VENIR.map((c) => <CourseCard key={c.href} {...c} />)}
              </div>
            </section>

            {/* Cours à revoir */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Cours à revoir</h2>
                <Link href="/apprendre/cours/revoir" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURS_A_REVOIR.map((c) => <CourseCard key={c.href} {...c} />)}
              </div>
            </section>

            {/* Un accompagnement structuré */}
            <section className="bg-[#01509d] py-16">
              <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-8">Un accompagnement structuré</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {ACCOMPAGNEMENT.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-['Inter'] font-bold text-white mb-2">{title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Guides stratégiques */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Guides stratégiques</h2>
                <Link href="/apprendre/guides" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                  Voir tous <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GUIDES.map((g) => <GuideCard key={g.href} {...g} />)}
              </div>
            </section>

            {/* Des professeurs validés */}
            <section className="bg-[#e3ecf8] py-16">
              <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Des professeurs validés par l&apos;Académie</h2>
                    <p className="text-sm text-[#808896] mt-1">Chaque formateur est certifié et suivi par notre équipe.</p>
                  </div>
                  <Link href="/professeur" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                    Devenir professeur <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {PROFESSEURS.map((p) => (
                    <div key={p.name} className="bg-white rounded-2xl p-5 border border-[#e5e7eb] text-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden">
                        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-['Inter'] font-bold text-sm text-[#140759]">{p.name}</p>
                      <p className="text-xs text-[#808896] mb-2">{p.role}</p>
                      <div className="flex items-center justify-center gap-3 text-xs text-[#808896]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {p.courses} cours
                        </span>
                        <span className="text-yellow-500 font-bold">★ {p.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
