"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import {
    LayoutDashboard, BookOpen, CalendarCheck, User, Star,
    TrendingUp, Users, Plus, ChevronRight, ExternalLink,
    FileText, Video, BookMarked, Calendar, Bell, Mail, Cookie,
    Youtube, Twitch, Twitter, MessageSquare, LogOut, Trash2,
    CheckSquare, Square, CheckCircle, Clock, Search, ChevronDown,
    Eye, Edit2, LifeBuoy, HelpCircle,
} from "lucide-react";
import CreerContenu    from "./CreerContenu";
import Disponibilites  from "./Disponibilites";
import VentesRevenus   from "./VentesRevenus";

/* ─── Constants ─── */

const TABS = [
    { id: "dashboard",      label: "Dashboard",        icon: LayoutDashboard },
    { id: "profil",         label: "Profil",           icon: User },
    { id: "contenus",       label: "Mes contenus",     icon: BookOpen },
    { id: "creer",          label: "Créer contenu",    icon: Plus },
    { id: "disponibilites", label: "Disponibilités",   icon: CalendarCheck },
    { id: "revenus",        label: "Ventes & revenus", icon: TrendingUp },
];

const STATS = [
    { label: "Revenus totaux",    value: "2 840€", icon: TrendingUp,  color: "bg-[#eef5fb] text-[#01509d]" },
    { label: "Total élèves",      value: "12",      icon: Users,       color: "bg-purple-50 text-purple-600" },
    { label: "Formations créées", value: "28",      icon: BookOpen,    color: "bg-yellow-50 text-yellow-600" },
    { label: "Satisfaction",      value: "4.8/5",   icon: Star,        color: "bg-green-50 text-green-600" },
];

const ACTIONS = [
    { label: "Créer un cours",       icon: Video,      color: "bg-[#eef5fb]", iconColor: "text-[#01509d]",   href: "/apprendre" },
    { label: "Créer une formation",  icon: BookMarked, color: "bg-purple-50",  iconColor: "text-purple-600",  href: "/apprendre" },
    { label: "Créer un guide",       icon: FileText,   color: "bg-yellow-50",  iconColor: "text-yellow-600",  href: "/apprendre/guides" },
    { label: "Gérer disponibilités", icon: Calendar,   color: "bg-green-50",   iconColor: "text-green-600",   href: "#disponibilites" },
];

const CONTENUS_RECENTS = [
    { title: "Stratégies Lugia VStar",       type: "Cours",    eleves: 5, rating: 4.9, status: "Publié" },
    { title: "Maîtriser le format Expanded", type: "Guide",    eleves: 3, rating: 4.8, status: "Publié" },
    { title: "Guide du jeu de Deck",         type: "Coaching", eleves: 1, rating: 5.0, status: "En cours" },
    { title: "Formation complète Débutant",  type: "Cours",    eleves: 8, rating: 4.7, status: "Publié" },
];

const SESSIONS = [
    { name: "Louis HMYI",    date: "15 avr", heure: "14h00" },
    { name: "Sarah Dessaux", date: "16 avr", heure: "10h00" },
    { name: "Alex Mirous",   date: "18 avr", heure: "16h30" },
];

const STATUS_STYLE: Record<string, string> = {
    "Publié":   "bg-green-50 text-green-600",
    "En cours": "bg-[#eef5fb] text-[#01509d]",
    "Brouillon":"bg-gray-100 text-[#808896]",
};

const REVENUE_POINTS = [320, 480, 390, 620, 580, 710, 680, 820, 760, 940, 880, 1060];

function Sparkline({ points }: { points: number[] }) {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const w = 300; const h = 80; const pad = 8;
    const coords = points.map((p, i) => `${pad + (i / (points.length - 1)) * (w - pad * 2)},${pad + ((max - p) / range) * (h - pad * 2)}`);
    const areaPath = `M ${coords[0]} L ${coords.join(" L ")} L ${pad + (w - pad * 2)},${h - pad} L ${pad},${h - pad} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
            <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#01509d" stopOpacity="0.25" /><stop offset="100%" stopColor="#01509d" stopOpacity="0" /></linearGradient></defs>
            <path d={areaPath} fill="url(#grad)" />
            <polyline points={coords.join(" ")} fill="none" stroke="#01509d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ─── Tab: Dashboard ─── */

function DashboardTab({ setTab }: { setTab: (t: string) => void }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 border border-[#e5e7eb] shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                        <p className="font-['Poppins'] font-bold text-2xl text-[#140759]">{value}</p>
                        <p className="text-xs text-[#808896] mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="font-['Inter'] font-bold text-[#140759] mb-4">Actions rapides</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {ACTIONS.map(({ label, icon: Icon, color, iconColor, href }) => (
                        <Link key={label} href={href} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex flex-col items-start gap-3 hover:shadow-md transition-shadow group">
                            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}><Icon className={`w-5 h-5 ${iconColor}`} /></div>
                            <p className="font-['Inter'] font-semibold text-sm text-[#140759] leading-snug">{label}</p>
                            <span className="text-xs text-[#01509d] font-semibold group-hover:underline flex items-center gap-1">Continuer <ChevronRight className="w-3 h-3" /></span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                        <h3 className="font-['Inter'] font-bold text-[#140759]">Mes contenus récents</h3>
                        <button onClick={() => setTab("cours")} className="text-xs text-[#01509d] font-semibold hover:underline flex items-center gap-1">Tout voir <ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <table className="w-full">
                        <thead><tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                            {["Titre", "Type", "Élèves", "Note", "Statut"].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#808896]">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {CONTENUS_RECENTS.map((c, i) => (
                                <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#f9fafb]">
                                    <td className="px-5 py-4 text-sm font-semibold text-[#140759] max-w-[180px] truncate">{c.title}</td>
                                    <td className="px-5 py-4 text-xs text-[#808896]">{c.type}</td>
                                    <td className="px-5 py-4 text-xs text-[#808896]">{c.eleves}</td>
                                    <td className="px-5 py-4"><span className="flex items-center gap-1 text-xs text-[#808896]"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating}</span></td>
                                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[c.status] ?? ""}`}>{c.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
                        <h3 className="font-['Inter'] font-bold text-[#140759]">Sessions à venir</h3>
                        <button className="text-xs text-[#01509d] font-semibold hover:underline"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <ul className="divide-y divide-[#e5e7eb]">
                        {SESSIONS.map((s, i) => (
                            <li key={i} className="flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#01509d] to-[#140759] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{s.name.charAt(0)}</div>
                                    <div><p className="text-xs font-semibold text-[#140759]">{s.name}</p><p className="text-[10px] text-[#808896]">{s.heure}</p></div>
                                </div>
                                <span className="text-xs font-bold text-[#01509d] bg-[#eef5fb] px-2 py-0.5 rounded-full">{s.date}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Inter'] font-bold text-[#140759]">Revenus</h3>
                    <span className="text-xs text-[#808896]">12 derniers mois</span>
                </div>
                <div className="flex items-end gap-6">
                    <div className="flex-1">
                        <Sparkline points={REVENUE_POINTS} />
                        <div className="flex justify-between mt-1">
                            {["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"].map((m) => (
                                <span key={m} className="text-[9px] text-[#808896]">{m}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-[#808896] mb-1">Ce mois</p>
                        <p className="font-['Poppins'] font-bold text-xl text-[#140759]">1 060€</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">+20% vs mois dernier</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Tab: Profil ─── */

/* ─── Tab: Profil (validation status) ─── */

function ProfilTab({ setTab }: { setTab: (t: string) => void }) {
    return (
        <div className="space-y-6">

            {/* Profil validé */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-2">Profil validé</h2>
                <p className="text-sm text-[#808896] mb-6">Vous pouvez maintenant créer des contenus et proposer du coaching.</p>
                <button onClick={() => setTab("creer")} className="h-11 px-6 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                    Créer mon premier contenu
                </button>
            </div>

            {/* Détails + Aide */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Détails candidature */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-5">Détails de la candidature</h3>
                    <div className="space-y-3 text-sm">
                        <div><p className="text-xs text-[#808896] mb-0.5">Nom complet</p><p className="font-semibold text-[#140759]">Alexandre Martin</p></div>
                        <div><p className="text-xs text-[#808896] mb-0.5">Spécialité</p><p className="font-semibold text-[#140759]">Stratégie compétitive &amp; Deck building</p></div>
                        <div><p className="text-xs text-[#808896] mb-0.5">Date de soumission</p><p className="font-semibold text-[#140759]">15 mars 2024</p></div>
                        <div>
                            <p className="text-xs text-[#808896] mb-1">Statut actuel</p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" /> Validé
                            </span>
                        </div>
                    </div>
                </div>

                {/* Besoin d'aide */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-5">Besoin d&apos;aide ?</h3>
                    <p className="text-xs text-[#808896] mb-4">Notre équipe support est là pour vous accompagner dans votre parcours de validation.</p>
                    <div className="space-y-2">
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb] hover:border-[#01509d] hover:bg-[#f9fafb] transition-colors group">
                            <LifeBuoy className="w-4 h-4 text-[#01509d]" />
                            <span className="text-sm font-semibold text-[#140759]">Contacter le support</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb] hover:border-[#01509d] hover:bg-[#f9fafb] transition-colors group">
                            <HelpCircle className="w-4 h-4 text-[#01509d]" />
                            <span className="text-sm font-semibold text-[#140759]">FAQ validation</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Historique de validation */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-6">Historique de validation</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { label: "Profil validé",      date: "18 mars 2024 – 14:30", icon: CheckCircle, color: "bg-green-100 text-green-500" },
                        { label: "Examen en cours",    date: "16 mars 2024 – 08:11", icon: Clock,        color: "bg-blue-50 text-[#01509d]" },
                        { label: "Candidature soumise",date: "15 mars 2024 – 08:43", icon: Users,        color: "bg-gray-100 text-[#808896]" },
                    ].map(({ label, date, icon: Icon, color }) => (
                        <div key={label} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#140759]">{label}</p>
                                <p className="text-xs text-[#808896] mt-0.5">{date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Tab: Mes contenus ─── */

const MES_CONTENUS = [
    { title: "Les bases du TCG Pokémon",    sub: "Introduction complète aux règles", type: "Cours",     statut: "Publié",    date: "15 Nov 2023", ventes: 24 },
    { title: "Stratégies avancées",         sub: "Guide pour joueurs expérimentés",  type: "Guide",     statut: "En attente", date: "12 Nov 2023", ventes: null },
    { title: "Formation complète débutant", sub: "Programme de 6 semaines",          type: "Formation", statut: "Brouillon", date: "08 Nov 2023", ventes: null },
];

const TYPE_STYLE: Record<string, string> = {
    "Cours":     "bg-[#eef5fb] text-[#01509d]",
    "Guide":     "bg-yellow-50 text-yellow-700",
    "Formation": "bg-purple-50 text-purple-600",
    "Coaching":  "bg-green-50 text-green-600",
};

const STATUT_DOT: Record<string, string> = {
    "Publié":     "bg-green-500",
    "En attente": "bg-orange-400",
    "Brouillon":  "bg-gray-400",
};

function MesContenus() {
    const [typeFilter,   setTypeFilter]   = useState("Tous les types");
    const [statutFilter, setStatutFilter] = useState("Tous les statuts");
    const [search, setSearch] = useState("");

    const filtered = MES_CONTENUS.filter((c) => {
        const q = search.toLowerCase();
        return (
            (typeFilter === "Tous les types" || c.type === typeFilter) &&
            (statutFilter === "Tous les statuts" || c.statut === statutFilter) &&
            (!q || c.title.toLowerCase().includes(q))
        );
    });

    return (
        <div className="space-y-5">
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {[
                    { value: typeFilter,   options: ["Tous les types","Cours","Guide","Formation","Coaching"], setter: setTypeFilter },
                    { value: statutFilter, options: ["Tous les statuts","Publié","En attente","Brouillon"],    setter: setStatutFilter },
                ].map(({ value, options, setter }, i) => (
                    <div key={i} className="relative">
                        <select value={value} onChange={(e) => setter(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none">
                            {options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                    </div>
                ))}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un contenu..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] text-[#140759] placeholder:text-[#9ca3af]" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        {["Titre", "Type", "Statut", "Date de création", "Ventes", "Actions"].map((h) => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#808896] whitespace-nowrap">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {filtered.map((c, i) => (
                            <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#f9fafb] transition-colors">
                                <td className="px-5 py-4">
                                    <p className="text-sm font-semibold text-[#140759]">{c.title}</p>
                                    <p className="text-xs text-[#808896] mt-0.5">{c.sub}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TYPE_STYLE[c.type] ?? ""}`}>{c.type}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#140759]">
                                        <span className={`w-2 h-2 rounded-full ${STATUT_DOT[c.statut] ?? "bg-gray-400"}`} />
                                        {c.statut}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-xs text-[#808896] whitespace-nowrap">{c.date}</td>
                                <td className="px-5 py-4 text-sm font-semibold text-[#140759]">{c.ventes ?? "—"}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="w-7 h-7 rounded-lg hover:bg-[#eef5fb] flex items-center justify-center transition-colors"><Edit2 className="w-3.5 h-3.5 text-[#01509d]" /></button>
                                        <button className="w-7 h-7 rounded-lg hover:bg-[#eef5fb] flex items-center justify-center transition-colors"><Eye className="w-3.5 h-3.5 text-[#01509d]" /></button>
                                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[#808896]">Aucun contenu trouvé.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PlaceholderTab({ label }: { label: string }) {
    return (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center text-[#808896]">
            <p className="text-sm">Section <strong>{label}</strong> — bientôt disponible.</p>
        </div>
    );
}

/* ─── Page ─── */

export default function EspaceProfesseurPage() {
    const [tab, setTab] = useState("dashboard");

    const content: Record<string, React.ReactNode> = {
        dashboard:      <DashboardTab setTab={setTab} />,
        profil:         <ProfilTab setTab={setTab} />,
        contenus:       <MesContenus />,
        creer:          <CreerContenu setTab={setTab} />,
        disponibilites: <Disponibilites />,
        revenus:        <VentesRevenus />,
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <div className="flex gap-8">

                    {/* Sidebar */}
                    <aside className="w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm sticky top-6">
                            <div className="px-5 py-5 border-b border-[#e5e7eb]">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#01509d] to-[#140759] flex items-center justify-center mb-3">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <p className="font-['Inter'] font-bold text-sm text-[#140759]">Académie des Dresseurs</p>
                                <p className="text-xs text-[#808896]">Professeur vérifié</p>
                            </div>
                            <nav className="py-2">
                                {TABS.map(({ id, label, icon: Icon }) => (
                                    <button key={id} onClick={() => setTab(id)}
                                        className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${tab === id ? "bg-[#eef5fb] text-[#01509d] font-bold border-r-2 border-[#01509d]" : "text-[#808896] hover:text-[#140759] hover:bg-gray-50"}`}>
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                            <div className="px-5 py-4 border-t border-[#e5e7eb]">
                                <Link href="/apprendre" className="flex items-center gap-2 text-xs text-[#01509d] font-semibold hover:underline">
                                    <ExternalLink className="w-3.5 h-3.5" /> Voir votre profil
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759]">
                                    {tab === "profil" ? "Mon profil" : tab === "contenus" ? "Mes contenus" : "Dashboard Professeur"}
                                </h1>
                                <p className="text-sm text-[#808896] mt-0.5">
                                    {tab === "profil" ? "Gérez vos informations personnelles" : tab === "contenus" ? "Gérez vos cours, guides et formations." : "Gérez vos contenus et vos sessions"}
                                </p>
                            </div>
                            <Link href="/espace-joueur" className="text-xs text-[#01509d] font-semibold hover:underline flex items-center gap-1">
                                Espace joueur <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        {content[tab]}
                    </div>
                </div>
            </div>
        </div>
    );
}
