"use client";

import { useState, useEffect } from "react";
import { apiGet } from "../lib/apiClient";
import Navbar from "../components/Navbar";
import {
    LayoutDashboard, Users, ShoppingBag, ShoppingCart, UserCheck,
    Tag, TrendingUp, BookOpen, AlertTriangle, CheckCircle, Info,
    FileText, Star, ChevronRight,
} from "lucide-react";
import ProfesseursCandidatures from "./ProfesseursCandidatures";
import ContenusSoumis          from "./ContenusSoumis";
import BoutiqueAdmin           from "./BoutiqueAdmin";
import CommandesAdmin          from "./CommandesAdmin";
import UtilisateursAdmin       from "./UtilisateursAdmin";
import BonsDeReduction         from "./BonsDeReduction";

/* ─── Sidebar nav ─── */
const SIDEBAR_TABS = [
    { id: "dashboard",   label: "Dashboard",        icon: LayoutDashboard },
    { id: "professeurs", label: "Professeurs",      icon: UserCheck },
    { id: "contenus",    label: "Contenus",         icon: BookOpen },
    { id: "boutique",    label: "Boutique",         icon: ShoppingBag },
    { id: "commandes",   label: "Commandes",        icon: ShoppingCart },
    { id: "utilisateurs",label: "Utilisateurs",     icon: Users },
    { id: "reductions",  label: "Bons de réduction",icon: Tag },
];

/* ─── Dashboard data ─── */
const STATS = [
    { icon: Users,       iconBg: "bg-[#eef5fb]",  iconColor: "text-[#01509d]",  label: "Utilisateurs inscrits", value: "2 847", delta: "+8.2%",  up: true },
    { icon: UserCheck,   iconBg: "bg-green-50",    iconColor: "text-green-600",  label: "Professeurs actifs",    value: "156",   delta: "+3.1%",  up: true },
    { icon: BookOpen,    iconBg: "bg-purple-50",   iconColor: "text-purple-600", label: "Contenus publiés",      value: "1 234", delta: "+12.4%", up: true },
    { icon: ShoppingCart,iconBg: "bg-yellow-50",   iconColor: "text-yellow-600", label: "Commandes totales",     value: "8 592", delta: "+5.7%",  up: true },
];

const CHART_DATA  = [320, 580, 900, 1200, 1500, 1850, 1700, 2050, 2300, 2550, 2750, 3050];
const MONTHS      = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const Y_TICKS     = [500, 1000, 1500, 2000, 2500, 3000];

const ACTIVITES = [
    { icon: Users,       iconBg: "bg-green-100",  iconColor: "text-green-600",  title: "Nouvel utilisateur inscrit",  desc: "12 nouvelles inscriptions aujourd'hui" },
    { icon: ShoppingCart,iconBg: "bg-blue-100",   iconColor: "text-[#01509d]",  title: "Nouvelle commande",           desc: "4 nouvelles commandes ce matin" },
    { icon: AlertTriangle,iconBg:"bg-orange-100", iconColor: "text-orange-500", title: "Contenu signalé",             desc: "1 contenu signalé par la communauté" },
    { icon: UserCheck,   iconBg: "bg-purple-100", iconColor: "text-purple-600", title: "Candidature professeur",      desc: "2 candidatures en attente de validation" },
];

const ACTIONS = [
    { icon: FileText,    iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]", label: "Valider contenu" },
    { icon: UserCheck,   iconBg: "bg-green-50",  iconColor: "text-green-600", label: "Gérer professeurs" },
    { icon: ShoppingCart,iconBg: "bg-yellow-50", iconColor: "text-yellow-600",label: "Gérer commandes" },
    { icon: Users,       iconBg: "bg-purple-50", iconColor: "text-purple-600",label: "Gérer utilisateurs" },
];

const ALERTES = [
    { icon: AlertTriangle, bg: "bg-orange-50", border: "border-orange-200", iconColor: "text-orange-500", title: "Contenus en attente",          desc: "3 contenus disponibles à examiner" },
    { icon: Info,          bg: "bg-[#eef5fb]", border: "border-blue-200",   iconColor: "text-[#01509d]",  title: "Candidatures professeur",      desc: "5 nouvelles candidatures à examiner" },
    { icon: AlertTriangle, bg: "bg-red-50",    border: "border-red-200",    iconColor: "text-red-500",    title: "Commandes problématiques",     desc: "2 commandes nécessitent une vérification" },
];

/* ─── Revenue chart ─── */
function RevenueChart() {
    const W = 460, H = 160, PL = 40, PR = 12, PT = 10, PB = 24;
    const maxVal = 3500;
    const plotW  = W - PL - PR;
    const plotH  = H - PT - PB;
    const cx = (i: number) => PL + (i / (CHART_DATA.length - 1)) * plotW;
    const cy = (v: number) => PT + plotH - (v / maxVal) * plotH;
    const pts = CHART_DATA.map((v, i) => ({ x: cx(i), y: cy(v) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const cpx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.5;
        d += ` C ${cpx} ${pts[i - 1].y}, ${cpx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const area = `${d} L ${pts[pts.length - 1].x} ${PT + plotH} L ${pts[0].x} ${PT + plotH} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
            <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#01509d" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#01509d" stopOpacity="0" />
                </linearGradient>
            </defs>
            {Y_TICKS.map(t => (
                <g key={t}>
                    <line x1={PL} y1={cy(t)} x2={W - PR} y2={cy(t)} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={PL - 6} y={cy(t) + 4} textAnchor="end" fontSize="8" fill="#9ca3af">{t}</text>
                </g>
            ))}
            <path d={area} fill="url(#ag)" />
            <path d={d} fill="none" stroke="#01509d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {MONTHS.map((m, i) => (
                <text key={m} x={cx(i)} y={H - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">{m}</text>
            ))}
        </svg>
    );
}

/* ─── Dashboard tab ─── */
function DashboardTab() {
    const [apiStats, setApiStats] = useState<{ users: number; professors: number; orders: number; contents: number } | null>(null);

    useEffect(() => {
        apiGet<{ users: number; professors: number; orders: number; contents: number }>('/admin/stats')
            .then(setApiStats)
            .catch(() => {});
    }, []);

    const displayStats = STATS.map((s, i) => {
        if (!apiStats) return s;
        const vals = [apiStats.users, apiStats.professors, apiStats.contents, apiStats.orders];
        return { ...s, value: vals[i].toLocaleString('fr-FR') };
    });

    return (
        <div className="space-y-6">

            {/* 4 stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayStats.map(({ icon: Icon, iconBg, iconColor, label, value, delta, up }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{delta}</span>
                        </div>
                        <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                        <p className="text-xs text-[#808896] mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Activité récente */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Revenus plateforme</h3>
                    <div className="h-[160px]"><RevenueChart /></div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Activité récente</h3>
                    <div className="space-y-4">
                        {ACTIVITES.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
                            <div key={title} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-4 h-4 ${iconColor}`} />
                                </div>
                                <div>
                                    <p className="font-semibold text-xs text-[#140759]">{title}</p>
                                    <p className="text-xs text-[#808896]">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions rapides + Alertes */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Actions rapides</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {ACTIONS.map(({ icon: Icon, iconBg, iconColor, label }) => (
                            <button key={label}
                                className="flex items-center gap-3 p-4 rounded-xl border border-[#e5e7eb] hover:border-[#01509d]/40 hover:bg-[#f9fafb] transition-colors text-left">
                                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <span className="font-['Inter'] font-semibold text-sm text-[#140759]">{label}</span>
                                <ChevronRight className="w-4 h-4 text-[#808896] ml-auto" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Alertes importantes</h3>
                    <div className="space-y-3">
                        {ALERTES.map(({ icon: Icon, bg, border, iconColor, title, desc }) => (
                            <div key={title} className={`flex items-start gap-3 p-3 rounded-xl ${bg} border ${border}`}>
                                <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
                                <div>
                                    <p className="font-semibold text-xs text-[#140759]">{title}</p>
                                    <p className="text-xs text-[#808896] mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
const BOUTIQUE_SUBS = [
    { id: "produits" as const, label: "Gestion des produits" },
    { id: "stocks"   as const, label: "Gestion des stocks" },
];

export default function AdminPage() {
    const [tab,        setTab]        = useState("dashboard");
    const [boutiqueSub,setBoutiqueSub]= useState<"produits" | "stocks">("produits");
    const [addMode,    setAddMode]    = useState(false);

    const TITLES: Record<string, string> = {
        dashboard:    "Dashboard Admin",
        professeurs:  "Candidatures professeurs",
        contenus:     "Contenus soumis",
        boutique:     addMode ? "Ajouter un produit" : boutiqueSub === "produits" ? "Gestion des produits" : "Gestion des stocks",
        commandes:    "Commandes",
        utilisateurs: "Utilisateurs",
        reductions:   "Bons de réduction",
    };
    const SUBS: Record<string, string> = {
        dashboard:    "Vue globale de la plateforme",
        professeurs:  "Gérez les demandes pour devenir professeur",
        contenus:     "Gérez et validez les contenus",
        boutique:     addMode ? "Remplissez les informations du nouveau produit." : "Administrez les produits de la boutique.",
        commandes:    "Gérez les commandes de la plateforme.",
        utilisateurs: "Gérez les utilisateurs",
        reductions:   "Gérez les bons de réduction",
    };

    const content: Record<string, React.ReactNode> = {
        dashboard:    <DashboardTab />,
        professeurs:  <ProfesseursCandidatures />,
        contenus:     <ContenusSoumis />,
        boutique:     <BoutiqueAdmin sub={boutiqueSub} setSub={setBoutiqueSub} addMode={addMode} setAddMode={setAddMode} />,
        commandes:    <CommandesAdmin />,
        utilisateurs: <UtilisateursAdmin />,
        reductions:   <BonsDeReduction />,
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <div className="flex gap-8">

                    {/* Sidebar */}
                    <aside className="w-52 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 sticky top-24">
                            <div className="mb-5 px-2">
                                <p className="font-['Poppins'] font-bold text-sm text-[#140759]">Académie des Dresseurs</p>
                            </div>
                            <nav className="space-y-1">
                                {SIDEBAR_TABS.map(({ id, label, icon: Icon }) => (
                                    <div key={id}>
                                        <button onClick={() => setTab(id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-['Inter'] font-medium transition-colors ${tab === id ? "bg-[#01509d] text-white" : "text-[#808896] hover:bg-[#f9fafb] hover:text-[#140759]"}`}>
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            {label}
                                        </button>
                                        {/* Boutique sub-items */}
                                        {id === "boutique" && tab === "boutique" && (
                                            <div className="ml-7 mt-1 space-y-0.5">
                                                {BOUTIQUE_SUBS.map(s => (
                                                    <button key={s.id} onClick={() => setBoutiqueSub(s.id)}
                                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-['Inter'] font-medium transition-colors ${boutiqueSub === s.id ? "bg-[#eef5fb] text-[#01509d] font-semibold" : "text-[#808896] hover:bg-[#f9fafb] hover:text-[#140759]"}`}>
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759]">{TITLES[tab]}</h1>
                                <p className="text-sm text-[#808896] mt-1">{SUBS[tab]}</p>
                            </div>
                            {tab === "boutique" && !addMode && (
                                <div className="flex items-center gap-2">
                                    <button className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
                                        + Importer des cartes
                                    </button>
                                    <button onClick={() => setAddMode(true)}
                                        className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
                                        + Ajouter produit
                                    </button>
                                </div>
                            )}
                        </div>
                        {content[tab]}
                    </main>
                </div>
            </div>
        </div>
    );
}
