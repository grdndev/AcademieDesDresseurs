"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, X, Percent, DollarSign, Calendar } from "lucide-react";

interface Bon {
    id: number; code: string; desc: string;
    type: "Pourcentage" | "Montant fixe";
    valeur: string; utilisations: string;
    expiration: string;
    statut: "Actif" | "Expiré" | "Brouillon";
}

const BONS: Bon[] = [
    { id: 1, code: "POKEMON10",   desc: "Série Pokémon",     type: "Pourcentage",  valeur: "-10%", utilisations: "43/100",       expiration: "07/12/2025", statut: "Actif"    },
    { id: 2, code: "WELCOME5",    desc: "",                  type: "Montant fixe", valeur: "-5€",  utilisations: "30/Illimité",  expiration: "—",          statut: "Actif"    },
    { id: 3, code: "SUMMER30",    desc: "",                  type: "Pourcentage",  valeur: "-30%", utilisations: "245/500",      expiration: "31/08/2025", statut: "Expiré"   },
    { id: 4, code: "BLACKFRIDAY", desc: "Black Friday 2025", type: "Pourcentage",  valeur: "-50%", utilisations: "5/100",        expiration: "28/11/2025", statut: "Brouillon"},
];

const STATUT_STYLE: Record<string, string> = {
    "Actif":     "bg-green-50 text-green-600",
    "Expiré":    "bg-orange-50 text-orange-600",
    "Brouillon": "bg-gray-100 text-gray-500",
};
const STATUT_DOT: Record<string, string> = {
    "Actif":     "bg-green-500",
    "Expiré":    "bg-orange-500",
    "Brouillon": "bg-gray-400",
};

const inp = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af]";
const lbl = "block text-xs font-semibold text-[#140759] mb-1.5";

function CreateModal({ onClose }: { onClose: () => void }) {
    const [type, setType] = useState<"Pourcentage" | "Montant fixe">("Pourcentage");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 space-y-5">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#808896] hover:bg-[#f9fafb]">
                    <X className="w-4 h-4" />
                </button>
                <div className="text-center">
                    <div className="w-12 h-12 bg-[#01509d] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Percent className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="font-['Poppins'] font-bold text-lg text-[#140759]">Créer un code promo</h2>
                    <p className="text-xs text-[#808896] mt-1">Définissez les paramètres de votre offre</p>
                </div>
                <div>
                    <label className={lbl}>Nom du code <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Ex: PROMO-ETE" className={inp} />
                </div>
                <div>
                    <label className={lbl}>Description</label>
                    <input type="text" placeholder="Offre valable pendant l'été" className={inp} />
                </div>
                <div>
                    <label className={lbl}>Type de réduction <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                        {([
                            { id: "Pourcentage" as const, Icon: Percent,     sub: "Réduction en %" },
                            { id: "Montant fixe" as const, Icon: DollarSign, sub: "Réduction en €" },
                        ]).map(({ id, Icon, sub }) => (
                            <button key={id} onClick={() => setType(id)}
                                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-colors ${type === id ? "border-[#01509d] bg-[#eef5fb]" : "border-[#e5e7eb] hover:border-[#01509d]/30"}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${type === id ? "bg-[#01509d]" : "bg-[#f3f4f6]"}`}>
                                    <Icon className={`w-4 h-4 ${type === id ? "text-white" : "text-[#808896]"}`} />
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold ${type === id ? "text-[#01509d]" : "text-[#140759]"}`}>{id}</p>
                                    <p className="text-[10px] text-[#808896]">{sub}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className={lbl}>Valeur <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input type="number" placeholder="10" className={`${inp} pr-10`} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#808896]">
                            {type === "Pourcentage" ? "%" : "€"}
                        </span>
                    </div>
                </div>
                <div>
                    <label className={lbl}>Date d'expiration</label>
                    <div className="relative">
                        <input type="date" className={`${inp} pr-10`} />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                    <button onClick={onClose} className="flex-1 h-10 text-sm font-semibold text-[#808896] border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] transition-colors">
                        Annuler
                    </button>
                    <button className="flex-1 h-10 text-sm font-semibold text-white bg-[#01509d] hover:bg-[#014080] rounded-xl transition-colors">
                        + Créer le code
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BonsDeReduction() {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Bons actifs",         value: "12",    dot: "bg-green-500",  bg: "bg-green-50"  },
                        { label: "Bons expirés",         value: "5",     dot: "bg-orange-500", bg: "bg-orange-50" },
                        { label: "Utilisations totales", value: "847",   dot: "bg-[#01509d]",  bg: "bg-[#eef5fb]" },
                        { label: "Revenus générés",      value: "12.4€", dot: "bg-purple-500", bg: "bg-purple-50" },
                    ].map(({ label, value, dot, bg }) => (
                        <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                <span className={`w-3 h-3 rounded-full ${dot}`} />
                            </div>
                            <div>
                                <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                                <p className="text-xs text-[#808896]">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                            <input type="text" placeholder="Rechercher un code ou nom…"
                                className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
                        </div>
                        {[
                            ["Tous les types", "Pourcentage", "Montant fixe"],
                            ["Tous les statuts", "Actif", "Expiré", "Brouillon"],
                        ].map(opts => (
                            <select key={opts[0]} className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none cursor-pointer">
                                {opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                        ))}
                        <button onClick={() => setShowModal(true)}
                            className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors">
                            + Ajouter
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[640px]">
                            <thead>
                                <tr className="border-b border-[#e5e7eb]">
                                    <th className="pb-3 w-8 pr-3">
                                        <input type="checkbox" className="w-3.5 h-3.5 accent-[#01509d] cursor-pointer" />
                                    </th>
                                    {["Code", "Type", "Réduction", "Utilisation", "Date d'expiration", "Statut", "Actions"].map(h => (
                                        <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {BONS.map(b => {
                                    const [used, total] = b.utilisations.split("/");
                                    const pct = total === "Illimité" ? 0 : Math.min(100, (parseInt(used) / parseInt(total)) * 100);
                                    return (
                                        <tr key={b.id} className="border-b border-[#f3f4f6] last:border-0">
                                            <td className="py-3 pr-3">
                                                <input type="checkbox" className="w-3.5 h-3.5 accent-[#01509d] cursor-pointer" />
                                            </td>
                                            <td className="py-3 pr-3">
                                                <p className="font-bold text-[#140759] font-mono tracking-wide">{b.code}</p>
                                                {b.desc && <p className="text-[#9ca3af]">{b.desc}</p>}
                                            </td>
                                            <td className="py-3 pr-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${b.type === "Pourcentage" ? "bg-[#eef5fb] text-[#01509d]" : "bg-purple-50 text-purple-600"}`}>
                                                    {b.type === "Pourcentage" ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                                                    {b.type}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-3 font-bold text-[#140759]">{b.valeur}</td>
                                            <td className="py-3 pr-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#140759] font-semibold">{used}</span>
                                                    <span className="text-[#9ca3af]">/ {total}</span>
                                                    {total !== "Illimité" && (
                                                        <div className="w-14 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#01509d] rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-3 text-[#808896]">{b.expiration}</td>
                                            <td className="py-3 pr-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[b.statut]}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[b.statut]}`} />
                                                    {b.statut}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-1">
                                                    <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                        <Edit2 className="w-3.5 h-3.5 text-[#808896]" />
                                                    </button>
                                                    <button className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showModal && <CreateModal onClose={() => setShowModal(false)} />}
        </>
    );
}
