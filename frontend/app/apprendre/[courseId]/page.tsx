"use client";

import Navbar from "../../components/Navbar";
import PriceCard from "../../components/PriceCard";
import TeacherCard from "../../components/TeacherCard";
import GuideCard from "../../components/GuideCard";
import Badge from "../../components/ui/Badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Users, Star, ChevronDown, ChevronUp, Play, Lock } from "lucide-react";
import { useState } from "react";

// Données statiques — à remplacer par un fetch quand l'API est prête
const COURSE = {
    id: "1",
    title: "Maîtriser le Méta Compétitif : Stratégies Avancées pour Tournois",
    level: "Avancé",
    duration: "4h00",
    rating: 4.8,
    reviews: 124,
    price: 49,
    originalPrice: 69,
    description:
        "Plongez au cœur du méta compétitif Pokémon TCG avec ce cours intensif conçu pour les joueurs souhaitant performer en tournoi. Nous analyserons les decks dominants, les lignes de jeu complexes et les décisions sous pression qui font la différence entre un joueur ordinaire et un champion.",
    learningPoints: [
        "Analyser le méta actuel et anticiper les évolutions",
        "Construire et adapter un deck en fonction du méta",
        "Gérer son clock et ses ressources en fin de partie",
        "Lire les mains adverses et adapter sa stratégie",
        "Préparer mentalement un tournoi régional",
        "Maîtriser les matchups défavorables",
    ],
    prerequisites: [
        "Connaître les règles de base du JCC Pokémon",
        "Avoir participé à au moins un tournoi local",
        "Posséder un deck compétitif ou en cours de construction",
    ],
    modules: [
        { title: "Introduction et état du méta",          duration: "25 min", locked: false },
        { title: "Les decks Tier 1 — analyse complète",   duration: "45 min", locked: false },
        { title: "Construction et adaptation de deck",    duration: "50 min", locked: false },
        { title: "Gestion du clock et des ressources",    duration: "40 min", locked: true },
        { title: "Lecture de mains et bluff",             duration: "35 min", locked: true },
        { title: "Préparation mentale tournoi",           duration: "25 min", locked: true },
    ],
    features: [
        "Replay disponible 30 jours",
        "Support PDF inclus",
        "Certificat de participation",
        "Groupe Discord privé",
    ],
    teacher: {
        name: "Thomas Mercier",
        verified: true,
        bio: "Joueur professionnel avec plus de 8 ans d'expérience en compétition. Multiple Top 8 aux Championnats Internationaux et coach certifié. Spécialisé dans l'analyse méta et la construction de decks innovants.",
        tags: ["Top 8 Internationaux", "150+ élèves formés", "Coach certifié"],
        coursesHref: "/apprendre",
    },
};

const SIMILAIRES = [
    { gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",    description: "Apprenez les bases et commencez votre aventure compétitive.", authorName: "Prof. M. Dubois", price: 29, href: "/apprendre/guide-1" },
    { gradientIndex: 1, level: "Avancé",        title: "Psychologie du Joueur Compétitif",   description: "Maîtrisez l'aspect mental de la compétition.",              authorName: "Thomas Moreau",   price: 59, href: "/apprendre/guide-2" },
    { gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",      description: "Optimisez chaque carte et chaque action.",                  authorName: "Lucas Bernard",   price: 45, href: "/apprendre/guide-3" },
];

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
    const [openModule, setOpenModule] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/apprendre" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux cours
                </Link>

                <div className="grid lg:grid-cols-3 gap-10">

                    {/* ── Colonne principale ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Titre + meta */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge label={COURSE.level} />
                                <span className="flex items-center gap-1 text-xs text-[#808896]">
                                    <Clock className="w-3.5 h-3.5" /> {COURSE.duration}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[#808896]">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {COURSE.rating} ({COURSE.reviews} avis)
                                </span>
                            </div>
                            <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] leading-snug">
                                {COURSE.title}
                            </h1>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Description du cours</h2>
                            <p className="text-sm text-[#4b5563] leading-relaxed">{COURSE.description}</p>
                        </div>

                        {/* Ce que vous allez apprendre */}
                        <div className="bg-[#e3ecf8] rounded-2xl p-6">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Ce que vous allez apprendre</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {COURSE.learningPoints.map((point) => (
                                    <div key={point} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-[#274c78]">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* À qui s'adresse ce cours */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-5">À qui s&apos;adresse ce cours ?</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { icon: "🎓", title: "Joueurs intermédiaires", desc: "Vous connaissez les bases et voulez progresser vers la compétition" },
                                    { icon: "⭐", title: "Joueurs avancés",        desc: "Vous cherchez à affiner votre stratégie et dominer le méta" },
                                    { icon: "🏅", title: "Compétiteurs",           desc: "Vous participez à des tournois et visez le top niveau" },
                                ].map(({ icon, title, desc }) => (
                                    <div key={title} className="bg-[#f0f5fb] rounded-2xl p-5 flex flex-col gap-3 border border-[#e3ecf8]">
                                        <div className="w-10 h-10 bg-[#dbeafe] rounded-xl flex items-center justify-center text-xl">
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{title}</p>
                                            <p className="text-xs text-[#4b5563] leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Déroulement de la session */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Déroulement de la session</h2>
                            <ul className="space-y-2">
                                {COURSE.modules.map((mod, i) => (
                                    <li
                                        key={i}
                                        className={`flex items-center justify-between p-3 rounded-xl text-sm ${mod.locked ? "bg-gray-50 text-[#9ca3af]" : "bg-[#eef5fb] text-[#140759] cursor-pointer hover:bg-[#e3ecf8]"}`}
                                        onClick={() => !mod.locked && setOpenModule(openModule === i ? null : i)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {mod.locked
                                                ? <Lock className="w-4 h-4 flex-shrink-0" />
                                                : <Play className="w-4 h-4 text-[#01509d] flex-shrink-0" />
                                            }
                                            <span className={mod.locked ? "" : "font-medium"}>{mod.title}</span>
                                        </div>
                                        <span className="flex items-center gap-2 text-xs text-[#808896]">
                                            {mod.duration}
                                            {!mod.locked && (openModule === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Notre professeur */}
                        <TeacherCard {...COURSE.teacher} />

                        {/* Informations importantes */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Informations importantes</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { icon: Clock, label: "Durée",       value: COURSE.duration },
                                    { icon: Users, label: "Participants", value: "12 max" },
                                    { icon: Star,  label: "Niveau",      value: COURSE.level },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-[#f9fafb] rounded-xl p-4 text-center">
                                        <Icon className="w-5 h-5 text-[#01509d] mx-auto mb-2" />
                                        <p className="text-xs text-[#808896]">{label}</p>
                                        <p className="font-bold text-sm text-[#140759]">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Guides similaires */}
                        <div>
                            <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-5">Guides similaires</h2>
                            <div className="grid sm:grid-cols-3 gap-5">
                                {SIMILAIRES.map((g) => <GuideCard key={g.href} {...g} authorRole="" />)}
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar sticky ── */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <PriceCard
                            price={COURSE.price}
                            originalPrice={COURSE.originalPrice}
                            ctaLabel="Acheter l'accès"
                            features={COURSE.features}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}
