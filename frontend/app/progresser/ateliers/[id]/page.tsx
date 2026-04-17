"use client";

import Navbar from "../../../components/Navbar";
import PriceCard from "../../../components/PriceCard";
import TeacherCard from "../../../components/TeacherCard";
import CourseCard from "../../../components/CourseCard";
import Badge from "../../../components/ui/Badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Users, Star, Play, Lock } from "lucide-react";
import { useState } from "react";

const ATELIER = {
  title: "Atelier Force Building Compétitif",
  level: "Avancé",
  duration: "4h00",
  rating: 4.9,
  reviews: 56,
  price: 49,
  originalPrice: 69,
  maxParticipants: 12,
  description:
    "Un atelier intensif en groupe pour maîtriser la construction de decks compétitifs. Analyse des meilleures listes du méta, travail sur les ratios de cartes et simulation de décisions en tournoi.",
  learningPoints: [
    "Analyser et comprendre les listes Tier 1",
    "Optimiser les ratios de cartes dans un deck",
    "Choisir les bonnes techs anti-méta",
    "Simuler des situations de tournoi en groupe",
    "Recevoir du feedback personnalisé sur votre liste",
    "Comprendre les wincons et lignes secondaires",
  ],
  prerequisites: [
    "Avoir un deck compétitif ou en cours de construction",
    "Connaître les règles avancées du JCC",
    "Avoir participé à au moins un tournoi local",
  ],
  modules: [
    { title: "Présentation des participants et objectifs",  duration: "20 min", locked: false },
    { title: "Analyse collective des listes Tier 1",        duration: "50 min", locked: false },
    { title: "Travail sur les ratios — exercices pratiques", duration: "60 min", locked: false },
    { title: "Simulation de matchups en groupe",            duration: "50 min", locked: true },
    { title: "Feedback individuel sur votre liste",         duration: "40 min", locked: true },
    { title: "Conclusion et plan d'action",                 duration: "20 min", locked: true },
  ],
  features: [
    "Replay de l'atelier 30 jours",
    "Liste de ressources PDF",
    "Accès groupe Discord privé",
    "Suivi post-atelier 1 semaine",
  ],
  teacher: {
    name: "Thomas Mercier",
    verified: true,
    bio: "Multiple Top 8 aux Championnats Internationaux. Spécialisé dans l'analyse méta et la construction de decks innovants. 150+ élèves formés.",
    tags: ["Top 8 Internationaux", "150+ élèves formés", "Coach certifié"],
    coursesHref: "/apprendre",
  },
};

const SIMILAIRES = [
  { image: "/res/course2.png", date: "28 Jan 2024", level: "Intermédiaire", title: "Maîtriser le deck Miraidon ex",     authorName: "Lucas Bernard",   authorRole: "Joueur Top 16",     duration: "2h30", price: 29, href: "/progresser/ateliers/2" },
  { image: "/res/course3.png", date: "3 Fév 2024",  level: "Débutant",      title: "Les bases du JCC Pokémon",          authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19, href: "/progresser/ateliers/3" },
  { image: "/res/course1.png", date: "10 Fév 2024", level: "Avancé",        title: "Analyse méta Régionaux de Lyon",    authorName: "Tonio",           authorRole: "Champion Régional", duration: "3h15", price: 39, href: "/progresser/ateliers/4" },
];

export default function AtelierDetailPage({ params }: { params: { id: string } }) {
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar /> 

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
        <Link href="/progresser/ateliers" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux ateliers
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Colonne principale ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Titre + meta */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge label={ATELIER.level} />
                <span className="flex items-center gap-1 text-xs text-[#808896]">
                  <Clock className="w-3.5 h-3.5" /> {ATELIER.duration}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#808896]">
                  <Users className="w-3.5 h-3.5" /> {ATELIER.maxParticipants} participants max
                </span>
                <span className="flex items-center gap-1 text-xs text-[#808896]">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {ATELIER.rating} ({ATELIER.reviews} avis)
                </span>
              </div>
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] leading-snug">
                {ATELIER.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Description de l'atelier</h2>
              <p className="text-sm text-[#4b5563] leading-relaxed">{ATELIER.description}</p>
            </div>

            {/* Ce que vous allez apprendre */}
            <div className="bg-[#e3ecf8] rounded-2xl p-6">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Ce que vous allez apprendre</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {ATELIER.learningPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#274c78]">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prérequis */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Ce qu'il te faut avant cet atelier ?</h2>
              <ul className="space-y-2">
                {ATELIER.prerequisites.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#01509d] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#4b5563]">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Déroulement */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Déroulement de la session</h2>
              <ul className="space-y-2">
                {ATELIER.modules.map((mod, i) => (
                  <li
                    key={i}
                    onClick={() => !mod.locked && setOpenModule(openModule === i ? null : i)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm ${
                      mod.locked ? "bg-gray-50 text-[#9ca3af]" : "bg-[#eef5fb] text-[#140759] cursor-pointer hover:bg-[#e3ecf8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {mod.locked ? <Lock className="w-4 h-4 flex-shrink-0" /> : <Play className="w-4 h-4 text-[#01509d] flex-shrink-0" />}
                      <span className={mod.locked ? "" : "font-medium"}>{mod.title}</span>
                    </div>
                    <span className="text-xs text-[#808896] flex-shrink-0">{mod.duration}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professeur */}
            <TeacherCard {...ATELIER.teacher} />

            {/* Ateliers similaires */}
            <div>
              <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-5">Ateliers similaires</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {SIMILAIRES.map((a) => <CourseCard key={a.href} {...a} />)}
              </div>
            </div>
          </div>

          {/* ── Sidebar sticky ── */}
          <div className="lg:sticky lg:top-6 h-fit">
            <PriceCard
              price={ATELIER.price}
              originalPrice={ATELIER.originalPrice}
              ctaLabel="Réserver ma place"
              securityNote={`${ATELIER.maxParticipants} places maximum — paiement sécurisé`}
              features={ATELIER.features}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
