"use client";

import Navbar from "../../../components/Navbar";
import PriceCard from "../../../components/PriceCard";
import TeacherCard from "../../../components/TeacherCard";
import CourseCard from "../../../components/CourseCard";
import Badge from "../../../components/ui/Badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Users, Star, Play, Lock } from "lucide-react";
import { useState } from "react";

const TOURNOI = {
  title: "Préparation aux tournois Régionaux",
  level: "Avancé",
  duration: "4h00",
  rating: 4.9,
  reviews: 43,
  price: 49,
  originalPrice: 69,
  maxParticipants: 10,
  description:
    "Préparez-vous sérieusement pour vos prochains Régionaux avec cette session intensive. Analyse du méta en cours, construction de votre liste finale, simulation de rondes et gestion du stress compétitif.",
  learningPoints: [
    "Comprendre le méta actuel des Régionaux",
    "Finaliser et optimiser votre liste de deck",
    "Simuler des rondes de tournoi réelles",
    "Gérer la pression et les décisions sous stress",
    "Adapter votre stratégie selon les matchups",
    "Préparer votre side deck et vos techs",
  ],
  prerequisites: [
    "Avoir un deck Tier 1 ou Tier 2 finalisé",
    "Avoir participé à au moins un tournoi local",
    "Connaître les règles avancées du JCC",
  ],
  modules: [
    { title: "Introduction et analyse du méta actuel",       duration: "30 min", locked: false },
    { title: "Révision des listes — feedback individuel",    duration: "50 min", locked: false },
    { title: "Simulation de rondes Swiss (3 rondes)",        duration: "75 min", locked: false },
    { title: "Debriefing et ajustements de listes",         duration: "35 min", locked: true },
    { title: "Stratégies mentales pour le jour J",          duration: "25 min", locked: true },
    { title: "Q&A et plan d'action final",                  duration: "25 min", locked: true },
  ],
  features: [
    "Replay de la session 30 jours",
    "Checklist pré-tournoi PDF",
    "Accès Discord groupe compétitif",
    "Suivi résultats post-tournoi",
  ],
  teacher: {
    name: "Thomas Mercier",
    verified: true,
    bio: "Multiple Top 8 aux Championnats Internationaux. Spécialiste de la préparation tournoi et de l'analyse méta. A accompagné plus de 50 joueurs en Régionaux.",
    tags: ["Top 8 Internationaux", "Prépa tournois", "Coach certifié"],
    coursesHref: "/apprendre",
  },
};

const SIMILAIRES = [
  { image: "/res/course2.png", date: "17 Fév 2024", level: "Intermédiaire", title: "Qualifier — Stratégies Juniors",           authorName: "Sarah K.",      authorRole: "Coach certifiée",   duration: "2h30", price: 29, href: "/progresser/tournois/2" },
  { image: "/res/course3.png", date: "24 Fév 2024", level: "Avancé",        title: "Live : Analyse méta Internationaux",       authorName: "Tonio",         authorRole: "Champion Régional", duration: "3h00", price: 39, href: "/progresser/tournois/3" },
  { image: "/res/course1.png", date: "2 Mar 2024",  level: "Débutant",      title: "Mon premier tournoi local",                authorName: "Prof. M. Dubois", authorRole: "Professeur validé", duration: "1h30", price: 19, href: "/progresser/tournois/4" },
];

export default function TournoiDetailPage({ params }: { params: { id: string } }) {
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar /> 

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
        <Link href="/progresser/tournois" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux tournois
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge label={TOURNOI.level} />
                <span className="flex items-center gap-1 text-xs text-[#808896]"><Clock className="w-3.5 h-3.5" /> {TOURNOI.duration}</span>
                <span className="flex items-center gap-1 text-xs text-[#808896]"><Users className="w-3.5 h-3.5" /> {TOURNOI.maxParticipants} max</span>
                <span className="flex items-center gap-1 text-xs text-[#808896]"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {TOURNOI.rating} ({TOURNOI.reviews} avis)</span>
              </div>
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] leading-snug">{TOURNOI.title}</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Description</h2>
              <p className="text-sm text-[#4b5563] leading-relaxed">{TOURNOI.description}</p>
            </div>

            <div className="bg-[#e3ecf8] rounded-2xl p-6">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Ce que vous allez apprendre</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {TOURNOI.learningPoints.map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#274c78]">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Prérequis</h2>
              <ul className="space-y-2">
                {TOURNOI.prerequisites.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#01509d] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#4b5563]">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
              <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Déroulement de la session</h2>
              <ul className="space-y-2">
                {TOURNOI.modules.map((mod, i) => (
                  <li
                    key={i}
                    onClick={() => !mod.locked && setOpenModule(openModule === i ? null : i)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm ${mod.locked ? "bg-gray-50 text-[#9ca3af]" : "bg-[#eef5fb] text-[#140759] cursor-pointer hover:bg-[#e3ecf8]"}`}
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

            <TeacherCard {...TOURNOI.teacher} />

            <div>
              <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-5">Sessions similaires</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {SIMILAIRES.map((s) => <CourseCard key={s.href} {...s} />)}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <PriceCard
              price={TOURNOI.price}
              originalPrice={TOURNOI.originalPrice}
              ctaLabel="Réserver ma place"
              securityNote={`${TOURNOI.maxParticipants} places max — paiement sécurisé`}
              features={TOURNOI.features}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
