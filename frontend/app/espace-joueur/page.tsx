"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import {
    LayoutDashboard, BookOpen, Layers, Wallet, Trophy, User, ShoppingBag,
    ChevronRight, ChevronLeft, Play, LogOut, Trash2, Bell, Moon, Mail,
    Search, Plus, Star, Clock, Edit2, ShoppingCart, Heart, X,
} from "lucide-react";

/* ─── Constants ─── */

const TABS = [
    { id: "dashboard",  label: "Dashboard",         icon: LayoutDashboard },
    { id: "profil",     label: "Profil",            icon: User },
    { id: "commandes",  label: "Commandes",         icon: ShoppingBag },
    { id: "contenus",   label: "Contenus achetés",  icon: BookOpen },
    { id: "decklists",  label: "Decklists",         icon: Layers },
    { id: "wishlist",   label: "Wishlist",          icon: Heart },
];

const STATS = [
    { label: "Formations suivies", value: "8",      color: "bg-[#eef5fb] text-[#01509d]",    icon: BookOpen },
    { label: "Mon niveau",         value: "Avancé", color: "bg-purple-50 text-purple-600",   icon: Trophy },
    { label: "Ma décision",        value: "Top 8",  color: "bg-yellow-50 text-yellow-600",   icon: Trophy },
    { label: "En cours",           value: "2",      color: "bg-green-50 text-green-600",     icon: Play },
];

const COURS_EN_COURS = [
    { title: "Stratégies Lugia VSTAR",      progress: 65, color: "from-[#01509d] to-[#274c78]", img: "/res/course1.png" },
    { title: "Maîtriser le format Expanded", progress: 30, color: "from-[#4f46e5] to-[#7c3aed]", img: "/res/course2.png" },
    { title: "Analyse méta — Paldea",        progress: 80, color: "from-[#0891b2] to-[#0e7490]", img: "/res/course3.png" },
    { title: "Gestion du clock en tournoi",  progress: 10, color: "from-[#d97706] to-[#b45309]", img: "/res/course1.png" },
];

const ALL_ORDERS = [
    { id: "CMD-001", name: "Lugia VSTAR Combo",           type: "Deck",       price: 29,  date: "12 Jan 2024",  status: "Livré" },
    { id: "CMD-002", name: "Pikachu VMAX (Holo)",         type: "Carte",      price: 29,  date: "5 Jan 2024",   status: "Livré" },
    { id: "CMD-003", name: "Préparation tournoi",         type: "Cours live", price: 49,  date: "22 Déc 2023",  status: "Actif" },
    { id: "CMD-004", name: "Dragon Shield Sleeves x100",  type: "Accessoire", price: 13,  date: "18 Déc 2023",  status: "Livré" },
    { id: "CMD-005", name: "Charizard ex Control",        type: "Deck",       price: 34,  date: "1 Déc 2023",   status: "Livré" },
    { id: "CMD-006", name: "ETB Charizard ex",            type: "Produit",    price: 70,  date: "10 Nov 2023",  status: "En cours" },
    { id: "CMD-007", name: "Coaching individuel",         type: "Coaching",   price: 59,  date: "3 Nov 2023",   status: "Terminé" },
];

const CONTENUS = [
    { title: "Stratégies Lugia VSTAR",         instructor: "Thomas R.",  rating: 4.9, hours: "4h30", progress: 65, img: "/res/course1.png",  color: "bg-[#01509d]" },
    { title: "Maîtriser le format Expanded",   instructor: "Mathis C.", rating: 4.8, hours: "6h",   progress: 30, img: "/res/course2.png",  color: "bg-[#7c3aed]" },
    { title: "Analyse méta — Saison Paldea",   instructor: "Léa D.",    rating: 5.0, hours: "3h",   progress: 80, img: "/res/course3.png",  color: "bg-[#0891b2]" },
    { title: "Gestion du clock en tournoi",    instructor: "Thomas R.", rating: 4.7, hours: "2h15", progress: 10, img: "/res/course1.png",  color: "bg-[#d97706]" },
    { title: "Construire un deck compétitif",  instructor: "Mathis C.", rating: 4.9, hours: "5h",   progress: 100, img: "/res/course2.png", color: "bg-[#059669]" },
    { title: "Préparation aux Régionaux",      instructor: "Léa D.",    rating: 4.8, hours: "8h",   progress: 100, img: "/res/course3.png", color: "bg-[#dc2626]" },
];

const DECKLISTS_FULL = [
    { id: "d1", name: "Charizard ex Control",  cards: 60, format: "Standard", updated: "Il y a 2j",  imgs: ["/res/course1.png", "/res/course2.png", "/res/course3.png"] },
    { id: "d2", name: "Lugia VSTAR Combo",     cards: 60, format: "Standard", updated: "Il y a 5j",  imgs: ["/res/course2.png", "/res/course1.png", "/res/course3.png"] },
    { id: "d3", name: "Miraidon ex Turbo",     cards: 60, format: "Standard", updated: "Il y a 7j",  imgs: ["/res/course3.png", "/res/course1.png", "/res/course2.png"] },
    { id: "d4", name: "Lost Zone Box",         cards: 60, format: "Expanded", updated: "Il y a 12j", imgs: ["/res/course1.png", "/res/course3.png", "/res/course2.png"] },
    { id: "d5", name: "Gardevoir ex Budget",   cards: 60, format: "Standard", updated: "Il y a 14j", imgs: ["/res/course2.png", "/res/course3.png", "/res/course1.png"] },
    { id: "d6", name: "Arceus VSTAR Toolbox",  cards: 60, format: "Standard", updated: "Il y a 20j", imgs: ["/res/course3.png", "/res/course2.png", "/res/course1.png"] },
];

const RECOMMANDES = [
    { title: "Booster Box Paldea",    price: 129.99, color: "bg-[#01509d]", href: "/sequiper/produits/p2" },
    { title: "Charizard ex Control",  price: 34,     color: "bg-[#4f46e5]", href: "/sequiper/decks/d3" },
    { title: "Deck Building Avancé",  price: 49,     color: "bg-[#059669]", href: "/apprendre" },
    { title: "ETB Charizard ex",      price: 69.99,  color: "bg-[#d97706]", href: "/sequiper/produits/p3" },
];

const TRANSACTIONS = [
    { label: "Achat — Lugia VSTAR Combo",  amount: -29, date: "12 Jan 2024" },
    { label: "Achat — Cours live",         amount: -49, date: "22 Déc 2023" },
    { label: "Remboursement — Accessoire", amount: +15, date: "18 Déc 2023" },
    { label: "Achat — Pikachu VMAX",       amount: -29, date: "5 Jan 2024" },
    { label: "Crédit parrainage",          amount: +10, date: "1 Jan 2024" },
];

const STATUS_STYLE: Record<string, string> = {
    "Livré":     "bg-green-50 text-green-600",
    "Actif":     "bg-[#eef5fb] text-[#01509d]",
    "En cours":  "bg-orange-50 text-orange-500",
    "Terminé":   "bg-gray-100 text-[#808896]",
};

const NAV_CARDS = [
    { id: "contenus",  label: "Mes cours",      desc: "Accédez à vos formations",     icon: BookOpen,   color: "bg-[#eef5fb] text-[#01509d]",  link: "Voir mes cours" },
    { id: "commandes", label: "Mes commandes",   desc: "Suivez vos achats",             icon: ShoppingBag, color: "bg-purple-50 text-purple-600", link: "Voir commandes" },
    { id: "decklists", label: "Mes decklists",   desc: "Gérez vos decks",               icon: Layers,     color: "bg-yellow-50 text-yellow-600", link: "Voir mes decks" },
    { id: "wishlist",  label: "Ma wishlist",     desc: "Vos articles favoris",          icon: Heart,      color: "bg-pink-50 text-pink-600",     link: "Voir wishlist" },
];

/* ─── Tab: Dashboard ─── */

function DashboardTab({ setTab }: { setTab: (t: string) => void }) {
    return (
        <div className="space-y-8">
            {/* Nav cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {NAV_CARDS.map(({ id, label, desc, icon: Icon, color, link }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className="bg-white rounded-2xl p-5 border border-[#e5e7eb] shadow-sm text-left hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="font-['Inter'] font-bold text-sm text-[#140759] mb-0.5">{label}</p>
                        <p className="text-xs text-[#808896] mb-3">{desc}</p>
                        <span className="text-xs font-semibold text-[#01509d] hover:underline flex items-center gap-0.5">
                            {link} <ChevronRight className="w-3 h-3" />
                        </span>
                    </button>
                ))}
            </div>

            {/* Continuer l'apprentissage */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Inter'] font-bold text-[#140759]">Continuer l&apos;apprentissage</h3>
                    <button onClick={() => setTab("contenus")} className="text-xs text-[#01509d] font-semibold hover:underline flex items-center gap-1">
                        Voir tous <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    {COURS_EN_COURS.slice(0, 3).map((c) => (
                        <div key={c.title} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${c.color} p-4 flex flex-col gap-3 min-h-[160px]`}>
                            <div className="absolute inset-0 opacity-20"><img src={c.img} alt="" className="w-full h-full object-cover" /></div>
                            <p className="relative font-['Inter'] font-bold text-xs text-white leading-snug">{c.title}</p>
                            <div className="relative mt-auto">
                                <div className="flex justify-between mb-1.5"><span className="text-[10px] text-white/70">Progression {c.progress}%</span></div>
                                <div className="h-1.5 bg-white/20 rounded-full mb-3"><div className="h-full bg-white rounded-full" style={{ width: `${c.progress}%` }} /></div>
                                <Link href="/apprendre" className="flex items-center justify-center gap-1.5 h-8 w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold rounded-xl transition-colors">
                                    <Play className="w-3 h-3" /> Reprendre
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Commandes récentes + Mes decklists */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
                        <h3 className="font-['Inter'] font-bold text-[#140759] text-sm">Commandes récentes</h3>
                        <button onClick={() => setTab("commandes")} className="text-xs text-[#01509d] font-semibold hover:underline flex items-center gap-1">
                            Tout voir <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <ul>
                        {ALL_ORDERS.slice(0, 4).map((o) => (
                            <li key={o.id} className="flex items-center justify-between px-5 py-3 border-b border-[#e5e7eb] last:border-0">
                                <div>
                                    <p className="text-xs font-semibold text-[#140759]">{o.name}</p>
                                    <p className="text-[10px] text-[#808896]">{o.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#140759]">{o.price}€</span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status] ?? ""}`}>{o.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
                        <h3 className="font-['Inter'] font-bold text-[#140759] text-sm">Mes decklists</h3>
                        <button onClick={() => setTab("decklists")} className="text-xs text-[#01509d] font-semibold hover:underline flex items-center gap-1">
                            Voir tout <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <ul>
                        {DECKLISTS_FULL.slice(0, 4).map((d) => (
                            <li key={d.id} className="flex items-center justify-between px-5 py-3 border-b border-[#e5e7eb] last:border-0">
                                <div>
                                    <p className="text-xs font-semibold text-[#140759]">{d.name}</p>
                                    <p className="text-[10px] text-[#808896]">{d.cards} cartes · {d.format}</p>
                                </div>
                                <Link href="/sequiper/builder" className="text-xs text-[#01509d] font-semibold hover:underline">Modifier</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommandé */}
            <div>
                <h3 className="font-['Inter'] font-bold text-[#140759] mb-4">Recommandé pour vous</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {RECOMMANDES.map((r) => (
                        <Link key={r.title} href={r.href} className={`${r.color} rounded-2xl p-5 flex flex-col gap-3 min-h-[120px] hover:opacity-90 transition-opacity`}>
                            <p className="font-['Inter'] font-bold text-sm text-white leading-snug">{r.title}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="font-['Poppins'] font-bold text-white">{r.price}€</span>
                                <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">Découvrir</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Tab: Contenus achetés ─── */

function CoursTab() {
    const [filter, setFilter] = useState("Tous");
    const FILTERS = ["Tous", "En cours", "Terminés"];

    const filtered = useMemo(() => {
        if (filter === "En cours")  return CONTENUS.filter((c) => c.progress < 100);
        if (filter === "Terminés") return CONTENUS.filter((c) => c.progress === 100);
        return CONTENUS;
    }, [filter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                {FILTERS.map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`h-8 px-4 text-xs font-semibold rounded-xl transition-colors ${filter === f ? "bg-[#01509d] text-white" : "bg-white border border-[#e5e7eb] text-[#140759] hover:border-[#01509d]"}`}>
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((c) => (
                    <div key={c.title} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                        {/* Thumbnail */}
                        <div className={`relative h-36 ${c.color} overflow-hidden`}>
                            <img src={c.img} alt={c.title} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                            {c.progress === 100 && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs bg-green-500 px-3 py-1 rounded-full">Terminé</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-1 leading-snug">{c.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-[#808896] mb-3">
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.hours}</span>
                                <span>{c.instructor}</span>
                            </div>
                            {c.progress < 100 && (
                                <>
                                    <div className="flex justify-between text-[10px] text-[#808896] mb-1">
                                        <span>Progression</span><span>{c.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#e5e7eb] rounded-full mb-3">
                                        <div className="h-full bg-[#01509d] rounded-full" style={{ width: `${c.progress}%` }} />
                                    </div>
                                </>
                            )}
                            <Link href="/apprendre" className={`flex items-center justify-center gap-1.5 h-9 w-full font-['Inter'] font-bold text-xs rounded-xl transition-colors ${c.progress === 100 ? "border border-[#e5e7eb] text-[#140759] hover:bg-gray-50" : "bg-[#01509d] hover:bg-[#014080] text-white"}`}>
                                <Play className="w-3 h-3" /> {c.progress === 100 ? "Revoir" : "Continuer"}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Tab: Mes decks (Decklists sauvegardées) ─── */

function DecksTab() {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return DECKLISTS_FULL.filter((d) => !q || d.name.toLowerCase().includes(q));
    }, [search]);

    return (
        <div className="space-y-6">
            {/* Barre recherche + CTA */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une decklist..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] text-[#140759] placeholder:text-[#9ca3af]"
                    />
                </div>
                <Link href="/sequiper/builder" className="flex-shrink-0 h-10 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Créer une decklist
                </Link>
            </div>

            {/* Grille */}
            {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((d) => (
                        <div key={d.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
                            {/* Thumbnails fanned */}
                            <div className="relative h-20 mb-4">
                                {d.imgs.slice(0, 3).map((img, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-12 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md"
                                        style={{ left: `${i * 20}px`, zIndex: i, transform: `rotate(${(i - 1) * 6}deg)` }}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{d.name}</h3>
                            <p className="text-xs text-[#808896] mb-4">{d.cards} cartes · {d.format} · {d.updated}</p>

                            <div className="flex gap-2">
                                <Link href="/sequiper/builder" className="flex-1 h-9 border border-[#e5e7eb] text-[#140759] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:border-[#01509d] hover:text-[#01509d] transition-colors">
                                    <Edit2 className="w-3.5 h-3.5" /> Modifier
                                </Link>
                                <Link href="/sequiper/decks" className="flex-1 h-9 bg-[#01509d] hover:bg-[#014080] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                                    <ShoppingCart className="w-3.5 h-3.5" /> Acheter
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-[#808896] text-sm">Aucune decklist trouvée.</div>
            )}
        </div>
    );
}

/* ─── Tab: Commandes ─── */

const PER_PAGE = 5;

function CommandesTab() {
    const [search, setSearch] = useState("");
    const [page, setPage]     = useState(1);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return ALL_ORDERS.filter((o) => !q || o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }, [search]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="space-y-5">
            {/* Barre recherche */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Rechercher une commande..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] text-[#140759] placeholder:text-[#9ca3af]"
                    />
                </div>
                <span className="flex-shrink-0 text-xs text-[#808896]">Toutes les commandes</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        {["N° commande", "Nom", "Type", "Date", "Montant", "Statut", ""].map((h) => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#808896] whitespace-nowrap">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {paginated.map((o) => (
                            <tr key={o.id} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#f9fafb] transition-colors">
                                <td className="px-5 py-4 text-xs font-mono text-[#808896]">{o.id}</td>
                                <td className="px-5 py-4 text-sm font-semibold text-[#140759]">{o.name}</td>
                                <td className="px-5 py-4 text-xs text-[#808896]">{o.type}</td>
                                <td className="px-5 py-4 text-xs text-[#808896] whitespace-nowrap">{o.date}</td>
                                <td className="px-5 py-4 text-sm font-bold text-[#140759]">{o.price}€</td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status] ?? ""}`}>{o.status}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <button className="text-xs text-[#01509d] font-semibold hover:underline">Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-[#808896]">{filtered.length} commandes</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center disabled:opacity-40 hover:border-[#01509d] transition-colors">
                            <ChevronLeft className="w-4 h-4 text-[#140759]" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === p ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#140759] hover:border-[#01509d]"}`}>{p}</button>
                        ))}
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center disabled:opacity-40 hover:border-[#01509d] transition-colors">
                            <ChevronRight className="w-4 h-4 text-[#140759]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Tab: Wallet ─── */

function WalletTab() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#140759] to-[#01509d] rounded-2xl p-6 text-white">
                <p className="text-sm text-white/70 mb-1">Solde disponible</p>
                <p className="font-['Poppins'] font-bold text-4xl">45,00 €</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e5e7eb]">
                    <h3 className="font-['Inter'] font-bold text-[#140759]">Historique</h3>
                </div>
                <ul>
                    {TRANSACTIONS.map((t, i) => (
                        <li key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] last:border-0">
                            <div>
                                <p className="text-sm font-medium text-[#140759]">{t.label}</p>
                                <p className="text-xs text-[#808896]">{t.date}</p>
                            </div>
                            <span className={`text-sm font-bold ${t.amount > 0 ? "text-green-600" : "text-[#140759]"}`}>
                                {t.amount > 0 ? "+" : ""}{t.amount}€
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ─── Tab: Profil ─── */

function ProfilTab() {
    const inputClass = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors";
    const labelClass = "block text-xs font-semibold text-[#140759] mb-1.5";
    const [settings, setSettings] = useState({ darkMode: false, newsletter: true, notifications: true });
    function toggle(k: keyof typeof settings) { setSettings((s) => ({ ...s, [k]: !s[k] })); }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Informations personnelles</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Prénom</label><input type="text" defaultValue="Jean" className={inputClass} /></div>
                    <div><label className={labelClass}>Nom</label><input type="text" defaultValue="Dupont" className={inputClass} /></div>
                    <div><label className={labelClass}>Email</label><input type="email" defaultValue="jean@email.com" className={inputClass} /></div>
                    <div><label className={labelClass}>Téléphone</label><input type="tel" defaultValue="+33 6 00 00 00 00" className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Pseudo</label><input type="text" defaultValue="DresseurElite" className={inputClass} /></div>
                </div>
                <button className="mt-5 h-10 px-5 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                    Enregistrer les modifications
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Mot de passe</h3>
                <div className="space-y-3 max-w-sm">
                    <div><label className={labelClass}>Mot de passe actuel</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                    <div><label className={labelClass}>Nouveau mot de passe</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                    <div><label className={labelClass}>Confirmer</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                </div>
                <button className="mt-4 h-10 px-5 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">Sauver</button>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Paramètres du compte</h3>
                <div className="space-y-4">
                    {([
                        { key: "darkMode",      label: "Mode sombre",   icon: Moon,  desc: "Passer l'interface en thème sombre." },
                        { key: "newsletter",    label: "Newsletter",     icon: Mail,  desc: "Recevoir les actualités par email." },
                        { key: "notifications", label: "Notifications",  icon: Bell,  desc: "Activer les notifications push." },
                    ] as { key: keyof typeof settings; label: string; icon: React.ElementType; desc: string }[]).map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#eef5fb] flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-[#01509d]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#140759]">{label}</p>
                                    <p className="text-xs text-[#808896]">{desc}</p>
                                </div>
                            </div>
                            <button onClick={() => toggle(key)} className={`w-11 h-6 rounded-full transition-colors relative ${settings[key] ? "bg-[#01509d]" : "bg-[#e5e7eb]"}`}>
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? "translate-x-5" : ""}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Actions du compte</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button className="flex items-center gap-2 text-sm text-[#808896] hover:text-[#140759] transition-colors"><LogOut className="w-4 h-4" /> Se déconnecter</button>
                    <span className="hidden sm:block text-[#e5e7eb]">|</span>
                    <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /> Supprimer le compte</button>
                    <button className="sm:ml-auto h-10 px-5 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">Enregistrer les modifications</button>
                </div>
            </div>
        </div>
    );
}

/* ─── Tab: Wishlist ─── */

const WISHLIST_ITEMS = [
    { id: "w1", name: "Chien Charizard EX",         price: 20.99, img: "/res/course1.png", badge: null },
    { id: "w2", name: "Pikachu Holographique",      price: 8.99,  img: "/res/course2.png", badge: "Promo" },
    { id: "w3", name: "Prototype carte Premium",    price: 24.99, img: "/res/course3.png", badge: null },
    { id: "w4", name: "Deck Miraidon VStar",        price: 29.99, img: "/res/course1.png", badge: null },
    { id: "w5", name: "Pikachu Sans",               price: 22.99, img: "/res/course2.png", badge: null },
    { id: "w6", name: "Tapis du jeu Pokémon",       price: 14.99, img: "/res/course3.png", badge: "Nouveau" },
    { id: "w7", name: "Deck Starter Gardevoir",     price: 41.99, img: "/res/course1.png", badge: null },
    { id: "w8", name: "Statuoo Lugubreux",          price: 34.99, img: "/res/course2.png", badge: null },
];

function WishlistTab() {
    const [items, setItems] = useState(WISHLIST_ITEMS);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return items.filter((i) => !q || i.name.toLowerCase().includes(q));
    }, [items, search]);

    function remove(id: string) { setItems((prev) => prev.filter((i) => i.id !== id)); }
    function clearAll() { setItems([]); }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-[#808896] mb-5">Retrouvez les produits que vous avez sauvegardés.</p>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tous les articles sélectionnés..."
                            className="w-full pl-11 pr-4 py-2.5 text-sm border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] text-[#140759] placeholder:text-[#9ca3af]"
                        />
                    </div>
                    <button className="flex-shrink-0 h-10 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
                        <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                    </button>
                    <button onClick={clearAll} className="flex-shrink-0 h-10 px-4 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer la wishlist
                    </button>
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filtered.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden group">
                            <div className="relative h-40">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                {item.badge && (
                                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#01509d] text-white">{item.badge}</span>
                                )}
                                <button onClick={() => remove(item.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors">
                                    <X className="w-3.5 h-3.5 text-[#808896]" />
                                </button>
                            </div>
                            <div className="p-3">
                                <p className="font-['Inter'] font-semibold text-xs text-[#140759] mb-1 leading-snug line-clamp-2">{item.name}</p>
                                <p className="font-['Poppins'] font-bold text-base text-[#140759] mb-3">{item.price.toFixed(2).replace(".", ",")} €</p>
                                <button className="w-full h-8 bg-[#01509d] hover:bg-[#014080] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                    <ShoppingCart className="w-3 h-3" /> Ajouter au panier
                                </button>
                                <button onClick={() => remove(item.id)} className="w-full mt-1.5 text-[10px] text-[#808896] hover:text-red-500 flex items-center justify-center gap-1 transition-colors">
                                    <Heart className="w-3 h-3" /> Supprimer de la wishlist
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-[#808896]">
                    <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Votre wishlist est vide.</p>
                </div>
            )}

            {/* Pagination simple */}
            {filtered.length > 0 && (
                <div className="flex justify-center gap-2 pt-2">
                    {[1, 2, 3].map((p) => (
                        <button key={p} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? "bg-[#01509d] text-white" : "border border-[#e5e7eb] text-[#140759] hover:border-[#01509d]"}`}>{p}</button>
                    ))}
                </div>
            )}
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

export default function EspaceJoueurPage() {
    const [tab, setTab] = useState("dashboard");

    const TITLE_MAP: Record<string, string> = {
        dashboard:  "Tableau de bord",
        profil:     "Mon Profil",
        commandes:  "Mes Commandes",
        contenus:   "Contenus achetés",
        decklists:  "Mes Decklists",
        wishlist:   "Ma Wishlist",
    };

    const content: Record<string, React.ReactNode> = {
        dashboard: <DashboardTab setTab={setTab} />,
        contenus:  <CoursTab />,
        decklists: <DecksTab />,
        commandes: <CommandesTab />,
        wishlist:  <WishlistTab />,
        profil:    <ProfilTab />,
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />
            <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <div className="flex gap-8">

                    {/* Sidebar */}
                    <aside className="w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm sticky top-6 flex flex-col">
                            {/* User header */}
                            <div className="px-5 py-5 border-b border-[#e5e7eb] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01509d] to-[#140759] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">J</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-['Inter'] font-bold text-xs text-[#140759] truncate">Jean Dupont</p>
                                    <p className="text-[10px] text-[#808896]">Joueur Académie</p>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="py-2 flex-1">
                                {TABS.map(({ id, label, icon: Icon }) => (
                                    <button key={id} onClick={() => setTab(id)}
                                        className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${tab === id ? "bg-[#eef5fb] text-[#01509d] font-bold border-r-2 border-[#01509d]" : "text-[#808896] hover:text-[#140759] hover:bg-gray-50"}`}>
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        {label}
                                    </button>
                                ))}
                            </nav>

                            {/* Footer actions */}
                            <div className="border-t border-[#e5e7eb] py-2">
                                <Link href="/panier"
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#808896] hover:text-[#140759] hover:bg-gray-50 transition-colors">
                                    <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                                    Mon panier
                                </Link>
                                <Link href="/espace-professeur"
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#01509d] font-semibold hover:bg-[#eef5fb] transition-colors">
                                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                    Espace Professeur
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-6">
                            <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759]">
                                {TITLE_MAP[tab] ?? tab}
                            </h1>
                            {tab === "dashboard" && (
                                <p className="text-sm text-[#808896] mt-1">Bienvenue dans votre espace joueur.</p>
                            )}
                        </div>
                        {content[tab]}
                    </div>
                </div>
            </div>
        </div>
    );
}
