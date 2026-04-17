"use client";

import { useState } from "react";
import {
    Users, UserCheck, Wifi, ChevronLeft, ChevronRight,
    Edit2, Eye, MessageSquare, Plus, ShoppingCart,
    BookOpen, Star, Activity, Shield, Trash2, Bell,
} from "lucide-react";

/* ─── Types ─── */
type UserType   = "Joueur" | "Professeur" | "Admin";
type UserStatut = "Actif" | "Suspendu" | "Inactif";

interface Utilisateur {
    id: number; name: string; email: string;
    type: UserType; lastLogin: string; statut: UserStatut;
    country: string; joinDate: string;
}

/* ─── Mock data ─── */
const USERS: Utilisateur[] = [
    { id: 1, name: "Marie Dubois",    email: "marie.dubois@email.com",    type: "Professeur", lastLogin: "15 Jan 2024", statut: "Actif",    country: "France", joinDate: "01 Sep 2023" },
    { id: 2, name: "Thomas Martin",   email: "thomas.martin@email.com",   type: "Joueur",     lastLogin: "12 Jan 2024", statut: "Actif",    country: "France", joinDate: "15 Oct 2023" },
    { id: 3, name: "Pierre Rousseau", email: "pierre.rousseau@email.com", type: "Joueur",     lastLogin: "09 Jan 2024", statut: "Suspendu", country: "France", joinDate: "05 Nov 2023" },
    { id: 4, name: "Sophie Leray",    email: "sophie.leray@email.com",    type: "Joueur",     lastLogin: "05 Jan 2024", statut: "Actif",    country: "France", joinDate: "12 Nov 2023" },
    { id: 5, name: "Lucas Bernard",   email: "lucas.bernard@email.com",   type: "Professeur", lastLogin: "01 Jan 2024", statut: "Actif",    country: "France", joinDate: "20 Dec 2023" },
];

const ORDERS_DETAIL = [
    { id: "#CMD-4647", date: "12 Mar 2024", amount: "40,00€", statut: "Complétée" },
    { id: "#CMD-3621", date: "08 Mar 2024", amount: "20,00€", statut: "Complétée" },
    { id: "#CMD-3788", date: "02 Mar 2024", amount: "70,00€", statut: "En cours" },
    { id: "#CMD-3793", date: "25 Fév 2024", amount: "25,00€", statut: "Complétée" },
    { id: "#CMD-3762", date: "18 Fév 2024", amount: "15,00€", statut: "Complétée" },
];

const ACTIVITY = [
    { icon: ShoppingCart, iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]", title: "Commande passée",          desc: "Pack Pokémon — 40,00€" },
    { icon: Wifi,         iconBg: "bg-green-50",   iconColor: "text-green-600", title: "Connexion",                desc: "Connexion depuis Roissel France" },
    { icon: Star,         iconBg: "bg-yellow-50",  iconColor: "text-yellow-600",title: "Décklist créée",           desc: "Nouvelle décklist : Charizard Compétitif" },
    { icon: Users,        iconBg: "bg-purple-50",  iconColor: "text-purple-600",title: "Session coaching complétée",desc: "Session 1h avec Prof. Martin" },
];

/* ─── Shared ─── */
const TYPE_STYLE: Record<UserType, string> = {
    "Professeur": "bg-orange-50 text-orange-600",
    "Joueur":     "bg-blue-50 text-blue-600",
    "Admin":      "bg-purple-50 text-purple-600",
};
const STATUT_STYLE: Record<UserStatut, string> = {
    "Actif":    "bg-green-50 text-green-600",
    "Suspendu": "bg-orange-50 text-orange-600",
    "Inactif":  "bg-gray-100 text-gray-500",
};
const STATUT_DOT: Record<UserStatut, string> = {
    "Actif":    "bg-green-500",
    "Suspendu": "bg-orange-500",
    "Inactif":  "bg-gray-400",
};
const ORDER_STATUT: Record<string, string> = {
    "Complétée": "bg-green-50 text-green-600",
    "En cours":  "bg-blue-50 text-blue-600",
    "Annulée":   "bg-red-50 text-red-500",
};

/* ─── Detail view ─── */
function DetailView({ u, onBack }: { u: Utilisateur; onBack: () => void }) {
    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour à la liste
            </button>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left: profile + info + actions */}
                <div className="space-y-5">

                    {/* Profile card */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#e5e7eb] flex items-center justify-center mx-auto mb-3">
                            <Users className="w-7 h-7 text-[#808896]" />
                        </div>
                        <p className="font-['Poppins'] font-bold text-base text-[#140759]">{u.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2 ${STATUT_STYLE[u.statut]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[u.statut]}`} />
                            {u.statut}
                        </span>
                        <div className="mt-4 space-y-1.5 text-xs text-left">
                            {[
                                { label: "Type utilisateur", value: u.type },
                                { label: "Inscrit",          value: u.joinDate },
                                { label: "Pays",             value: u.country },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between py-1.5 border-b border-[#f3f4f6] last:border-0">
                                    <span className="text-[#808896]">{label}</span>
                                    <span className="font-semibold text-[#140759]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Informations du compte */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-3">Informations du compte</h3>
                        <div className="space-y-2 text-xs">
                            {[
                                { label: "Pseudo",       value: "ThomasTCG" },
                                { label: "Discord",      value: "Actif" },
                                { label: "Abonnement",   value: "Premium" },
                                { label: "Wallet",       value: "24,50€" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between py-1.5 border-b border-[#f3f4f6] last:border-0">
                                    <span className="text-[#808896]">{label}</span>
                                    <span className="font-semibold text-[#140759]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin actions */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 space-y-3">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-1">Actions administrateur</h3>
                        <button className="w-full h-10 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Modifier utilisateur
                        </button>
                        <button className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Suspendre compte
                        </button>
                        <button className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer compte
                        </button>
                    </div>
                </div>

                {/* Right: stats + orders + activity */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Activité utilisateur stats */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Activité utilisateur</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { icon: ShoppingCart, iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]",  value: "12", label: "Commandes effectuées" },
                                { icon: BookOpen,     iconBg: "bg-orange-50",  iconColor: "text-orange-500", value: "8",  label: "Contenus achetés" },
                                { icon: Users,        iconBg: "bg-purple-50",  iconColor: "text-purple-600", value: "5",  label: "Sessions coaching" },
                                { icon: Activity,     iconBg: "bg-green-50",   iconColor: "text-green-600",  value: "23", label: "Connexions" },
                            ].map(({ icon: Icon, iconBg, iconColor, value, label }) => (
                                <div key={label} className="text-center p-4 bg-[#f9fafb] rounded-xl">
                                    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-2`}>
                                        <Icon className={`w-4 h-4 ${iconColor}`} />
                                    </div>
                                    <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                                    <p className="text-[10px] text-[#808896] leading-tight mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historique des commandes */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d]">Historique des commandes</h3>
                            <button className="text-xs text-[#01509d] font-semibold hover:underline">Voir tout →</button>
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-[#e5e7eb]">
                                    {["Commande", "Date", "Montant", "Statut"].map(h => (
                                        <th key={h} className="pb-2.5 text-left font-semibold text-[#808896] pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ORDERS_DETAIL.map(o => (
                                    <tr key={o.id} className="border-b border-[#f3f4f6] last:border-0">
                                        <td className="py-2.5 pr-4 font-bold text-[#01509d]">{o.id}</td>
                                        <td className="py-2.5 pr-4 text-[#808896]">{o.date}</td>
                                        <td className="py-2.5 pr-4 font-semibold text-[#140759]">{o.amount}</td>
                                        <td className="py-2.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUT[o.statut]}`}>{o.statut}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Activité récente */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#01509d] mb-4">Activité récente</h3>
                        <div className="space-y-4">
                            {ACTIVITY.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
                                <div key={title} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-4 h-4 ${iconColor}`} />
                                    </div>
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
        </div>
    );
}

/* ─── Main ─── */
export default function UtilisateursAdmin() {
    const [selected, setSelected] = useState<Utilisateur | null>(null);

    if (selected) return <DetailView u={selected} onBack={() => setSelected(null)} />;

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: Users,     iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]",  label: "Utilisateurs", value: "1 247" },
                    { icon: Star,      iconBg: "bg-blue-50",    iconColor: "text-blue-500",   label: "Joueurs",      value: "1 089" },
                    { icon: UserCheck, iconBg: "bg-orange-50",  iconColor: "text-orange-500", label: "Professeurs",  value: "142" },
                    { icon: Wifi,      iconBg: "bg-green-50",   iconColor: "text-green-600",  label: "En ligne",     value: "16" },
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
                    <div className="relative flex-1 min-w-[180px]">
                        <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                        <input type="text" placeholder="Rechercher un utilisateur…"
                            className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
                    </div>
                    <select className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                        {["Tous les types", "Joueur", "Professeur", "Admin"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <select className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                        {["Tous les statuts", "Actif", "Suspendu", "Inactif"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <button className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 ml-auto">
                        <Plus className="w-3.5 h-3.5" /> Nouvel utilisateur
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[600px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                {["Nom", "Email", "Type", "Dernière connexion", "Statut", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {USERS.map(u => (
                                <tr key={u.id} className="border-b border-[#f3f4f6] last:border-0">
                                    <td className="py-3 pr-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#e5e7eb] flex items-center justify-center flex-shrink-0">
                                                <Users className="w-3.5 h-3.5 text-[#808896]" />
                                            </div>
                                            <span className="font-semibold text-[#140759]">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-3 text-[#808896]">{u.email}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_STYLE[u.type]}`}>{u.type}</span>
                                    </td>
                                    <td className="py-3 pr-3 text-[#808896]">{u.lastLogin}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[u.statut]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[u.statut]}`} />
                                            {u.statut}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setSelected(u)} className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Edit2 className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <MessageSquare className="w-3.5 h-3.5 text-[#808896]" />
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
                    <p className="text-xs text-[#808896]">Affichage de 1 à 5 sur 1 247 résultats</p>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50">
                            <ChevronLeft className="w-3.5 h-3.5 text-[#808896]" />
                        </button>
                        {[1, 2, 3].map(n => (
                            <button key={n} className={`w-7 h-7 text-xs rounded-lg font-semibold ${n === 1 ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#808896] hover:bg-gray-50"}`}>{n}</button>
                        ))}
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50">
                            <ChevronRight className="w-3.5 h-3.5 text-[#808896]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
