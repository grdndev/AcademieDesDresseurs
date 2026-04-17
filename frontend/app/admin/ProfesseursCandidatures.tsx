"use client";

import { useState } from "react";
import {
    Search, CheckCircle, XCircle, Clock, Eye, Check, X,
    MapPin, Twitter, Twitch, MessageSquare, ChevronLeft,
    GraduationCap, BookMarked, Users, Trophy, Star, BarChart2,
} from "lucide-react";

/* ─── Types ─── */
type Statut = "En attente" | "Accepté" | "Refusé";

interface Candidature {
    id: number; name: string; email: string; handle: string;
    specialite: string; date: string; statut: Statut;
    experience: string; bestResult: string; niveau: string;
    tags: string[]; description: string;
    twitter: string; twitch: string; discord: string;
}

/* ─── Mock data ─── */
const CANDIDATURES: Candidature[] = [
    { id: 1, name: "Marc Dubois",    email: "marc.dubois@email.com",    handle: "@marc_dubois",    specialite: "Pokémon Feu",  date: "12 Jan 2024", statut: "En attente", experience: "5 ans",  bestResult: "Top 32", niveau: "Avancé",  tags: ["Pokémon Feu", "Stratégie"], description: "Joueur passionné depuis 5 ans, spécialisé dans les decks Feu.", twitter: "@MarcTCG", twitch: "MarcTCG", discord: "Marc#5678" },
    { id: 2, name: "Sophie Martin",  email: "sophie.martin@email.com",  handle: "@sophie_martin",  specialite: "Pokémon Eau",  date: "12 Jan 2024", statut: "Accepté",    experience: "6 ans",  bestResult: "Top 8",  niveau: "Expert",  tags: ["Pokémon Eau", "Deck Building"], description: "Championne régionale 2022, spécialiste des archetypes Eau.", twitter: "@SophieTCG", twitch: "SophieTCG", discord: "Sophie#2345" },
    { id: 3, name: "Pierre Leroy",   email: "pierre.leroy@email.com",   handle: "@pierre_leroy",   specialite: "Stratégie",    date: "12 Jan 2024", statut: "En attente", experience: "4 ans",  bestResult: "Top 16", niveau: "Avancé",  tags: ["Stratégie", "Coaching"], description: "Analyste métagame avec plusieurs articles publiés.", twitter: "@PierreTCG", twitch: "PierreTCG", discord: "Pierre#3456" },
    { id: 4, name: "Julie Bernard",  email: "julie.bernard@email.com",  handle: "@julie_bernard",  specialite: "Pokémon TCG",  date: "10 Jan 2024", statut: "Refusé",     experience: "2 ans",  bestResult: "Top 64", niveau: "Intermédiaire", tags: ["Pokémon TCG"], description: "Joueuse débutante souhaitant partager sa passion.", twitter: "@JulieTCG", twitch: "JulieTCG", discord: "Julie#4567" },
    { id: 5, name: "Thomas Durand",  email: "thomas.durand@email.com",  handle: "@thomas_durand",  specialite: "Pokémon TCG",  date: "10 Jan 2024", statut: "En attente", experience: "8 ans",  bestResult: "Top 16", niveau: "Expert",  tags: ["Deck Building", "Analyse méta", "Coaching"], description: "J'évolue dans le monde des tournois Pokémon depuis 8 ans avec des participations aux championnats régionaux et nationaux. Durant cette période j'ai acquis plus de 50 heures de coaching pour aider des joueurs à analyser des partitions en avance. Ma chaîne Youtube compte 10K abonnés où j'analyse le métagame et les guides stratégiques. Passionné par la transmission de connaissances et l'accompagnement des joueurs de tous niveaux.", twitter: "@ThomasTCG", twitch: "ThomasTCG", discord: "Thomas#1234" },
];

/* ─── Status style ─── */
const STATUT_STYLE: Record<Statut, string> = {
    "En attente": "bg-orange-50 text-orange-600 border-orange-200",
    "Accepté":    "bg-green-50 text-green-600 border-green-200",
    "Refusé":     "bg-red-50 text-red-500 border-red-200",
};

const STATUT_ICON: Record<Statut, React.ElementType> = {
    "En attente": Clock,
    "Accepté":    CheckCircle,
    "Refusé":     XCircle,
};

/* ─── Detail view ─── */
function DetailView({ c, onBack }: { c: Candidature; onBack: () => void }) {
    const [message, setMessage] = useState("");

    const CONTENT_TYPES = [
        { icon: GraduationCap, label: "Cours",   count: "3 services", bg: "bg-[#eef5fb]", color: "text-[#01509d]" },
        { icon: BookMarked,    label: "Guides",  count: "5 services", bg: "bg-green-50",  color: "text-green-600" },
        { icon: Users,         label: "Coaching",count: "2 services", bg: "bg-purple-50", color: "text-purple-600" },
    ];

    return (
        <div className="space-y-5">
            {/* Back */}
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour à la liste
            </button>

            {/* Status banner */}
            <div className="flex items-center gap-3 px-5 py-3 bg-[#fef3c7] border border-yellow-300 rounded-2xl text-sm">
                <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <p className="text-[#92400e]"><strong>Statut : En attente</strong> — Cette candidature nécessite votre action</p>
            </div>

            {/* 2-col */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left: Profile */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#e5e7eb] flex items-center justify-center">
                            <Users className="w-8 h-8 text-[#808896]" />
                        </div>
                        <div>
                            <p className="font-['Poppins'] font-bold text-base text-[#140759]">{c.name}</p>
                            <p className="text-xs text-[#808896]">{c.handle}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${STATUT_STYLE[c.statut]}`}>
                            {c.statut}
                        </span>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-[#808896]">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>France, Candidature {c.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#808896]">
                            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Spécialité : {c.specialite}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-[#140759] mb-3">Réseaux sociaux</p>
                        <div className="space-y-2">
                            {[
                                { icon: Twitter,        label: "Twitter",  value: c.twitter },
                                { icon: Twitch,         label: "Twitch",   value: c.twitch },
                                { icon: MessageSquare,  label: "Discord",  value: c.discord },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#e5e7eb] text-xs">
                                    <Icon className="w-4 h-4 text-[#808896] flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#140759]">{label}</p>
                                        <p className="text-[#808896]">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Experience stats */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Expérience Pokémon TCG</h3>
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            {[
                                { icon: Star,    label: "Années d'expérience", value: c.experience },
                                { icon: Trophy,  label: "Meilleur résultat",   value: c.bestResult },
                                { icon: BarChart2,label: "Niveau compétitif",  value: c.niveau },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="text-center p-3 bg-[#f9fafb] rounded-xl">
                                    <Icon className="w-5 h-5 text-[#01509d] mx-auto mb-1.5" />
                                    <p className="font-['Poppins'] font-bold text-base text-[#140759]">{value}</p>
                                    <p className="text-xs text-[#808896] mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs font-bold text-[#140759] mb-2">Spécialités</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {c.tags.map(t => (
                                <span key={t} className="px-3 py-1 bg-[#eef5fb] text-[#01509d] text-xs font-semibold rounded-full">{t}</span>
                            ))}
                        </div>

                        <p className="text-xs font-bold text-[#140759] mb-2">Description du candidat</p>
                        <p className="text-xs text-[#808896] leading-relaxed">{c.description}</p>
                    </div>

                    {/* Content types */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Types de contenus proposés</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {CONTENT_TYPES.map(({ icon: Icon, label, count, bg, color }) => (
                                <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb]">
                                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-[#140759]">{label}</p>
                                        <p className="text-xs text-[#808896]">{count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin actions */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Actions administrateur</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button className="flex items-center justify-center gap-2 h-11 bg-green-500 hover:bg-green-600 text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                                <CheckCircle className="w-4 h-4" /> Valider la candidature
                            </button>
                            <button className="flex items-center justify-center gap-2 h-11 bg-red-500 hover:bg-red-600 text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                                <XCircle className="w-4 h-4" /> Refuser la candidature
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#140759] mb-1.5">Message au candidat <span className="font-normal text-[#808896]">(optionnel)</span></label>
                            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                                placeholder="Ajouter un message personnalisé…"
                                className="w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af] resize-none" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ─── List view ─── */
export default function ProfesseursCandidatures() {
    const [selected, setSelected] = useState<Candidature | null>(null);

    if (selected) return <DetailView c={selected} onBack={() => setSelected(null)} />;

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: Clock,        iconBg: "bg-orange-50",  iconColor: "text-orange-500", label: "En attente",         value: "12" },
                    { icon: CheckCircle,  iconBg: "bg-green-50",   iconColor: "text-green-600",  label: "Professeurs actifs", value: "45" },
                    { icon: XCircle,      iconBg: "bg-red-50",     iconColor: "text-red-500",    label: "Refusées",           value: "8" },
                ].map(({ icon: Icon, iconBg, iconColor, label, value }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                            <p className="text-xs text-[#808896]">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                        <input type="text" placeholder="Rechercher un candidat…"
                            className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
                    </div>
                    {[
                        { opts: ["Tous les statuts", "En attente", "Accepté", "Refusé"] },
                        { opts: ["Toutes spécialités", "Pokémon Feu", "Pokémon Eau", "Stratégie", "Pokémon TCG"] },
                        { opts: ["Toutes les dates", "Cette semaine", "Ce mois"] },
                    ].map(({ opts }) => (
                        <select key={opts[0]} className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                            {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[580px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                {["Nom", "Email", "Spécialité", "Date candidature", "Statut", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CANDIDATURES.map(c => {
                                const StatusIcon = STATUT_ICON[c.statut];
                                return (
                                    <tr key={c.id} className="border-b border-[#f3f4f6] last:border-0">
                                        <td className="py-3 pr-3 font-semibold text-[#140759]">{c.name}</td>
                                        <td className="py-3 pr-3 text-[#808896]">{c.email}</td>
                                        <td className="py-3 pr-3 text-[#140759]">{c.specialite}</td>
                                        <td className="py-3 pr-3 text-[#808896] whitespace-nowrap">{c.date}</td>
                                        <td className="py-3 pr-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUT_STYLE[c.statut]}`}>
                                                <StatusIcon className="w-3 h-3" /> {c.statut}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setSelected(c)}
                                                    className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors" title="Voir le détail">
                                                    <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                                </button>
                                                <button className="w-7 h-7 rounded-lg border border-green-200 flex items-center justify-center hover:bg-green-50 transition-colors" title="Valider">
                                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                                </button>
                                                <button className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors" title="Refuser">
                                                    <X className="w-3.5 h-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
                    <p className="text-xs text-[#808896]">Affichage de 1 à 5 sur 23 candidatures</p>
                    <div className="flex items-center gap-1">
                        <button className="h-7 px-3 text-xs border border-[#e5e7eb] rounded-lg text-[#808896] hover:bg-gray-50">Précédent</button>
                        {[1, 2, 3].map(n => (
                            <button key={n} className={`w-7 h-7 text-xs rounded-lg font-semibold transition-colors ${n === 1 ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#808896] hover:bg-gray-50"}`}>{n}</button>
                        ))}
                        <button className="h-7 px-3 text-xs bg-[#01509d] text-white rounded-lg font-semibold hover:bg-[#014080]">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
