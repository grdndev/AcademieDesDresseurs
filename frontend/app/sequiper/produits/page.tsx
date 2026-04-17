"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { Search, ChevronDown, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/cart-provider";

const PRODUITS = [
    { id: "p1",  name: "Coffret Dresseur d'Élite — Écarlate et Violet",  category: "Coffret",  price: 54.99, stock: 8,  rating: 4.9, reviews: 214, image: "/res/course1.png", badge: "Bestseller" },
    { id: "p2",  name: "Booster Box Évolutions à Paldea",                 category: "Booster",  price: 129.99, stock: 4, rating: 4.8, reviews: 97,  image: "/res/course2.png", badge: "Méta" },
    { id: "p3",  name: "ETB Charizard ex — Forces Temporelles",           category: "ETB",      price: 69.99, stock: 6,  rating: 4.9, reviews: 183, image: "/res/course3.png", badge: "Nouveau" },
    { id: "p4",  name: "Collection Pokémon 151 — Coffret Premium",        category: "Coffret",  price: 89.99, stock: 3,  rating: 4.7, reviews: 56,  image: "/res/course1.png", badge: null },
    { id: "p5",  name: "Booster Box Obsidienne Flammes",                  category: "Booster",  price: 119.99, stock: 5, rating: 4.8, reviews: 72,  image: "/res/course2.png", badge: null },
    { id: "p6",  name: "ETB Pikachu ex — Destinées de Paldea",            category: "ETB",      price: 59.99, stock: 10, rating: 4.6, reviews: 44,  image: "/res/course3.png", badge: "Nouveau" },
    { id: "p7",  name: "Tin Mew ex Collection",                           category: "Tin",      price: 24.99, stock: 15, rating: 4.5, reviews: 38,  image: "/res/course1.png", badge: null },
    { id: "p8",  name: "Coffret Ultra Premium Charizard",                 category: "Coffret",  price: 139.99, stock: 2, rating: 5.0, reviews: 29,  image: "/res/course2.png", badge: "Édition Limitée" },
    { id: "p9",  name: "Booster Pokémon GO — Box Display",                category: "Booster",  price: 109.99, stock: 0, rating: 4.7, reviews: 61,  image: "/res/course3.png", badge: null },
];

const CATEGORIES = ["Toutes les catégories", "Coffret", "Booster", "ETB", "Tin"];
const PER_PAGE = 9;

export default function ProduitsPage() {
    const { dispatch } = useCart();
    const [search, setSearch]       = useState("");
    const [category, setCategory]   = useState("Toutes les catégories");
    const [page, setPage]           = useState(1);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return PRODUITS.filter((p) => {
            const matchSearch   = !q || p.name.toLowerCase().includes(q);
            const matchCategory = category === "Toutes les catégories" || p.category === category;
            return matchSearch && matchCategory;
        });
    }, [search, category]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    function handleSearch(v: string) { setSearch(v);   setPage(1); }
    function handleCategory(v: string) { setCategory(v); setPage(1); }

    function addToCart(p: typeof PRODUITS[0]) {
        dispatch({ type: "ADD_ITEM", payload: { _id: p.id, nameFR: p.name, price: p.price, quantity: 1, stock: p.stock, itemType: "accessory" } });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

                {/* Bannière */}
                <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-r from-[#140759] to-[#01509d] p-8 flex items-center justify-between">
                    <div className="relative z-10 max-w-md">
                        <span className="text-xs font-bold text-[#dbb42b] uppercase tracking-wider mb-2 block">Produits officiels Pokémon</span>
                        <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-2">Booster Boxes, ETBs & Coffrets</h2>
                        <p className="text-sm text-white/70">Les produits Pokémon Company authentiques, livrés directement chez vous.</p>
                    </div>
                    <div className="hidden lg:flex gap-3 opacity-80">
                        <img src="/res/course1.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[-6deg] shadow-xl" />
                        <img src="/res/course2.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[3deg] shadow-xl mt-4" />
                        <img src="/res/course3.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[-2deg] shadow-xl" />
                    </div>
                </div>

                {/* Barre recherche + filtres */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-8 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]"
                        />
                    </div>
                    <div className="relative flex-shrink-0">
                        <select
                            value={category}
                            onChange={(e) => handleCategory(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none"
                        >
                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                    </div>
                </div>

                {/* Grille */}
                {paginated.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {paginated.map((p) => (
                            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                                <Link href={`/sequiper/produits/${p.id}`} className="block relative">
                                    <div className="h-52 overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    {p.badge && (
                                        <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#01509d] text-white">{p.badge}</span>
                                    )}
                                    {p.stock === 0 && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-white text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Rupture de stock</span>
                                        </div>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <span className="text-xs font-medium text-[#808896]">{p.category}</span>
                                    <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mt-0.5 mb-2 line-clamp-2 leading-snug">{p.name}</h3>
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-[#808896]">{p.rating} ({p.reviews} avis)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-['Poppins'] font-bold text-xl text-[#140759]">{p.price.toFixed(2).replace(".", ",")} €</span>
                                        <button
                                            onClick={() => addToCart(p)}
                                            disabled={p.stock === 0}
                                            className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
                                        </button>
                                    </div>
                                    {p.stock > 0 && p.stock <= 5 && (
                                        <p className="text-xs text-orange-500 mt-2">Plus que {p.stock} en stock</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-[#808896]">Aucun produit trouvé.</div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${page === p ? "bg-[#01509d] text-white" : "bg-white border border-[#e5e7eb] text-[#140759] hover:border-[#01509d]"}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
