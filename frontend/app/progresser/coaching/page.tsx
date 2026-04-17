"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { Search, ChevronDown, Star, Clock, Trophy, Globe } from "lucide-react";

/* ─── Types & data ─── */
interface Coach {
    id: number; name: string; role: string; avatar: string;
    bio: string; exp: number; rating: number; reviews: number;
    duration: string; price: number;
    badges: string[];
    specialite: string; niveau: string;
}

const FEATURED: Coach = {
    id: 0, name: "Alexandre Moreau", role: "Coach Premium",
    avatar: "/res/avatar1.png",
    bio: "Coach principal de l'Académie avec plus de 8 ans d'expérience en compétition. Spécialisé dans la préparation aux tournois majeurs et l'entraînement intensif avancé.",
    exp: 8, rating: 4.9, reviews: 127, duration: "90 min", price: 120,
    badges: ["Champion National 2023", "Top 8 Worlds 2023", "Session 90 min", "Prépa tournoi"],
    specialite: "Tournois", niveau: "Avancé",
};

const COACHES: Coach[] = [
    { id: 1, name: "Thomas Lefèvre",  role: "Expert construction de decks", avatar: "/res/avatar2.png", bio: "Expert en construction de decks compétitifs et optimisation des stratégies de jeu.", exp: 5, rating: 4.8, reviews: 94,  duration: "60 min", price: 75,  badges: ["Top 32 Internationaux 2023"], specialite: "Deck building", niveau: "Intermédiaire" },
    { id: 2, name: "Sophie Bernard",  role: "Spécialiste psychologie",       avatar: "/res/avatar3.png", bio: "Spécialiste de la psychologie mentale et de la preparation au tournoi pour les femmes.", exp: 4, rating: 4.7, reviews: 78,  duration: "60 min", price: 90,  badges: ["Préparer Toujours PRG"], specialite: "Psychologie", niveau: "Intermédiaire" },
    { id: 3, name: "Lucas Dubois",    role: "Analyste méta",                 avatar: "/res/avatar1.png", bio: "Analyste méta avancé, spécialisé dans les décisions en conditions de format compétitif.", exp: 6, rating: 4.9, reviews: 112, duration: "60 min", price: 80,  badges: ["Top 8 Worlds 2023"], specialite: "Méta", niveau: "Avancé" },
    { id: 4, name: "Marc Fontaine",   role: "Coach technique",               avatar: "/res/avatar2.png", bio: "Coach axé sur la maîtrise technique et la gestion du stress lors des matchs décisifs.", exp: 3, rating: 4.6, reviews: 65,  duration: "60 min", price: 85,  badges: ["Top 32 Internationaux 2023"], specialite: "Technique", niveau: "Débutant" },
    { id: 5, name: "Emma Rousseau",   role: "Championne internationale",     avatar: "/res/avatar3.png", bio: "Championne internationale, experte en gestion de la fatigue, du stress et en performances en tournoi.", exp: 7, rating: 4.8, reviews: 103, duration: "90 min", price: 110, badges: ["Championne Toujours PRG"], specialite: "Tournois", niveau: "Avancé" },
    { id: 6, name: "Julien Martin",   role: "Spécialiste début de partie",   avatar: "/res/avatar1.png", bio: "Analyste tactique de début de partie, spécialiste des deck-outs et du contre-stratégie.", exp: 2, rating: 4.5, reviews: 41,  duration: "60 min", price: 70,  badges: ["Top 8 Toujours 2023"], specialite: "Technique", niveau: "Débutant" },
];

const NIVEAUX      = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const SPECIALITES  = ["Toutes spécialités", "Deck building", "Méta", "Tournois", "Psychologie", "Technique"];
const PRIX_OPTS    = ["Tous les prix", "< 80€", "80€ – 100€", "> 100€"];

export default function CoachingPage() {
    const [search,     setSearch]     = useState("");
    const [niveau,     setNiveau]     = useState("Tous les niveaux");
    const [specialite, setSpecialite] = useState("Toutes spécialités");
    const [prix,       setPrix]       = useState("Tous les prix");

    const filtered = COACHES.filter(c => {
        const q = search.toLowerCase();
        if (q && !c.name.toLowerCase().includes(q) && !c.bio.toLowerCase().includes(q)) return false;
        if (niveau !== "Tous les niveaux" && c.niveau !== niveau) return false;
        if (specialite !== "Toutes spécialités" && c.specialite !== specialite) return false;
        if (prix === "< 80€" && c.price >= 80) return false;
        if (prix === "80€ – 100€" && (c.price < 80 || c.price > 100)) return false;
        if (prix === "> 100€" && c.price <= 100) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-8 space-y-10">

                {/* ── Search / Filter bar ── */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher un coach ou une spécialité…"
                            className="w-full pl-10 pr-4 py-2 text-sm text-[#140759] outline-none placeholder:text-[#9ca3af]" />
                    </div>
                    {/* Selects */}
                    {[
                        { label: "Niveau",      opts: NIVEAUX,     val: niveau,     set: setNiveau     },
                        { label: "Spécialité",  opts: SPECIALITES, val: specialite, set: setSpecialite },
                        { label: "Prix",        opts: PRIX_OPTS,   val: prix,       set: setPrix       },
                    ].map(({ opts, val, set }) => (
                        <div key={opts[0]} className="relative">
                            <select value={val} onChange={e => set(e.target.value)}
                                className="appearance-none h-9 pl-3 pr-8 text-xs font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none focus:border-[#01509d]">
                                {opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#808896] pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* ── Featured coach ── */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Photo side */}
                        <div className="relative md:w-56 h-48 md:h-auto flex-shrink-0 bg-[#eef5fb]">
                            <div className="absolute top-3 left-3 bg-[#dbb42b] text-[#140759] text-xs font-bold px-2.5 py-1 rounded-full z-10">
                                Coach Premium
                            </div>
                            <Image src={FEATURED.avatar} alt={FEATURED.name} fill className="object-cover" unoptimized />
                        </div>
                        {/* Info */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-1">{FEATURED.name}</h2>
                                <p className="text-sm text-[#808896] leading-relaxed mb-4 max-w-xl">{FEATURED.bio}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {FEATURED.badges.map(b => (
                                        <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fff8e1] text-[#b45309] text-xs font-semibold rounded-full border border-[#fde68a]">
                                            <Trophy className="w-3 h-3" /> {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <p className="font-['Poppins'] font-bold text-2xl text-[#140759]">
                                    {FEATURED.price}€
                                    <span className="text-sm font-normal text-[#808896]"> / séance</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <Link href={`/progresser/coaching/${FEATURED.id}#booking`}
                                        className="h-9 px-4 bg-[#dbb42b] hover:bg-[#c9a020] text-[#140759] font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center">
                                        Réserver une séance
                                    </Link>
                                    <Link href={`/progresser/coaching/${FEATURED.id}`}
                                        className="h-9 px-4 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-xs rounded-xl hover:bg-[#f9fafb] transition-colors flex items-center">
                                        Voir le profil complet
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Coach list ── */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-['Poppins'] font-bold text-xl text-[#140759]">Nos coachs certifiés</h2>
                        <span className="text-sm text-[#808896]">{filtered.length} coachs disponibles</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-[#808896]">Aucun coach trouvé.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(c => (
                                <div key={c.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
                                    {/* Avatar + name */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0">
                                            <Image src={c.avatar} alt={c.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                                        </div>
                                        <div>
                                            <p className="font-['Inter'] font-bold text-sm text-[#140759]">{c.name}</p>
                                            <p className="text-xs text-[#808896]">{c.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-[#4b5563] leading-relaxed mb-3 line-clamp-2">{c.bio}</p>

                                    {/* Badge */}
                                    {c.badges[0] && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#fff8e1] text-[#b45309] text-[10px] font-semibold rounded-full border border-[#fde68a] w-fit mb-3">
                                            <Globe className="w-2.5 h-2.5" /> {c.badges[0]}
                                        </span>
                                    )}

                                    {/* Rating + exp */}
                                    <div className="flex items-center gap-3 text-xs text-[#808896] mb-4">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {c.rating} · {c.reviews} avis
                                        </span>
                                        <span>{c.exp} ans d'expérience</span>
                                    </div>

                                    {/* Duration + price */}
                                    <div className="flex items-center justify-between text-xs mb-4 pt-3 border-t border-[#f3f4f6]">
                                        <span className="flex items-center gap-1 text-[#808896]">
                                            <Clock className="w-3.5 h-3.5" /> Durée <span className="font-semibold text-[#140759] ml-1">{c.duration}</span>
                                        </span>
                                        <span className="text-[#808896]">Tarif <span className="font-bold text-[#140759] text-sm ml-1">{c.price}€</span></span>
                                    </div>

                                    {/* Buttons */}
                                    <Link href={`/progresser/coaching/${c.id}`}
                                        className="w-full h-9 flex items-center justify-center bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors mb-2">
                                        Réserver une session
                                    </Link>
                                    <Link href={`/progresser/coaching/${c.id}`}
                                        className="text-center text-xs text-[#01509d] font-semibold hover:underline">
                                        Voir le profil
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
