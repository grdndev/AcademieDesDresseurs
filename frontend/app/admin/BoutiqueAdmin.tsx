"use client";

import { useState } from "react";
import {
    Search, Eye, Edit2, Trash2, ArrowUpDown,
    ChevronLeft, ChevronRight, Upload,
    CheckCircle, FileText, Archive,
} from "lucide-react";

/* ─── Types ─── */
type BoutiqueSub = "produits" | "stocks";

interface Product {
    id: number; name: string; sku: string;
    category: string; catColor: string;
    price: string; stock: number;
    statut: "Actif" | "Stock faible" | "Rupture";
    bg: string;
}

interface StockItem {
    id: number; name: string; ref: string;
    category: string; catColor: string;
    stock: number; price: string; min: number;
    statut: "Actif" | "Stock faible" | "Rupture";
    bg: string;
}

/* ─── Mock data ─── */
const PRODUCTS: Product[] = [
    { id: 1, name: "Deck Dracafeu EX",          sku: "SKU: DECK-045",  category: "Deck",            catColor: "text-[#01509d]",  price: "49,99€", stock: 156, statut: "Actif",        bg: "bg-red-100" },
    { id: 2, name: "Pikachu VMAX",              sku: "SKU: CARD-045",  category: "Carte à l'unité", catColor: "text-[#01509d]",  price: "89,99€", stock: 23,  statut: "Actif",        bg: "bg-yellow-100" },
    { id: 3, name: "Protège-cartes Premium",    sku: "SKU: ACC-012",   category: "Accessoire",      catColor: "text-teal-600",   price: "12,99€", stock: 342, statut: "Actif",        bg: "bg-blue-100" },
    { id: 4, name: "Peluche Évoli Officielle",  sku: "SKU: OFF-089",   category: "Produit officiel",catColor: "text-orange-600", price: "24,99€", stock: 5,   statut: "Stock faible", bg: "bg-orange-100" },
    { id: 5, name: "Booster Écarlate & Violet", sku: "SKU: BOOST-023", category: "Produit officiel",catColor: "text-orange-600", price: "4,99€",  stock: 0,   statut: "Rupture",      bg: "bg-purple-100" },
    { id: 6, name: "Tapis de jeu Arène",        sku: "SKU: ACC-034",   category: "Accessoire",      catColor: "text-teal-600",   price: "29,99€", stock: 67,  statut: "Actif",        bg: "bg-green-100" },
];

const STOCKS: StockItem[] = [
    { id: 1, name: "Carte Charizard EX",       ref: "#001-CHA", category: "Cartes Pokémon", catColor: "text-[#01509d]",  stock: 45, price: "45,99", min: 10, statut: "Actif",        bg: "bg-red-100" },
    { id: 2, name: "Booster Évolutions",       ref: "#002-EVO", category: "Boosters",       catColor: "text-green-600",  stock: 5,  price: "45,99", min: 20, statut: "Stock faible", bg: "bg-blue-100" },
    { id: 3, name: "Protège-cartes Ultra Pro", ref: "#003-PRO", category: "Accessoires",    catColor: "text-teal-600",   stock: 0,  price: "45,99", min: 15, statut: "Rupture",      bg: "bg-yellow-100" },
    { id: 4, name: "Carte Pikachu Shiny",      ref: "#004-SHI", category: "Cartes Pokémon", catColor: "text-[#01509d]",  stock: 28, price: "45,99", min: 10, statut: "Actif",        bg: "bg-orange-100" },
    { id: 5, name: "Deck Box Premium",         ref: "#005-DBX", category: "Deck Builder",   catColor: "text-purple-600", stock: 7,  price: "45,99", min: 12, statut: "Stock faible", bg: "bg-green-100" },
];

/* ─── Shared styles ─── */
const STATUT_STYLE: Record<string, string> = {
    "Actif":        "bg-green-50 text-green-600",
    "Stock faible": "bg-orange-50 text-orange-600",
    "Rupture":      "bg-red-50 text-red-500",
};
const STATUT_DOT: Record<string, string> = {
    "Actif":        "bg-green-500",
    "Stock faible": "bg-orange-500",
    "Rupture":      "bg-red-500",
};

const inputClass = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af]";
const labelClass = "block text-xs font-semibold text-[#140759] mb-1.5";

/* ─── Shared subcomponents ─── */
function Filters({ placeholder = "Rechercher un produit…" }: { placeholder?: string }) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896]" />
                <input type="text" placeholder={placeholder}
                    className="w-full h-9 pl-9 pr-4 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] placeholder:text-[#9ca3af]" />
            </div>
            {[
                ["Toutes les catégories", "Deck", "Carte à l'unité", "Accessoire", "Produit officiel", "Booster"],
                ["Tous les statuts", "Actif", "Stock faible", "Rupture"],
                ["Tous les stocks", "En stock", "Stock faible", "Rupture"],
            ].map(opts => (
                <select key={opts[0]} className="h-9 px-3 text-xs text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                    {opts.map(o => <option key={o}>{o}</option>)}
                </select>
            ))}
        </div>
    );
}

function Pagination({ shown, pages = 42 }: { shown: string; pages?: number }) {
    return (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f3f4f6]">
            <p className="text-xs text-[#808896]">{shown}</p>
            <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5 text-[#808896]" />
                </button>
                {[1, 2, 3].map(n => (
                    <button key={n} className={`w-7 h-7 text-xs rounded-lg font-semibold transition-colors ${n === 1 ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#808896] hover:bg-gray-50"}`}>{n}</button>
                ))}
                <span className="text-xs text-[#808896] px-1">…</span>
                <button className="w-7 h-7 text-xs rounded-lg border border-[#e5e7eb] text-[#808896] hover:bg-gray-50 font-semibold">{pages}</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-[#808896]" />
                </button>
            </div>
        </div>
    );
}

/* ─── Gestion des produits ─── */
function GestionProduits() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Nombre de produits", value: "247", iconBg: "bg-[#eef5fb]", iconColor: "text-[#01509d]" },
                    { label: "Produits actifs",    value: "218", iconBg: "bg-green-50",  iconColor: "text-green-600" },
                    { label: "Produits en rupture",value: "12",  iconBg: "bg-red-50",    iconColor: "text-red-500" },
                ].map(({ label, value, iconBg, iconColor }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-base font-bold ${iconColor}`}>#</span>
                        </div>
                        <div>
                            <p className="font-['Poppins'] font-bold text-xl text-[#140759]">{value}</p>
                            <p className="text-xs text-[#808896]">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <Filters />
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[680px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                {["Image", "Nom produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PRODUCTS.map(p => (
                                <tr key={p.id} className="border-b border-[#f3f4f6] last:border-0">
                                    <td className="py-3 pr-3">
                                        <div className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center text-base`}>🃏</div>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <p className="font-semibold text-[#140759]">{p.name}</p>
                                        <p className="text-[#9ca3af]">{p.sku}</p>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span className={`font-semibold ${p.catColor}`}>{p.category}</span>
                                    </td>
                                    <td className="py-3 pr-3 font-bold text-[#140759]">{p.price}</td>
                                    <td className="py-3 pr-3 text-[#140759] font-semibold">{p.stock}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[p.statut]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[p.statut]}`} />
                                            {p.statut}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Eye className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Edit2 className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination shown="Affichage de 1 à 6 sur 247 produits" />
            </div>
        </div>
    );
}

/* ─── Gestion des stocks ─── */
function GestionStocks() {
    const rupture = STOCKS.filter(s => s.statut === "Rupture").length;
    const faible  = STOCKS.filter(s => s.statut === "Stock faible").length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <p className="font-['Poppins'] font-bold text-base text-red-600 mb-0.5">Produits en rupture</p>
                    <p className="text-sm text-red-500">{rupture} produits</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                    <p className="font-['Poppins'] font-bold text-base text-orange-600 mb-0.5">Stock faible</p>
                    <p className="text-sm text-orange-500">{faible} produits</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <p className="font-['Poppins'] font-bold text-base text-green-600 mb-0.5">Stock disponible</p>
                    <p className="text-sm text-green-500">245 produits</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <Filters />
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[680px]">
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                {["Produit", "Catégorie", "Stock actuel", "Prix", "Stock minimum", "Statut", "Actions"].map(h => (
                                    <th key={h} className="pb-3 text-left font-semibold text-[#808896] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {STOCKS.map(s => (
                                <tr key={s.id} className="border-b border-[#f3f4f6] last:border-0">
                                    <td className="py-3 pr-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center text-sm flex-shrink-0`}>🃏</div>
                                            <div>
                                                <p className="font-semibold text-[#140759]">{s.name}</p>
                                                <p className="text-[#9ca3af]">{s.ref}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span className={`font-semibold ${s.catColor}`}>{s.category}</span>
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span className={`font-bold ${s.stock === 0 ? "text-red-500" : s.stock <= s.min ? "text-orange-600" : "text-[#140759]"}`}>
                                            {s.stock}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-3 text-[#140759]">{s.price}</td>
                                    <td className="py-3 pr-3 text-[#808896]">{s.min}</td>
                                    <td className="py-3 pr-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[s.statut]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[s.statut]}`} />
                                            {s.statut}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <Edit2 className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                                                <ArrowUpDown className="w-3.5 h-3.5 text-[#808896]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination shown="Affichage de 1 à 5 sur 285 résultats" />
            </div>
        </div>
    );
}

/* ─── Ajouter un produit ─── */
const VARIANTS_DEFAULT = [
    { id: 1, dot: "bg-blue-500",   label: "Base",    desc: "Version standard",         prix: "21,00", stock: "58", checked: true  },
    { id: 2, dot: "bg-purple-500", label: "Reverse", desc: "Édition brillante limitée", prix: "45,00", stock: "30", checked: true  },
    { id: 3, dot: "bg-yellow-400", label: "Holo",    desc: "Variante holographique",    prix: "75,00", stock: "6",  checked: false },
];

const STATUT_OPTIONS = [
    { id: "Actif",     icon: CheckCircle, iconColor: "text-green-500", dotColor: "bg-green-500", label: "Actif",     desc: "Visible sur la boutique" },
    { id: "Brouillon", icon: FileText,    iconColor: "text-gray-400",  dotColor: "bg-gray-400",  label: "Brouillon", desc: "Non publié" },
    { id: "Archivé",   icon: Archive,     iconColor: "text-gray-400",  dotColor: "bg-gray-400",  label: "Archivé",   desc: "Caché définitivement" },
];

function AjouterProduit({ onBack }: { onBack: () => void }) {
    const [productType, setProductType] = useState<"simple" | "variantes">("variantes");
    const [statut,      setStatut]      = useState("Actif");
    const [suiviStock,  setSuiviStock]  = useState(true);
    const [prix,        setPrix]        = useState("25,00");
    const [prixPromo,   setPrixPromo]   = useState("50,00");
    const [variants,    setVariants]    = useState(VARIANTS_DEFAULT);

    function toggleVariant(id: number) {
        setVariants(p => p.map(v => v.id === id ? { ...v, checked: !v.checked } : v));
    }

    const marge = prixPromo && prix
        ? Math.round(((parseFloat(prixPromo.replace(",", ".")) - parseFloat(prix.replace(",", "."))) / parseFloat(prix.replace(",", "."))) * 100)
        : null;

    return (
        <div className="space-y-6">
            {/* Back */}
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors font-semibold">
                <ChevronLeft className="w-4 h-4" /> Retour aux produits
            </button>

            {/* Informations produit */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-5">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Informations produit</h3>
                <div>
                    <label className={labelClass}>Nom du produit <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Ex : Carte Charizard EX" className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Catégorie <span className="text-red-500">*</span></label>
                        <select className={`${inputClass} cursor-pointer`}>
                            {["Sélectionner une catégorie", "Deck", "Carte à l'unité", "Accessoire", "Produit officiel", "Booster"].map(o => (
                                <option key={o}>{o}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Référence / SKU</label>
                        <input type="text" placeholder="Ex : #001-CHA" className={inputClass} />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea rows={3} placeholder="Décrivez votre produit…" className={`${inputClass} resize-none`} />
                </div>
            </div>

            {/* Images produit */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Images produit</h3>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#e5e7eb] rounded-2xl py-10 cursor-pointer hover:border-[#01509d]/40 hover:bg-[#f9fafb] transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#eef5fb] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#01509d]" />
                    </div>
                    <p className="text-sm font-semibold text-[#140759]">Cliquez ou glissez vos images</p>
                    <p className="text-xs text-[#808896]">JPG, PNG — max 5 MB par fichier</p>
                    <span className="mt-1 px-4 py-1.5 bg-[#01509d] text-white text-xs font-semibold rounded-xl hover:bg-[#014080] transition-colors">
                        Parcourir
                    </span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                </label>
                {/* Thumbnail placeholders */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-[#eef5fb] border-2 border-[#01509d] flex items-center justify-center text-2xl">🃏</div>
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#01509d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">Principale</span>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border border-[#e5e7eb] flex items-center justify-center text-2xl">🃏</div>
                    <button className="w-16 h-16 rounded-xl border-2 border-dashed border-[#e5e7eb] flex items-center justify-center text-[#808896] hover:border-[#01509d]/40 hover:bg-[#f9fafb] transition-colors text-xl">
                        +
                    </button>
                </div>
            </div>

            {/* Type de produit */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Type de produit</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    {([
                        { id: "simple",   title: "Produit simple",  sub: "Carte à l'unité" },
                        { id: "variantes",title: "Avec variantes",  sub: "Plusieurs versions" },
                    ] as const).map(opt => (
                        <button key={opt.id} onClick={() => setProductType(opt.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${productType === opt.id ? "border-[#01509d] bg-[#eef5fb]" : "border-[#e5e7eb] hover:border-[#01509d]/30"}`}>
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${productType === opt.id ? "border-[#01509d]" : "border-[#9ca3af]"}`}>
                                {productType === opt.id && <span className="w-2 h-2 rounded-full bg-[#01509d]" />}
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${productType === opt.id ? "text-[#01509d]" : "text-[#140759]"}`}>{opt.title}</p>
                                <p className="text-xs text-[#808896]">{opt.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Variantes de carte */}
            {productType === "variantes" && (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Variantes de carte</h3>
                        <button className="text-xs text-[#01509d] font-semibold hover:underline">+ Ajouter une variante</button>
                    </div>
                    <div className="space-y-3">
                        {variants.map(v => (
                            <div key={v.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${v.checked ? "border-[#e5e7eb] bg-white" : "border-[#f3f4f6] bg-[#f9fafb] opacity-60"}`}>
                                <input type="checkbox" checked={v.checked} onChange={() => toggleVariant(v.id)}
                                    className="w-4 h-4 accent-[#01509d] cursor-pointer flex-shrink-0" />
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${v.dot}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#140759]">{v.label}</p>
                                    <p className="text-xs text-[#808896]">{v.desc}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-[10px] text-[#808896] mb-1">Prix (€)</p>
                                        <input type="text" defaultValue={v.prix}
                                            className="w-20 px-2.5 py-1.5 text-xs text-[#140759] border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#01509d] text-right" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#808896] mb-1">Stock</p>
                                        <input type="text" defaultValue={v.stock}
                                            className="w-16 px-2.5 py-1.5 text-xs text-[#140759] border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#01509d] text-right" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom 3-col: Gestion du stock / Statut / Tarification */}
            <div className="grid lg:grid-cols-3 gap-5">

                {/* Gestion du stock */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Gestion du stock</h3>
                    {productType === "simple" && (
                        <div>
                            <label className={labelClass}>Stock actuel <span className="text-red-500">*</span></label>
                            <input type="number" placeholder="0" className={inputClass} />
                        </div>
                    )}
                    <div>
                        <label className={labelClass}>Stock minimum (alerte)</label>
                        <input type="number" placeholder="10" className={inputClass} />
                    </div>
                    {/* Suivi du stock toggle */}
                    <div className="flex items-center justify-between py-1">
                        <div>
                            <p className="text-xs font-semibold text-[#140759]">Seuil de stock</p>
                            <p className="text-[10px] text-[#808896]">Activer les alertes</p>
                        </div>
                        <button onClick={() => setSuiviStock(p => !p)}
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${suiviStock ? "bg-[#01509d]" : "bg-[#e5e7eb]"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${suiviStock ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                    {/* Stock indicator */}
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-xs font-semibold text-green-700">Stock OK</span>
                    </div>
                </div>

                {/* Statut du produit */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Statut du produit</h3>
                    <div className="space-y-2">
                        {STATUT_OPTIONS.map(({ id, icon: Icon, iconColor, dotColor, label, desc }) => (
                            <button key={id} onClick={() => setStatut(id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${statut === id ? "border-[#01509d] bg-[#eef5fb]" : "border-[#f3f4f6] hover:border-[#e5e7eb]"}`}>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${statut === id ? "border-[#01509d]" : "border-[#9ca3af]"}`}>
                                    {statut === id && <span className="w-2 h-2 rounded-full bg-[#01509d]" />}
                                </div>
                                <Icon className={`w-4 h-4 ${statut === id ? iconColor : "text-[#9ca3af]"} flex-shrink-0`} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-semibold ${statut === id ? "text-[#01509d]" : "text-[#140759]"}`}>{label}</p>
                                        {id === "Actif" && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                                    </div>
                                    <p className="text-[10px] text-[#808896]">{desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tarification */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#140759]">Tarification</h3>
                    <div>
                        <label className={labelClass}>Prix (€) <span className="text-red-500">*</span></label>
                        <input type="text" value={prix} onChange={e => setPrix(e.target.value)}
                            placeholder="0,00" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Prix promo (€)</label>
                        <input type="text" value={prixPromo} onChange={e => setPrixPromo(e.target.value)}
                            placeholder="0,00" className={inputClass} />
                    </div>
                    {marge !== null && !isNaN(marge) && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                            <span className="text-xs font-bold text-green-700">
                                Marge estimée : {marge >= 0 ? "+" : ""}{marge}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-6">
                <button onClick={onBack}
                    className="h-10 px-5 text-sm font-semibold text-[#808896] border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] transition-colors">
                    Annuler
                </button>
                <button className="h-10 px-5 text-sm font-semibold text-[#01509d] border border-[#01509d] rounded-xl hover:bg-[#eef5fb] transition-colors">
                    Enregistrer en brouillon
                </button>
                <button className="h-10 px-5 text-sm font-semibold text-white bg-[#01509d] hover:bg-[#014080] rounded-xl transition-colors">
                    Publier le produit
                </button>
            </div>
        </div>
    );
}

/* ─── Export ─── */
export default function BoutiqueAdmin({
    sub,
    setSub,
    addMode,
    setAddMode,
}: {
    sub: BoutiqueSub;
    setSub: (s: BoutiqueSub) => void;
    addMode: boolean;
    setAddMode: (v: boolean) => void;
}) {
    if (addMode) return <AjouterProduit onBack={() => setAddMode(false)} />;
    if (sub === "produits") return <GestionProduits />;
    return <GestionStocks />;
}
