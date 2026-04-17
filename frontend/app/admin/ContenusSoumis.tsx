"use client";

import { useState } from "react";
import {
    Search, CheckCircle, XCircle, AlertTriangle, Eye,
    ShoppingBag, TrendingUp, ChevronLeft, Users, Star,
    Info, FileText, LayoutList,
} from "lucide-react";

/* ─── Types ─── */
interface Contenu {
    id: number; title: string; sub: string;
    type: string; typeColor: string;
    author: string; date: string;
    statut: "Terminé" | "En attente" | "Refusé";
    amount: string;
}

/* ─── Mock data ─── */
const CONTENUS: Contenu[] = [
    { id: 1, title: "Stratégies avancées de combat",      sub: "Format Standard compétitif", type: "Coaching",  typeColor: "bg-yellow-50 text-yellow-700",  author: "Lucas Martin",  date: "15 Jan 2024, 14:00", statut: "Terminé",    amount: "45,00€" },
    { id: 2, title: "Guide des types Pokémon",            sub: "Guide stratégique complet",  type: "Guide",     typeColor: "bg-green-50 text-green-700",    author: "Sophie Leray",  date: "12 Jan 2024",        statut: "Terminé",    amount: "29,00€" },
    { id: 3, title: "Formation complète dresseur",        sub: "14 modules — débutant",      type: "Formation", typeColor: "bg-purple-50 text-purple-600",   author: "Thomas Petit",  date: "15 Jan 2024",        statut: "En attente", amount: "88,00€" },
    { id: 4, title: "Méta actuel du jeu compétitif",      sub: "Analyse métagame détaillée", type: "Coaching",  typeColor: "bg-yellow-50 text-yellow-700",   author: "Emma Rousseau", date: "16 Jan 2024, 10:10", statut: "En attente", amount: "35,00€" },
    { id: 5, title: "Guide méta compétitif",              sub: "102 pages",                  type: "Guide",     typeColor: "bg-green-50 text-green-700",    author: "Jules Bernard", date: "06 Jan 2024",        statut: "Terminé",    amount: "18,00€" },
];

const STATUT_STYLE: Record<string, string> = {
    "Terminé":    "bg-green-50 text-green-600",
    "En attente": "bg-orange-50 text-orange-600",
    "Refusé":     "bg-red-50 text-red-500",
};

/* ─── Plan items for detail view ─── */
const PLAN = [
    { num: 1, title: "Introduction au format Standard",   desc: "Des règles de base et les types d'archétype du format actuel" },
    { num: 2, title: "Analyse du métagame",               desc: "Identification des decks compétitifs et évaluation des stratégies et matchups" },
    { num: 3, title: "Construction de deck avancée",      desc: "Sélection des cartes clés, optimisation et gestion des ressources" },
    { num: 4, title: "Stratégies de jeu",                 desc: "Techniques avancées et gestion des situations de jeu" },
];

type View = "list" | "detail" | "validation" | "refus";

/* ─── Validation confirmation view ─── */
function ValidationView({ c, onBack }: { c: Contenu; onBack: () => void }) {
    return (
        <div className="space-y-6 max-w-[640px]">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour
            </button>

            {/* Content summary card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#140759] to-[#01509d] flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <span className="text-white/30 text-xs">Image</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-2">
                            Stratégies Avancées pour les Tournois Pokémon TCG
                        </h3>
                        <div className="flex gap-2 mb-3">
                            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">Formation</span>
                            <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">Niveau Avancé</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#808896]">
                            <span><strong className="text-[#140759]">Professeur :</strong> Marie Dubois</span>
                            <span><strong className="text-[#140759]">Soumis le :</strong> 15 Janvier 2024</span>
                            <span><strong className="text-[#140759]">Prix :</strong> 49,99€</span>
                            <span><strong className="text-[#140759]">Durée :</strong> 4h 30min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <Info className="w-4 h-4 text-[#01509d] flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-[#01509d] mb-0.5">Information importante</p>
                    <p className="text-xs text-[#4b5563] leading-relaxed">
                        Une fois validé, ce contenu sera publié sur la plateforme et accessible aux joueurs. Cette action ne peut pas être annulée.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 h-11 px-6 bg-green-500 hover:bg-green-600 text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                    <CheckCircle className="w-4 h-4" /> Valider et publier
                </button>
                <button onClick={onBack} className="flex items-center gap-2 h-11 px-6 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                    <XCircle className="w-4 h-4 text-[#808896]" /> Annuler
                </button>
            </div>
        </div>
    );
}

/* ─── Refus view ─── */
function RefusView({ c, onBack }: { c: Contenu; onBack: () => void }) {
    const [reasons, setReasons] = useState<string[]>([]);
    const [notify,  setNotify]  = useState(true);
    const [message, setMessage] = useState(
        "Votre contenu nécessite certaines modifications avant publication. Veuillez vérifier les points suivants :\n\n— …"
    );

    const REASONS = [
        { id: "qualite",  icon: Star,        label: "Qualité insuffisante" },
        { id: "incomplet",icon: LayoutList,  label: "Contenu incomplet" },
        { id: "format",   icon: FileText,    label: "Problème de format" },
    ];

    function toggleReason(id: string) {
        setReasons(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    }

    return (
        <div className="space-y-6 max-w-[680px]">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour
            </button>

            {/* Contenu soumis */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                <p className="text-xs font-bold text-[#808896] uppercase tracking-wide mb-3">Contenu soumis</p>
                <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#dbb42b] to-[#f59e0b] flex-shrink-0 flex items-center justify-center">
                        <span className="text-white/40 text-xs">IMG</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-['Inter'] font-bold text-sm text-[#140759]">Les bases du deck building</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">Cours</span>
                            <span className="text-xs text-[#808896]">Professeur: Marie Dubois</span>
                            <span className="text-xs text-[#808896]">Soumis le: 15 Jan 2024</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Raison du refus */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-5">
                <div>
                    <p className="text-xs font-semibold text-[#808896] mb-2">Raisons rapides <span className="font-normal">(optionnel)</span></p>
                    <div className="flex flex-wrap gap-2">
                        {REASONS.map(({ id, icon: Icon, label }) => (
                            <button key={id} onClick={() => toggleReason(id)}
                                className={`flex items-center gap-1.5 h-8 px-3 rounded-xl border text-xs font-semibold transition-colors ${reasons.includes(id) ? "border-[#01509d] bg-[#eef5fb] text-[#01509d]" : "border-[#e5e7eb] text-[#808896] hover:border-[#01509d]/40"}`}>
                                <Icon className="w-3.5 h-3.5" /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold text-[#140759] mb-1.5">Message au professeur</p>
                    <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] transition-colors resize-none leading-relaxed" />
                    <p className="text-xs text-[#9ca3af] mt-1">Soyez constructif et précis pour aider le professeur à améliorer son contenu.</p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#01509d]" />
                    <div>
                        <p className="text-xs font-semibold text-[#140759]">Envoyer ce message au professeur</p>
                        <p className="text-xs text-[#808896]">Le professeur recevra une notification par email avec votre message.</p>
                    </div>
                </label>
            </div>

            {/* Orange info banner */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700 leading-relaxed">
                    <strong>Information importante</strong> — Le professeur pourra modifier et soumettre à nouveau son contenu après avoir pris en compte vos remarques.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 h-11 px-6 bg-red-500 hover:bg-red-600 text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                    <XCircle className="w-4 h-4" /> Refuser le contenu
                </button>
                <button onClick={onBack} className="h-11 px-6 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                    Annuler
                </button>
            </div>
        </div>
    );
}

/* ─── Detail view ─── */
function DetailView({ c, onBack, onValidate, onRefuse }: { c: Contenu; onBack: () => void; onValidate: () => void; onRefuse: () => void }) {
    const [comment, setComment] = useState("");

    return (
        <div className="space-y-5">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour à la liste
            </button>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left: content details */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Résumé */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Résumé du contenu</h3>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
                            {[
                                { label: "Titre",               value: "Stratégies avancées pour le format Standard" },
                                { label: "Date de soumission",  value: "15 mars 2024" },
                                { label: "Prix",                value: "20,00€" },
                                { label: "Niveau",              value: "Avancé" },
                                { label: "Professeur",          value: "Marc Dubois" },
                                { label: "Type",                value: c.type },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-0.5">
                                    <span className="text-[#808896] font-medium">{label}</span>
                                    <span className="font-semibold text-[#140759]">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Preview image */}
                        <div className="rounded-xl overflow-hidden h-40 bg-gradient-to-br from-[#140759] to-[#01509d] flex items-center justify-center">
                            <p className="text-white/40 text-xs font-semibold">Aperçu couverture</p>
                        </div>
                    </div>

                    {/* Aperçu du contenu */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Aperçu du contenu</h3>

                        <p className="text-xs font-bold text-[#140759] mb-3">Plan de formation</p>
                        <div className="space-y-3 mb-5">
                            {PLAN.map(({ num, title, desc }) => (
                                <div key={num} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#01509d] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {num}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-[#140759]">{title}</p>
                                        <p className="text-xs text-[#808896] mt-0.5">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs font-bold text-[#140759] mb-2">Description</p>
                        <p className="text-xs text-[#808896] leading-relaxed mb-3">
                            Cette formation complète vous permettra de maîtriser les stratégies avancées du format Standard. Vous apprendrez à analyser le métagame, construire des decks compétitifs et développer des stratégies de jeu efficaces.
                        </p>
                        <p className="text-xs text-[#808896] leading-relaxed">
                            En programme : Analyse des cartes clés, construction de deck optimisée, stratégies de défense et techniques de jeu avancées. Parfait pour les joueurs souhaitant améliorer leur niveau en compétition.
                        </p>
                    </div>
                </div>

                {/* Right: professor info + admin actions */}
                <div className="space-y-5">

                    {/* Informations professeur */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Informations professeur</h3>
                        <div className="flex flex-col items-center gap-3 text-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-[#e5e7eb] flex items-center justify-center">
                                <Users className="w-6 h-6 text-[#808896]" />
                            </div>
                            <div>
                                <p className="font-['Inter'] font-bold text-sm text-[#140759]">Marc Dubois</p>
                                <p className="text-xs text-[#808896]">marc.dubois@email.com</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                                { icon: Star,         value: "4.8",  label: "Note" },
                                { icon: TrendingUp,   value: "45K+", label: "Vues" },
                                { icon: ShoppingBag,  value: "13",   label: "Formations" },
                            ].map(({ icon: Icon, value, label }) => (
                                <div key={label} className="text-center p-2 bg-[#f9fafb] rounded-xl">
                                    <Icon className="w-4 h-4 text-[#808896] mx-auto mb-1" />
                                    <p className="font-bold text-xs text-[#140759]">{value}</p>
                                    <p className="text-[10px] text-[#808896]">{label}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full h-9 border border-[#01509d] text-[#01509d] font-['Inter'] font-semibold text-xs rounded-xl hover:bg-[#eef5fb] transition-colors">
                            Voir le profil professeur
                        </button>
                    </div>

                    {/* Décision administrative */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Décision administrative</h3>
                        <div className="space-y-3 mb-4">
                            <button onClick={onValidate} className="w-full h-10 bg-green-500 hover:bg-green-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Valider le contenu
                            </button>
                            <button onClick={onRefuse} className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                                <XCircle className="w-4 h-4" /> Refuser le contenu
                            </button>
                            <button className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Demander modification
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#140759] mb-1.5">Commentaire <span className="font-normal text-[#808896]">(optionnel)</span></label>
                            <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)}
                                placeholder="Ajouter vos commentaires..."
                                className="w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] transition-colors placeholder:text-[#9ca3af] resize-none text-xs" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ─── List view ─── */
export default function ContenusSoumis() {
    const [view,     setView]     = useState<View>("list");
    const [selected, setSelected] = useState<Contenu | null>(null);

    if (view === "validation" && selected) return <ValidationView c={selected} onBack={() => setView("detail")} />;
    if (view === "refus"      && selected) return <RefusView      c={selected} onBack={() => setView("detail")} />;
    if (view === "detail"     && selected) return (
        <DetailView
            c={selected}
            onBack={() => setView("list")}
            onValidate={() => setView("validation")}
            onRefuse={() => setView("refus")}
        />
    );

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: CheckCircle,  iconBg: "bg-green-50",   iconColor: "text-green-600",  label: "Total validés",       value: "127" },
                    { icon: TrendingUp,   iconBg: "bg-[#eef5fb]",  iconColor: "text-[#01509d]",  label: "Revenus générés",     value: "3 250€" },
                    { icon: ShoppingBag, iconBg: "bg-purple-50",  iconColor: "text-purple-600", label: "Formations données",  value: "89" },
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
                    {[
                        { opts: ["Tous les types", "Cours", "Coaching", "Formation", "Guide"] },
                        { opts: ["Toutes les dates", "Cette semaine", "Ce mois"] },
                    ].map(({ opts }) => (
                        <select key={opts[0]} className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                            {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                        <input type="text" placeholder="Rechercher une vente…"
                            className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[600px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                {["Produit", "Type", "Auteur", "Date", "Statut", "Montant", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CONTENUS.map(c => (
                                <tr key={c.id} className="border-b border-[#f3f4f6] last:border-0">
                                    <td className="py-3 pr-3">
                                        <p className="font-semibold text-[#140759]">{c.title}</p>
                                        <p className="text-[#808896]">{c.sub}</p>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.typeColor}`}>{c.type}</span>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#e5e7eb] flex-shrink-0" />
                                            <span className="text-[#140759]">{c.author}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-3 text-[#808896] whitespace-nowrap">{c.date}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[c.statut]}`}>{c.statut}</span>
                                    </td>
                                    <td className="py-3 pr-3 font-bold text-[#140759]">{c.amount}</td>
                                    <td className="py-3">
                                        <button onClick={() => { setSelected(c); setView("detail"); }}
                                            className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                            <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
                    <p className="text-xs text-[#808896]">Affichage de 1 à 5 sur 5 contenus</p>
                    <div className="flex items-center gap-2">
                        <button className="h-7 px-3 text-xs border border-[#e5e7eb] rounded-lg text-[#808896] hover:bg-gray-50">Précédent</button>
                        <button className="h-7 px-3 text-xs bg-[#01509d] text-white rounded-lg font-semibold hover:bg-[#014080]">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
