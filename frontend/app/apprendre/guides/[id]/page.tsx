"use client";

import Navbar from "../../../components/Navbar";
import PriceCard from "../../../components/PriceCard";
import TeacherCard from "../../../components/TeacherCard";
import Badge from "../../../components/ui/Badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Star, Lock, BookOpen } from "lucide-react";
import { useParams } from "next/navigation";

const GUIDES: Record<string, {
    id: string; title: string; level: string; duration: string; date: string;
    description: string; price: number; originalPrice?: number;
    intro: string; features: string[];
    teacher: { name: string; verified: boolean; bio: string; tags: string[]; coursesHref: string };
}> = {
    "guide-1": {
        id: "guide-1", level: "Débutant", duration: "2h", date: "Samedi 15 Mars 2025, 14h00",
        title: "Les Fondamentaux du Pokémon TCG",
        description: "Un guide complet pour maîtriser les bases du Pokémon TCG et commencer votre aventure compétitive.",
        price: 29, originalPrice: 39,
        intro: "Le Pokémon TCG est l'un des jeux de cartes les plus stratégiques et gratifiants du marché. Ce guide vous accompagne étape par étape dans la découverte des mécaniques fondamentales, des types d'énergie, des règles de combat et de la construction de vos premiers decks compétitifs.\n\nDans ce guide, vous explorerez les bases essentielles qui permettent de bâtir une stratégie solide et de prendre de meilleures décisions à chaque tour de jeu.",
        features: ["Replay disponible 30 jours", "Support PDF inclus", "Certificat de participation", "Groupe Discord privé"],
        teacher: { name: "Prof. M. Dubois", verified: true, bio: "Professeur certifié avec plus de 6 ans d'expérience dans l'enseignement du Pokémon TCG. Spécialisé dans l'accompagnement des débutants vers leur premier niveau compétitif.", tags: ["Top 8 Régionaux", "150+ élèves formés", "Professeur certifié"], coursesHref: "/apprendre" },
    },
    "guide-2": {
        id: "guide-2", level: "Avancé", duration: "3h", date: "Samedi 15 Mars 2025, 14h00",
        title: "Maîtriser Lost Box en Format Standard",
        description: "Un guide complet pour dominer le métagame avec l'archétype Lost Box. Apprenez les combos essentiels, les matchups clés et les stratégies avancées.",
        price: 59, originalPrice: 79,
        intro: "Lost Box est l'un des archétypes les plus complexes et gratifiants du Format Standard actuel. Basé sur la mécanique de la Lost Zone, ce deck demande une compréhension approfondie des interactions entre cartes et une gestion précieuse des ressources.\n\nDans ce guide, nous explorerons en détail les stratégies qui font de Lost Box un premier plan pour les joueurs compétitifs. Vous découvrirez comment optimiser vos ouvertures, gérer vos ressources et adapter votre jeu selon les matchups.",
        features: ["Replay disponible 30 jours", "Support PDF inclus", "Certificat de participation", "Groupe Discord privé"],
        teacher: { name: "Thomas Mercier", verified: true, bio: "Joueur professionnel avec plus de 8 ans d'expérience en compétition. Multiple Top 8 aux Championnats Internationaux et coach certifié. Spécialisé dans l'analyse méta et la construction de decks innovants.", tags: ["Top 8 Internationaux", "150+ élèves formés", "Coach certifié"], coursesHref: "/apprendre" },
    },
    "guide-3": {
        id: "guide-3", level: "Intermédiaire", duration: "2h30", date: "Dimanche 20 Avril 2025",
        title: "Gestion de Ressources Avancée",
        description: "Optimisez chaque carte et chaque action pour maximiser votre efficacité en tournoi.",
        price: 45,
        intro: "La gestion des ressources est l'une des compétences les plus sous-estimées du Pokémon TCG compétitif. Savoir quand jouer, quand garder et comment adapter son rythme fait souvent la différence entre une victoire et une défaite.\n\nCe guide explore les concepts avancés de gestion de main, d'énergie et d'attaques pour vous aider à prendre les meilleures décisions sous pression.",
        features: ["Accès illimité", "Support PDF inclus", "Exercices pratiques", "Groupe Discord privé"],
        teacher: { name: "Lucas Bernard", verified: true, bio: "Joueur Top 16 aux Internationaux avec une expertise reconnue en analyse de deck et gestion des ressources en tournoi.", tags: ["Top 16 Internationaux", "100+ élèves formés", "Coach certifié"], coursesHref: "/apprendre" },
    },
};

const SIMILAIRES = [
    { id: "guide-1", gradientIndex: 0, level: "Débutant",      title: "Les Fondamentaux du Pokémon TCG",  description: "Apprenez les bases et commencez votre aventure compétitive.", authorName: "Prof. M. Dubois", price: 29 },
    { id: "guide-3", gradientIndex: 2, level: "Intermédiaire", title: "Gestion de Ressources Avancée",    description: "Optimisez chaque carte et chaque action.",                  authorName: "Lucas Bernard",   price: 45 },
    { id: "guide-5", gradientIndex: 1, level: "Avancé",        title: "Analyse des decks Tier 1",         description: "Décryptez les meilleures listes et leurs lignes de jeu.",  authorName: "Tonio",           price: 69 },
];

const GRADIENTS = [
    "from-pink-400 to-purple-500",
    "from-orange-400 to-red-500",
    "from-green-400 to-teal-500",
    "from-blue-400 to-indigo-500",
];

export default function GuideDetailPage() {
    const { id } = useParams<{ id: string }>();
    const guide = GUIDES[id] ?? GUIDES["guide-2"];

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/apprendre/guides" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux guides
                </Link>

                <div className="grid lg:grid-cols-3 gap-10">

                    {/* ── Colonne principale ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Titre + meta */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge label={guide.level} />
                                <span className="flex items-center gap-1 text-xs text-[#808896]">
                                    <Clock className="w-3.5 h-3.5" /> {guide.duration} de lecture
                                </span>
                            </div>
                            <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] leading-snug mb-2">
                                {guide.title}
                            </h1>
                            <p className="text-sm text-[#808896]">{guide.description}</p>
                            <p className="text-xs text-[#9ca3af] mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {guide.date}
                            </p>
                        </div>

                        {/* Introduction */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
                            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Introduction à {guide.title.split(" ").slice(0, 3).join(" ")}</h2>
                            <div className="space-y-3">
                                {guide.intro.split("\n\n").map((para, i) => (
                                    <p key={i} className="text-sm text-[#4b5563] leading-relaxed">{para}</p>
                                ))}
                            </div>

                            {/* Contenu verrouillé */}
                            <div className="relative mt-4">
                                <p className="text-sm text-[#4b5563] leading-relaxed blur-sm select-none">
                                    Dans ce guide, nous aborderons les stratégies avancées qui permettent de dominer le métagame actuel. Vous apprendrez à optimiser votre list, identifier les cartes clés et comprendre les interactions complexes qui font toute la différence en tournoi compétitif de haut niveau.
                                </p>
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent rounded-xl pt-8">
                                    <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 text-center shadow-sm max-w-xs">
                                        <Lock className="w-6 h-6 text-[#01509d] mx-auto mb-2" />
                                        <p className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">Contenu Premium</p>
                                        <p className="text-xs text-[#808896] mb-3">Achetez l'accès pour lire l'intégralité du guide et découvrir toutes les stratégies avancées.</p>
                                        <button className="text-xs font-bold text-[#01509d] hover:underline">Débloquer le guide complet</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Votre professeur */}
                        <TeacherCard {...guide.teacher} />

                        {/* Guides similaires */}
                        <div>
                            <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-5">Guides similaires</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {SIMILAIRES.filter(g => g.id !== id).slice(0, 3).map(g => (
                                    <Link key={g.id} href={`/apprendre/guides/${g.id}`}
                                        className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                        <div className={`h-24 bg-gradient-to-br ${GRADIENTS[g.gradientIndex]} flex items-center justify-center`}>
                                            <BookOpen className="w-8 h-8 text-white/70" />
                                        </div>
                                        <div className="p-4 flex flex-col gap-1 flex-1">
                                            <Badge label={g.level} />
                                            <p className="font-['Inter'] font-bold text-xs text-[#140759] mt-1 leading-snug">{g.title}</p>
                                            <p className="text-xs text-[#808896] line-clamp-2">{g.description}</p>
                                            <p className="font-['Poppins'] font-bold text-sm text-[#140759] mt-auto pt-2">{g.price}€</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar sticky ── */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <PriceCard
                            price={guide.price}
                            originalPrice={guide.originalPrice}
                            ctaLabel="Acheter l'accès"
                            features={guide.features}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}
