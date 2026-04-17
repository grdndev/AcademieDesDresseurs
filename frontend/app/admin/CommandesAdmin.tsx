"use client";

import { useState } from "react";
import {
    Search, Eye, Edit2, Truck, ChevronLeft, ChevronRight,
    ShoppingCart, CheckCircle, Clock, XCircle, Bell, X,
} from "lucide-react";

/* ─── Types ─── */
type Statut = "Commande passée" | "En préparation" | "En attente" | "Livrée" | "Annulée";

interface Commande {
    id: string; client: string; email: string;
    date: string; articles: number; montant: string;
    statut: Statut;
}

/* ─── Mock data ─── */
const COMMANDES: Commande[] = [
    { id: "#ORD-2024-001", client: "Marie Dubois",    email: "marie.dubois@gmail.com",    date: "15/03/2024", articles: 3, montant: "€89,99",  statut: "Commande passée" },
    { id: "#ORD-2024-002", client: "Lucas Martin",    email: "lucas.martin@gmail.com",    date: "14/03/2024", articles: 1, montant: "€45,50",  statut: "En préparation" },
    { id: "#ORD-2024-003", client: "Sophie Leray",    email: "sophie.leray@gmail.com",    date: "13/03/2024", articles: 5, montant: "€156,75", statut: "En attente" },
    { id: "#ORD-2024-004", client: "Antoine Moreau",  email: "antoine.moreau@gmail.com",  date: "12/03/2024", articles: 2, montant: "€67,25",  statut: "Commande passée" },
    { id: "#ORD-2024-005", client: "Emma Petit",      email: "emma.petit@gmail.com",      date: "11/03/2024", articles: 4, montant: "€123,99", statut: "En préparation" },
];

const PRODUCTS_DETAIL = [
    { name: "Booster Pokémon Écarlate & Violet", sub: "Série 4 - Paradoxe Temporel", qty: 3,  unitPrice: "€4,50",  total: "€13,50",  bg: "bg-yellow-100" },
    { name: "Deck Elite Trainer Box",             sub: "Collection Charizard EX",    qty: 1,  unitPrice: "€89,99", total: "€89,99",  bg: "bg-purple-100" },
    { name: "Protège-cartes Premium",             sub: "Pack de 65 pièces",          qty: 2,  unitPrice: "€12,00", total: "€24,00",  bg: "bg-green-100" },
];

/* ─── Shared ─── */
const STATUT_STYLE: Record<Statut, string> = {
    "Commande passée": "bg-green-50 text-green-600",
    "En préparation":  "bg-blue-50 text-blue-600",
    "En attente":      "bg-orange-50 text-orange-600",
    "Livrée":          "bg-green-50 text-green-700",
    "Annulée":         "bg-red-50 text-red-500",
};
const STATUT_DOT: Record<Statut, string> = {
    "Commande passée": "bg-green-500",
    "En préparation":  "bg-blue-500",
    "En attente":      "bg-orange-500",
    "Livrée":          "bg-green-600",
    "Annulée":         "bg-red-500",
};

/* ─── Detail view ─── */
function DetailView({ c, onBack }: { c: Commande; onBack: () => void }) {
    const TIMELINE = [
        { label: "Commande passée", date: "15 mars 2024, 14:30", done: true,  dot: "bg-green-500" },
        { label: "Paiement validé",  date: "15 mars 2024, 14:35", done: true,  dot: "bg-green-500" },
        { label: "En préparation",   date: "16 mars 2024, 09:15", done: true,  dot: "bg-orange-500" },
        { label: "Expédition",       date: "En attente",          done: false, dot: "bg-[#e5e7eb]" },
        { label: "Livraison",        date: "En attente",          done: false, dot: "bg-[#e5e7eb]" },
    ];

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour à la liste
            </button>

            {/* Summary header cards */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <div className="grid grid-cols-4 gap-6 text-xs">
                    {[
                        { label: "Numéro commande", value: "CMD-2024-0847" },
                        { label: "Date",             value: "15 mars 2024" },
                        { label: "Montant total",    value: "€127,50" },
                        { label: "Méthode de paiement", value: "Carte bancaire — Visa" },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-[#808896] mb-1">{label}</p>
                            <p className="font-['Inter'] font-bold text-sm text-[#140759]">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3-col: client | gestion | chronologie */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Informations client */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Informations client</h3>
                    <div className="space-y-3 text-xs">
                        <div>
                            <p className="text-[#808896] mb-0.5">Nom client</p>
                            <p className="font-semibold text-[#140759]">Lucas Moreau</p>
                        </div>
                        <div>
                            <p className="text-[#808896] mb-0.5">Email</p>
                            <p className="font-semibold text-[#140759]">lucas.moreau@email.com</p>
                        </div>
                        <div>
                            <p className="text-[#808896] mb-0.5">Adresse de livraison</p>
                            <p className="font-semibold text-[#140759] leading-relaxed">
                                42 Rue des Pokémon<br />75001 Paris<br />France
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gestion commande */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Gestion commande</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#140759] mb-1.5">Changer statut</label>
                            <select className="w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                                {["En préparation", "Commande passée", "En attente", "Expédiée", "Livrée"].map(s => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <button className="w-full h-10 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Bell className="w-4 h-4" /> Envoyer notification
                        </button>
                        <button className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                            <X className="w-4 h-4" /> Annuler commande
                        </button>
                    </div>
                </div>

                {/* Chronologie */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Chronologie</h3>
                    <div className="space-y-4">
                        {TIMELINE.map(({ label, date, done, dot }) => (
                            <div key={label} className="flex items-start gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${dot} mt-1 flex-shrink-0`} />
                                <div>
                                    <p className={`text-xs font-semibold ${done ? "text-[#140759]" : "text-[#9ca3af]"}`}>{label}</p>
                                    <p className="text-xs text-[#808896]">{date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Produits commandés */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Produits commandés</h3>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-[#e5e7eb]">
                            <th className="pb-3 text-left font-semibold text-[#808896]">Produit</th>
                            <th className="pb-3 text-right font-semibold text-[#808896]">Quantité</th>
                            <th className="pb-3 text-right font-semibold text-[#808896]">Prix unitaire</th>
                            <th className="pb-3 text-right font-semibold text-[#808896]">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PRODUCTS_DETAIL.map((p, i) => (
                            <tr key={i} className="border-b border-[#f3f4f6] last:border-0">
                                <td className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg ${p.bg} flex items-center justify-center text-base flex-shrink-0`}>🃏</div>
                                        <div>
                                            <p className="font-semibold text-[#140759]">{p.name}</p>
                                            <p className="text-[#9ca3af]">{p.sub}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-right text-[#140759] font-semibold">{p.qty}</td>
                                <td className="py-3 text-right text-[#140759]">{p.unitPrice}</td>
                                <td className="py-3 text-right font-bold text-[#140759]">{p.total}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-[#e5e7eb]">
                            <td colSpan={3} className="pt-4 text-right text-xs font-bold text-[#140759]">Total commande :</td>
                            <td className="pt-4 text-right font-['Poppins'] font-bold text-base text-[#140759]">€127,50</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

/* ─── Main ─── */
export default function CommandesAdmin() {
    const [selected, setSelected] = useState<Commande | null>(null);
    const [checked,  setChecked]  = useState<string[]>([]);

    if (selected) return <DetailView c={selected} onBack={() => setSelected(null)} />;

    function toggleCheck(id: string) {
        setChecked(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    }

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: ShoppingCart, iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]",  label: "Total",      value: "1 247" },
                    { icon: Clock,        iconBg: "bg-orange-50",  iconColor: "text-orange-500", label: "En cours",   value: "89" },
                    { icon: CheckCircle,  iconBg: "bg-green-50",   iconColor: "text-green-600",  label: "Livrées",    value: "1 134" },
                    { icon: XCircle,      iconBg: "bg-red-50",     iconColor: "text-red-500",    label: "Annulées",   value: "24" },
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

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="relative flex-1 min-w-[160px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                        <input type="text" placeholder="Rechercher une commande…"
                            className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
                    </div>
                    <select className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                        {["Tous les statuts", "Commande passée", "En préparation", "En attente", "Livrée", "Annulée"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <button className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Générer les bons d&apos;envoi
                    </button>
                    <button className="h-9 px-4 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                        Changer de statut
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                        <select className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none cursor-pointer">
                            {["Derniers 30 jours", "7 jours", "3 mois"].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <button className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors">
                            + Exporter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                <th className="pb-3 pr-3 w-8" />
                                {["Numéro", "Client", "Date", "Produits", "Montant", "Statut", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {COMMANDES.map(c => (
                                <tr key={c.id} className={`border-b border-[#f3f4f6] last:border-0 ${checked.includes(c.id) ? "bg-[#eef5fb]" : ""}`}>
                                    <td className="py-3 pr-3">
                                        <input type="checkbox" checked={checked.includes(c.id)} onChange={() => toggleCheck(c.id)}
                                            className="w-4 h-4 rounded accent-[#01509d] cursor-pointer" />
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span className="font-bold text-[#01509d] cursor-pointer hover:underline" onClick={() => setSelected(c)}>{c.id}</span>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <p className="font-semibold text-[#140759]">{c.client}</p>
                                        <p className="text-[#9ca3af]">{c.email}</p>
                                    </td>
                                    <td className="py-3 pr-3 text-[#808896] whitespace-nowrap">{c.date}</td>
                                    <td className="py-3 pr-3 text-[#140759]">{c.articles} article{c.articles > 1 ? "s" : ""}</td>
                                    <td className="py-3 pr-3 font-bold text-[#140759]">{c.montant}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[c.statut]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[c.statut]}`} />
                                            {c.statut}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setSelected(c)} className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Edit2 className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Truck className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
                    <p className="text-xs text-[#808896]">Affichage de 1 à 5 sur 1 247 commandes</p>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50">
                            <ChevronLeft className="w-3.5 h-3.5 text-[#808896]" />
                        </button>
                        {[1, 2, 3].map(n => (
                            <button key={n} className={`w-7 h-7 text-xs rounded-lg font-semibold ${n === 1 ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#808896] hover:bg-gray-50"}`}>{n}</button>
                        ))}
                        <span className="text-xs text-[#808896] px-1">…</span>
                        <button className="w-7 h-7 text-xs rounded-lg border border-[#e5e7eb] text-[#808896] hover:bg-gray-50 font-semibold">42</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50">
                            <ChevronRight className="w-3.5 h-3.5 text-[#808896]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
