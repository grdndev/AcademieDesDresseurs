"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import { Star, Clock, Trophy, CheckCircle2, Calendar, Globe, Users } from "lucide-react";

/* ─── Data (same source as listing) ─── */
const ALL_COACHES = [
    {
        id: 0, name: "Alexandre Moreau", role: "Coach Premium",
        avatar: "/res/avatar1.png",
        bio: "Coach principal de l'Académie avec plus de 8 ans d'expérience en compétition. Spécialisé dans la préparation aux tournois majeurs et l'entraînement intensif avancé.",
        fullBio: "Alexandre Moreau est un joueur compétitif de renommée internationale, avec plus de 8 ans d'expérience au plus haut niveau. Champion National 2023, Top 8 Worlds 2023, il a accompagné des dizaines de joueurs vers leurs premiers podiums régionaux et nationaux. Sa méthode allie analyse vidéo, simulation intensive et travail mental pour préparer ses élèves à performer dans les conditions les plus exigeantes.",
        exp: 8, rating: 4.9, reviews: 127, sessions: 340,
        duration: "90 min", price: 120,
        badges: ["Champion National 2023", "Top 8 Worlds 2023", "Session 90 min", "Prépa tournoi"],
        specialite: "Tournois", niveau: "Avancé",
        checks: ["Analyse vidéo de vos parties", "Plan d'entraînement personnalisé", "Support entre les sessions", "Accès aux ressources exclusives"],
        disponibilites: ["Lun", "Mar", "Jeu", "Ven"],
    },
    {
        id: 1, name: "Thomas Lefèvre", role: "Expert construction de decks",
        avatar: "/res/avatar2.png",
        bio: "Expert en construction de decks compétitifs et optimisation des stratégies de jeu.",
        fullBio: "Thomas est spécialisé dans la construction et l'optimisation de decks pour la méta compétitive actuelle. Fort de 5 ans d'expérience et d'un Top 32 aux Internationaux 2023, il aide ses élèves à comprendre les principes fondamentaux du deck building et à adapter leurs listes en fonction de l'environnement.",
        exp: 5, rating: 4.8, reviews: 94, sessions: 210,
        duration: "60 min", price: 75,
        badges: ["Top 32 Internationaux 2023"],
        specialite: "Deck building", niveau: "Intermédiaire",
        checks: ["Audit complet de votre deck", "Optimisation de la liste", "Stratégies de sideboard", "Suivi post-session"],
        disponibilites: ["Mar", "Mer", "Sam"],
    },
    {
        id: 2, name: "Sophie Bernard", role: "Spécialiste psychologie",
        avatar: "/res/avatar3.png",
        bio: "Spécialiste de la psychologie mentale et de la préparation au tournoi.",
        fullBio: "Sophie apporte une dimension mentale souvent négligée dans la préparation compétitive. Avec 4 ans d'expérience et une formation en psychologie du sport, elle aide les joueurs à gérer la pression, améliorer leur concentration et développer une routine de performance optimale.",
        exp: 4, rating: 4.7, reviews: 78, sessions: 165,
        duration: "60 min", price: 90,
        badges: ["Préparer Toujours PRG"],
        specialite: "Psychologie", niveau: "Intermédiaire",
        checks: ["Gestion du stress en tournoi", "Routines de performance", "Analyse des biais décisionnels", "Coaching mental"],
        disponibilites: ["Lun", "Mer", "Dim"],
    },
    {
        id: 3, name: "Lucas Dubois", role: "Analyste méta",
        avatar: "/res/avatar1.png",
        bio: "Analyste méta avancé, spécialisé dans les décisions en conditions de format compétitif.",
        fullBio: "Lucas est reconnu pour ses analyses méta approfondies et sa capacité à lire l'environnement compétitif. Top 8 aux Worlds 2023, il enseigne à ses élèves comment anticiper la méta, choisir le bon deck et prendre des décisions éclairées en conditions de tournoi.",
        exp: 6, rating: 4.9, reviews: 112, sessions: 280,
        duration: "60 min", price: 80,
        badges: ["Top 8 Worlds 2023"],
        specialite: "Méta", niveau: "Avancé",
        checks: ["Analyse de la méta actuelle", "Choix du deck optimal", "Lecture des matchups", "Préparation au tournoi"],
        disponibilites: ["Lun", "Jeu", "Ven", "Sam"],
    },
    {
        id: 4, name: "Marc Fontaine", role: "Coach technique",
        avatar: "/res/avatar2.png",
        bio: "Coach axé sur la maîtrise technique et la gestion du stress lors des matchs décisifs.",
        fullBio: "Marc se concentre sur les fondamentaux techniques : calcul de probabilités, gestion des ressources, timing des attaques. Avec 3 ans de coaching et un Top 32 aux Internationaux, il aide les joueurs intermédiaires à franchir le cap vers le niveau avancé.",
        exp: 3, rating: 4.6, reviews: 65, sessions: 140,
        duration: "60 min", price: 85,
        badges: ["Top 32 Internationaux 2023"],
        specialite: "Technique", niveau: "Débutant",
        checks: ["Fondamentaux techniques", "Calcul de probabilités", "Gestion des ressources", "Optimisation du tempo"],
        disponibilites: ["Mar", "Jeu", "Sam", "Dim"],
    },
    {
        id: 5, name: "Emma Rousseau", role: "Championne internationale",
        avatar: "/res/avatar3.png",
        bio: "Championne internationale, experte en gestion de la fatigue et des performances en tournoi.",
        fullBio: "Emma est l'une des joueuses les plus titrées de la scène française. Championne internationale et Top 4 Worlds, elle partage son expérience unique pour aider ses élèves à performer sur la durée lors des longs tournois, gérer la fatigue et rester concentrés jusqu'à la dernière ronde.",
        exp: 7, rating: 4.8, reviews: 103, sessions: 260,
        duration: "90 min", price: 110,
        badges: ["Championne Toujours PRG", "Top 4 Worlds"],
        specialite: "Tournois", niveau: "Avancé",
        checks: ["Gestion de la fatigue", "Stratégie sur la durée", "Préparation mentale", "Analyse post-tournoi"],
        disponibilites: ["Lun", "Mer", "Ven"],
    },
    {
        id: 6, name: "Julien Martin", role: "Spécialiste début de partie",
        avatar: "/res/avatar1.png",
        bio: "Analyste tactique de début de partie, spécialiste des deck-outs et du contre-stratégie.",
        fullBio: "Julien s'est spécialisé dans l'analyse des ouvertures et des premiers tours de jeu, phase souvent décisive dans le Pokémon TCG compétitif. Avec 2 ans de coaching et un Top 8 régional, il enseigne comment maximiser ses chances dès les premiers tours.",
        exp: 2, rating: 4.5, reviews: 41, sessions: 90,
        duration: "60 min", price: 70,
        badges: ["Top 8 Toujours 2023"],
        specialite: "Technique", niveau: "Débutant",
        checks: ["Optimisation des ouvertures", "Gestion des mulligan", "Contre-stratégie", "Premiers tours décisifs"],
        disponibilites: ["Mer", "Ven", "Sam", "Dim"],
    },
];

const SLOTS = ["09:00", "10:30", "14:00", "15:30", "17:00", "18:30"];
const DAYS  = ["Lun 20", "Mar 21", "Mer 22", "Jeu 23", "Ven 24", "Sam 25"];

export default function CoachProfilePage() {
    const params = useParams<{ id: string }>();
    const id     = parseInt(params.id, 10);
    const coach  = ALL_COACHES.find(c => c.id === id) ?? ALL_COACHES[0];
    const others = ALL_COACHES.filter(c => c.id !== id).slice(0, 3);

    const [selectedDay,  setDay]  = useState<string | null>(null);
    const [selectedSlot, setSlot] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── Left: Profile ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile card */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                            <div className="flex items-start gap-5">
                                <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0">
                                    <Image src={coach.avatar} alt={coach.name} width={96} height={96} className="object-cover w-full h-full" unoptimized />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                        <div>
                                            <h2 className="font-['Poppins'] font-bold text-xl text-[#140759]">{coach.name}</h2>
                                            <p className="text-sm text-[#808896]">{coach.role}</p>
                                        </div>
                                        {coach.id === 0 && (
                                            <span className="bg-[#dbb42b] text-[#140759] text-xs font-bold px-3 py-1 rounded-full">Coach Premium</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#808896]">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            {coach.rating} · {coach.reviews} avis
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" /> {coach.sessions} sessions
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> {coach.exp} ans d'expérience
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {coach.badges.map(b => (
                                            <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#fff8e1] text-[#b45309] text-xs font-semibold rounded-full border border-[#fde68a]">
                                                <Trophy className="w-3 h-3" /> {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                            <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-3">À propos</h3>
                            <p className="text-sm text-[#4b5563] leading-relaxed">{coach.fullBio}</p>
                        </div>

                        {/* What's included */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                            <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Ce qui est inclus</h3>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {coach.checks.map(c => (
                                    <li key={c} className="flex items-start gap-2 text-sm text-[#140759]">
                                        <CheckCircle2 className="w-4 h-4 text-[#01509d] flex-shrink-0 mt-0.5" />
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Availability calendar */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                            <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#01509d]" /> Disponibilités
                            </h3>
                            {/* Days */}
                            <div className="grid grid-cols-6 gap-2 mb-4">
                                {DAYS.map(d => {
                                    const dayAbbr = d.split(" ")[0];
                                    const available = coach.disponibilites.includes(dayAbbr);
                                    return (
                                        <button key={d} disabled={!available}
                                            onClick={() => setDay(d === selectedDay ? null : d)}
                                            className={`py-2 rounded-xl text-xs font-semibold transition-colors ${!available ? "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed" : selectedDay === d ? "bg-[#01509d] text-white" : "bg-[#eef5fb] text-[#01509d] hover:bg-[#01509d] hover:text-white"}`}>
                                            {d}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Slots */}
                            {selectedDay && (
                                <div>
                                    <p className="text-xs text-[#808896] mb-2">Créneaux disponibles pour le <span className="font-semibold text-[#140759]">{selectedDay}</span></p>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {SLOTS.map(s => (
                                            <button key={s} onClick={() => setSlot(s === selectedSlot ? null : s)}
                                                className={`py-2 rounded-xl text-xs font-semibold transition-colors ${selectedSlot === s ? "bg-[#01509d] text-white" : "bg-[#f9fafb] border border-[#e5e7eb] text-[#140759] hover:border-[#01509d] hover:text-[#01509d]"}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Booking card ── */}
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 sticky top-24">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="font-['Poppins'] font-bold text-3xl text-[#140759]">{coach.price}€</span>
                                <span className="text-sm text-[#808896]">/ séance</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#808896] mb-5">
                                <Clock className="w-3.5 h-3.5" /> Durée : <span className="font-semibold text-[#140759] ml-1">{coach.duration}</span>
                            </div>

                            {selectedDay && selectedSlot ? (
                                <div className="bg-[#eef5fb] rounded-xl p-3 mb-4 text-xs text-[#01509d] font-semibold">
                                    📅 {selectedDay} à {selectedSlot}
                                </div>
                            ) : (
                                <p className="text-xs text-[#808896] mb-4">Sélectionnez un créneau dans le calendrier pour réserver.</p>
                            )}

                            <button disabled={!selectedDay || !selectedSlot}
                                className="w-full h-11 bg-[#dbb42b] hover:bg-[#c9a020] disabled:opacity-40 disabled:cursor-not-allowed text-[#140759] font-['Inter'] font-bold text-sm rounded-xl transition-colors mb-3">
                                Réserver cette séance
                            </button>
                            <Link href="/progresser/coaching"
                                className="w-full h-10 flex items-center justify-center border border-[#e5e7eb] text-[#808896] font-['Inter'] font-semibold text-xs rounded-xl hover:bg-[#f9fafb] transition-colors">
                                Retour aux coachs
                            </Link>

                            {/* Badges */}
                            <div className="mt-5 pt-5 border-t border-[#f3f4f6] space-y-2">
                                {[
                                    { icon: Globe, text: "Session en visioconférence" },
                                    { icon: CheckCircle2, text: "Remboursement sous 48h" },
                                    { icon: Star, text: `${coach.rating}/5 · ${coach.reviews} avis vérifiés` },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-xs text-[#808896]">
                                        <Icon className="w-3.5 h-3.5 text-[#01509d] flex-shrink-0" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other coaches */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                            <h3 className="font-['Poppins'] font-bold text-xs text-[#140759] mb-3">Autres coachs</h3>
                            <div className="space-y-3">
                                {others.map(c => (
                                    <Link key={c.id} href={`/progresser/coaching/${c.id}`}
                                        className="flex items-center gap-3 hover:bg-[#f9fafb] p-2 rounded-xl transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                                            <Image src={c.avatar} alt={c.name} width={40} height={40} className="object-cover w-full h-full" unoptimized />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#140759] truncate">{c.name}</p>
                                            <p className="text-[10px] text-[#808896] truncate">{c.role}</p>
                                        </div>
                                        <span className="text-xs font-bold text-[#140759] flex-shrink-0">{c.price}€</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
