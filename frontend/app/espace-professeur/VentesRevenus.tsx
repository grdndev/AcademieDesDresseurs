"use client";

import { useState } from "react";
import { TrendingUp, ShoppingBag, Clock, Package, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

/* ─── Types ─── */
type SubTab = null | "actives" | "reussies" | "inactives";

/* ─── Sales mock data ─── */
const VENTES = [
    { product: "Coaching personnalisé",     sub: "1h de coaching",  type: "Coaching",  typeColor: "bg-yellow-50 text-yellow-700",  buyer: "Lucas Martin",  date: "15 Jan 2024, 14:00", amount: "45,00€" },
    { product: "Stratégies avancées TCG",   sub: "Cours avancé",    type: "Cours",     typeColor: "bg-blue-50 text-blue-600",      buyer: "Sophie Leray",  date: "15 Jan 2024",        amount: "29,00€" },
    { product: "Formation complète débutant",sub: "14 modules",     type: "Formation", typeColor: "bg-purple-50 text-purple-600",  buyer: "Thomas Petit",  date: "15 Jan 2024",        amount: "89,00€" },
    { product: "Coaching deck building",    sub: "1h de coaching",  type: "Coaching",  typeColor: "bg-yellow-50 text-yellow-700",  buyer: "Emma Rousseau", date: "16 Jan 2024, 10:10", amount: "35,00€" },
    { product: "Guide méta compétitif",     sub: "102 pages",       type: "Guide",     typeColor: "bg-green-50 text-green-700",   buyer: "Jules Bernard", date: "06 Jan 2024",        amount: "18,00€" },
];

const STATUTS: Record<NonNullable<SubTab>, { label: string; color: string }[]> = {
    actives:  [
        { label: "Actif en cours", color: "bg-blue-50 text-blue-600" },
        { label: "En cours",       color: "bg-sky-50 text-sky-600" },
        { label: "Remboursé",      color: "bg-orange-50 text-orange-600" },
        { label: "Actif en cours", color: "bg-blue-50 text-blue-600" },
        { label: "Non-actif",      color: "bg-gray-100 text-gray-500" },
    ],
    reussies: [
        { label: "Terminé", color: "bg-green-50 text-green-600" },
        { label: "Terminé", color: "bg-green-50 text-green-600" },
        { label: "Terminé", color: "bg-green-50 text-green-600" },
        { label: "Terminé", color: "bg-green-50 text-green-600" },
        { label: "Terminé", color: "bg-green-50 text-green-600" },
    ],
    inactives: [
        { label: "Annulé",    color: "bg-red-50 text-red-500" },
        { label: "Remboursé", color: "bg-orange-50 text-orange-600" },
        { label: "Annulé",    color: "bg-red-50 text-red-500" },
        { label: "Remboursé", color: "bg-orange-50 text-orange-600" },
        { label: "Annulé",    color: "bg-red-50 text-red-500" },
    ],
};

const SUB_TABS: { id: NonNullable<SubTab>; label: string; dot: string }[] = [
    { id: "actives",   label: "Ventes actives",   dot: "bg-blue-500" },
    { id: "reussies",  label: "Ventes réussies",  dot: "bg-green-500" },
    { id: "inactives", label: "Ventes inactives", dot: "bg-gray-400" },
];

/* ─── Sub-view stats ─── */
const SUB_STATS: Record<NonNullable<SubTab>, { icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: string }[]> = {
    actives: [
        { icon: TrendingUp,   iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]",  label: "Total ventes actives",  value: "32" },
        { icon: Clock,        iconBg: "bg-yellow-50",  iconColor: "text-yellow-600", label: "Revenus en cours",      value: "1 840€" },
        { icon: Package,      iconBg: "bg-purple-50",  iconColor: "text-purple-600", label: "Contenus actifs",       value: "12" },
    ],
    reussies: [
        { icon: CheckCircle,  iconBg: "bg-green-50",   iconColor: "text-green-600",  label: "Total ventes",          value: "127" },
        { icon: Package,      iconBg: "bg-[#eef5fb]",  iconColor: "text-[#01509d]",  label: "Revenus générés",       value: "3 250€" },
        { icon: ShoppingBag,  iconBg: "bg-purple-50",  iconColor: "text-purple-600", label: "Nombre d'achats",       value: "89" },
    ],
    inactives: [
        { icon: AlertTriangle,iconBg: "bg-red-50",     iconColor: "text-red-500",    label: "Total ventes inactives",value: "24" },
        { icon: XCircle,      iconBg: "bg-orange-50",  iconColor: "text-orange-600", label: "Montants expirés",      value: "1 240€" },
        { icon: Clock,        iconBg: "bg-[#eef5fb]",  iconColor: "text-[#01509d]",  label: "Données en parts",      value: "8" },
    ],
};

const SUB_TITLES: Record<NonNullable<SubTab>, { title: string; sub: string }> = {
    actives:   { title: "Ventes actives",   sub: "Gérez vos contenus actuellement en cours" },
    reussies:  { title: "Ventes réussies",  sub: "Historique des ventes réalisées" },
    inactives: { title: "Ventes inactives", sub: "Commandes annulées ou expirées" },
};

/* ─── Overview stats ─── */
const STATS = [
    { icon: "€",        iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]", label: "Revenus totaux",       value: "12 450€", delta: "+12.5%", up: true,  sub: "Depuis le début" },
    { icon: TrendingUp, iconBg: "bg-blue-50",    iconColor: "text-blue-500",  label: "Revenus du mois",      value: "2 890€",  delta: "+8.2%",  up: true,  sub: "Décembre 2024" },
    { icon: Clock,      iconBg: "bg-yellow-50",  iconColor: "text-yellow-600",label: "Paiements en attente", value: "450€",    delta: "— 0%",   up: null,  sub: "3 transactions" },
    { icon: ShoppingBag,iconBg: "bg-purple-50",  iconColor: "text-purple-600",label: "Total ventes",         value: "184",     delta: "+15.3%", up: true,  sub: "Tous produits confondus" },
];

const CHART_DATA = [420, 750, 1100, 1450, 1750, 2100, 1950, 2350, 2550, 2750, 2900, 3100];
const MONTHS     = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const Y_TICKS    = [500, 1000, 1500, 2000, 2500, 3000];

const TRANSACTIONS = [
    { date: "15 Déc 2024", product: "Stratégies avancées TCG",     type: "Cours",     typeColor: "bg-blue-50 text-blue-600",    amount: "89€",  status: "Payé",       sColor: "bg-green-50 text-green-600" },
    { date: "14 Déc 2024", product: "Formation complète débutant", type: "Formation", typeColor: "bg-purple-50 text-purple-600",amount: "149€", status: "Payé",       sColor: "bg-green-50 text-green-600" },
    { date: "13 Déc 2024", product: "Coaching personnalisé 1h",    type: "Coaching",  typeColor: "bg-yellow-50 text-yellow-700",amount: "75€",  status: "En attente", sColor: "bg-orange-50 text-orange-600" },
    { date: "12 Déc 2024", product: "Guide deck building expert",   type: "Guide",     typeColor: "bg-green-50 text-green-700",  amount: "29€",  status: "Payé",       sColor: "bg-green-50 text-green-600" },
    { date: "11 Déc 2024", product: "Stratégies avancées TCG",     type: "Cours",     typeColor: "bg-blue-50 text-blue-600",   amount: "89€",  status: "Annulé",     sColor: "bg-red-50 text-red-500" },
    { date: "10 Déc 2024", product: "Formation complète débutant", type: "Formation", typeColor: "bg-purple-50 text-purple-600",amount: "149€", status: "Payé",       sColor: "bg-green-50 text-green-600" },
];

/* ─── SVG Chart ─── */
function RevenueChart() {
    const W = 580, H = 180, PL = 44, PR = 12, PT = 12, PB = 28;
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
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#01509d" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#01509d" stopOpacity="0" />
                </linearGradient>
            </defs>
            {Y_TICKS.map(t => (
                <g key={t}>
                    <line x1={PL} y1={cy(t)} x2={W - PR} y2={cy(t)} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={PL - 6} y={cy(t) + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t}</text>
                </g>
            ))}
            <path d={area} fill="url(#rg)" />
            <path d={d} fill="none" stroke="#01509d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {MONTHS.map((m, i) => (
                <text key={m} x={cx(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{m}</text>
            ))}
        </svg>
    );
}

/* ─── Filters bar ─── */
function FiltersBar() {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-5">
            {[
                { label: "Type de contenu", opts: ["Tous les types", "Cours", "Coaching", "Formation", "Guide"] },
                { label: "Statut",          opts: ["Tous les statuts", "Actif", "Terminé", "Annulé", "Remboursé"] },
                { label: "Date",            opts: ["Toutes les dates", "Ce mois", "3 derniers mois"] },
            ].map(({ opts }) => (
                <select key={opts[0]} className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                    {opts.map(o => <option key={o}>{o}</option>)}
                </select>
            ))}
            <input type="text" placeholder="Rechercher une vente…"
                className="flex-1 min-w-[180px] h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
        </div>
    );
}

/* ─── Ventes table ─── */
function VentesTable({ subTab }: { subTab: NonNullable<SubTab> }) {
    const statuts = STATUTS[subTab];
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                    <thead>
                        <tr className="border-b border-[#e5e7eb]">
                            {["Produit", "Type", "Acheteur", "Date", "Statut", "Montant", "Actions"].map(h => (
                                <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3 last:pr-0">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {VENTES.map((v, i) => (
                            <tr key={i} className="border-b border-[#f3f4f6] last:border-0">
                                <td className="py-3 pr-3">
                                    <p className="font-semibold text-[#140759]">{v.product}</p>
                                    <p className="text-[#808896]">{v.sub}</p>
                                </td>
                                <td className="py-3 pr-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.typeColor}`}>{v.type}</span>
                                </td>
                                <td className="py-3 pr-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#e5e7eb] flex-shrink-0" />
                                        <span className="text-[#140759]">{v.buyer}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-3 text-[#808896] whitespace-nowrap">{v.date}</td>
                                <td className="py-3 pr-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statuts[i].color}`}>{statuts[i].label}</span>
                                </td>
                                <td className="py-3 pr-3 font-bold text-[#140759]">{v.amount}</td>
                                <td className="py-3">
                                    <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                        <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
                <p className="text-xs text-[#808896]">Affichage de 1 à 5 sur 5 ventes</p>
                <div className="flex items-center gap-2">
                    <button className="h-7 px-3 text-xs border border-[#e5e7eb] rounded-lg text-[#808896] hover:bg-gray-50">Précédent</button>
                    <button className="h-7 px-3 text-xs bg-[#01509d] text-white rounded-lg font-semibold hover:bg-[#014080]">Suivant</button>
                </div>
            </div>
        </>
    );
}

/* ─── Main ─── */
export default function VentesRevenus() {
    const [subTab, setSubTab] = useState<SubTab>(null);

    /* Sub-tab header (shared across all states) */
    const TabHeader = () => (
        <div className="flex items-center gap-4 mb-1">
            {SUB_TABS.map(t => (
                <button key={t.id} onClick={() => setSubTab(prev => prev === t.id ? null : t.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${subTab === t.id ? "text-[#140759]" : "text-[#808896] hover:text-[#140759]"}`}>
                    <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                    {t.label}
                </button>
            ))}
        </div>
    );

    /* ── Sub-view ── */
    if (subTab) {
        const { title, sub } = SUB_TITLES[subTab];
        const stats = SUB_STATS[subTab];
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="font-['Poppins'] font-bold text-xl text-[#140759]">{title}</h2>
                        <p className="text-xs text-[#808896] mt-0.5">{sub}</p>
                    </div>
                    <TabHeader />
                </div>

                {/* Mini stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    {stats.map(({ icon: Icon, iconBg, iconColor, label, value }) => (
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

                {/* Filters + table */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <FiltersBar />
                    <VentesTable subTab={subTab} />
                </div>
            </div>
        );
    }

    /* ── Overview ── */
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="font-['Poppins'] font-bold text-xl text-[#140759]">Ventes &amp; Revenus</h2>
                    <p className="text-xs text-[#808896] mt-0.5">Suivez vos gains et vos ventes</p>
                </div>
                <TabHeader />
            </div>

            {/* 4 stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(({ icon: Icon, iconBg, iconColor, label, value, delta, up, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                                {typeof Icon === "string"
                                    ? <span className={`text-base font-bold ${iconColor}`}>{Icon}</span>
                                    : <Icon className={`w-5 h-5 ${iconColor}`} />}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up === true ? "bg-green-50 text-green-600" : up === false ? "bg-red-50 text-red-500" : "bg-gray-100 text-[#808896]"}`}>
                                {delta}
                            </span>
                        </div>
                        <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                        <p className="text-xs text-[#808896] mt-0.5">{label}</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Revenus</h3>
                <div className="h-[180px]"><RevenueChart /></div>
            </div>

            {/* Transactions + wallet */}
            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Historique des transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[460px]">
                            <thead>
                                <tr className="border-b border-[#e5e7eb]">
                                    {["Date", "Produit", "Type", "Montant", "Statut"].map(h => (
                                        <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TRANSACTIONS.map((tx, i) => (
                                    <tr key={i} className="border-b border-[#f3f4f6] last:border-0">
                                        <td className="py-3 pr-3 text-[#808896] whitespace-nowrap">{tx.date}</td>
                                        <td className="py-3 pr-3 font-semibold text-[#140759]">{tx.product}</td>
                                        <td className="py-3 pr-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tx.typeColor}`}>{tx.type}</span></td>
                                        <td className="py-3 pr-3 font-bold text-[#140759]">{tx.amount}</td>
                                        <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tx.sColor}`}>{tx.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
                        <p className="text-xs text-[#808896]">Affichage de 6 sur 184 transactions</p>
                        <div className="flex items-center gap-2">
                            <button className="h-7 px-3 text-xs border border-[#e5e7eb] rounded-lg text-[#808896] hover:bg-gray-50">Précédent</button>
                            <button className="h-7 px-3 text-xs bg-[#01509d] text-white rounded-lg font-semibold hover:bg-[#014080]">Suivant</button>
                        </div>
                    </div>
                </div>

                {/* Wallet */}
                <div className="bg-[#01509d] rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-white/70" />
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wide">Solde disponible</span>
                    </div>
                    <p className="font-['Poppins'] font-bold text-3xl text-white">2 440€</p>
                    <button className="w-full h-11 bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                        Retirer mes gains
                    </button>
                    <p className="text-xs text-white/50 text-center -mt-3">Minimum retrait : 50€</p>
                    <div className="bg-white/10 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-white">Informations de paiement</p>
                        {[
                            { label: "Méthode",           value: "Virement bancaire" },
                            { label: "IBAN",              value: "FR76 **** 5432" },
                            { label: "Prochain paiement", value: "1er Jan 2025" },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-xs">
                                <span className="text-white/60">{label}</span>
                                <span className="text-white font-semibold">{value}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full h-9 border border-white/30 text-white font-['Inter'] font-semibold text-xs rounded-xl hover:bg-white/10 transition-colors">
                        Modifier les informations
                    </button>
                </div>
            </div>
        </div>
    );
}
