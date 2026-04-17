"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { useCart } from "../../../context/cart-provider";
import { ArrowLeft, Star, ShoppingCart, Shield, Truck, Minus, Plus, CheckCircle, Package } from "lucide-react";

const PRODUITS: Record<string, { id: string; name: string; category: string; price: number; stock: number; rating: number; reviews: number; image: string; images: string[]; description: string; features: string[]; badge: string | null }> = {
    "p1": { id: "p1", name: "Coffret Dresseur d'Élite — Écarlate et Violet", category: "Coffret",  price: 54.99,  stock: 8,  rating: 4.9, reviews: 214, badge: "Bestseller",     image: "/res/course1.png", images: ["/res/course1.png", "/res/course2.png", "/res/course3.png"], description: "Le Coffret Dresseur d'Élite Écarlate et Violet contient tout ce qu'il faut pour débuter ou étoffer votre collection. 9 boosters, une promo exclusive et des accessoires premium inclus.", features: ["9 boosters Écarlate et Violet", "1 carte promo exclusive foil", "1 porte-cartes rigide", "Authentifié Pokémon Company"] },
    "p2": { id: "p2", name: "Booster Box Évolutions à Paldea",               category: "Booster",  price: 129.99, stock: 4,  rating: 4.8, reviews: 97,  badge: "Méta",           image: "/res/course2.png", images: ["/res/course2.png", "/res/course1.png", "/res/course3.png"], description: "La Booster Box Évolutions à Paldea — le set incontournable pour trouver les cartes ex les plus puissantes de la méta actuelle. 36 boosters par boîte.", features: ["36 boosters par boîte", "Cartes ex Paldea incluses", "Format Standard & Expanded", "Produit scellé officiel"] },
    "p3": { id: "p3", name: "ETB Charizard ex — Forces Temporelles",         category: "ETB",      price: 69.99,  stock: 6,  rating: 4.9, reviews: 183, badge: "Nouveau",        image: "/res/course3.png", images: ["/res/course3.png", "/res/course1.png", "/res/course2.png"], description: "L'Elite Trainer Box Forces Temporelles avec Charizard ex en vedette. Le meilleur coffret collector de la saison — idéal comme cadeau ou pour ouvrir en live.", features: ["8 boosters Forces Temporelles", "Carte promo Charizard ex foil", "65 sleeves Charizard", "Accessoires tournoi inclus"] },
    "p4": { id: "p4", name: "Collection Pokémon 151 — Coffret Premium",      category: "Coffret",  price: 89.99,  stock: 3,  rating: 4.7, reviews: 56,  badge: null,             image: "/res/course1.png", images: ["/res/course1.png", "/res/course2.png", "/res/course3.png"], description: "Le coffret premium Pokémon 151 revient sur les 151 premiers Pokémon avec des artworks inédits. Un must-have pour les collectionneurs nostalgiques.", features: ["12 boosters Pokémon 151", "Carte SIR exclusive garantie", "Classeur collector inclus", "Édition limitée numérotée"] },
    "p5": { id: "p5", name: "Booster Box Obsidienne Flammes",                category: "Booster",  price: 119.99, stock: 5,  rating: 4.8, reviews: 72,  badge: null,             image: "/res/course2.png", images: ["/res/course2.png", "/res/course1.png", "/res/course3.png"], description: "La Booster Box Obsidienne Flammes, le set qui a introduit les cartes Tera-type et Charizard ex SIR. Très prisée pour son potentiel pull rate.", features: ["36 boosters par boîte", "Cartes Tera-type exclusives", "Meilleur pull rate de la série", "Produit scellé officiel"] },
    "p6": { id: "p6", name: "ETB Pikachu ex — Destinées de Paldea",          category: "ETB",      price: 59.99,  stock: 10, rating: 4.6, reviews: 44,  badge: "Nouveau",        image: "/res/course3.png", images: ["/res/course3.png", "/res/course1.png", "/res/course2.png"], description: "L'Elite Trainer Box Destinées de Paldea avec Pikachu ex. Parfaite pour les tournois et la collection, avec 8 boosters du dernier set.", features: ["8 boosters Destinées de Paldea", "Carte promo Pikachu ex foil", "65 sleeves thématiques", "Dés et marqueurs inclus"] },
    "p7": { id: "p7", name: "Tin Mew ex Collection",                         category: "Tin",      price: 24.99,  stock: 15, rating: 4.5, reviews: 38,  badge: null,             image: "/res/course1.png", images: ["/res/course1.png", "/res/course2.png", "/res/course3.png"], description: "Le Tin Mew ex Collection — une boîte métal collector avec 3 boosters et une carte promo exclusive. Format idéal pour débuter ou offrir.", features: ["3 boosters inclus", "Carte promo Mew ex foil", "Boîte métal collector", "Format cadeau parfait"] },
    "p8": { id: "p8", name: "Coffret Ultra Premium Charizard",               category: "Coffret",  price: 139.99, stock: 2,  rating: 5.0, reviews: 29,  badge: "Édition Limitée", image: "/res/course2.png", images: ["/res/course2.png", "/res/course1.png", "/res/course3.png"], description: "Le Coffret Ultra Premium Charizard — la pièce maîtresse de toute collection. 16 boosters, 2 cartes promo foil-stamped et une statuette exclusive.", features: ["16 boosters inclus", "2 cartes promo foil-stamped", "Statuette Charizard exclusive", "Numéroté — édition limitée"] },
    "p9": { id: "p9", name: "Booster Pokémon GO — Box Display",              category: "Booster",  price: 109.99, stock: 0,  rating: 4.7, reviews: 61,  badge: null,             image: "/res/course3.png", images: ["/res/course3.png", "/res/course1.png", "/res/course2.png"], description: "La Box Display Pokémon GO — le crossover officiel entre le jeu de cartes et l'appli mobile. Set en rupture, à surveiller pour le restockage.", features: ["36 boosters par boîte", "Cartes Radiant exclusives", "Collaboration officielle GO", "Set collector recherché"] },
};

const SIMILAIRES = [
    { id: "p1", name: "Coffret Dresseur d'Élite",    price: 54.99,  img: "/res/course1.png" },
    { id: "p3", name: "ETB Charizard ex",             price: 69.99,  img: "/res/course3.png" },
    { id: "p8", name: "Coffret Ultra Premium",        price: 139.99, img: "/res/course2.png" },
];

export default function ProduitDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { dispatch } = useCart();
    const [qty, setQty]            = useState(1);
    const [activeImg, setActiveImg] = useState(0);

    const produit = PRODUITS[id] ?? PRODUITS["p1"];

    function addToCart() {
        dispatch({ type: "ADD_ITEM", payload: { _id: produit.id, nameFR: produit.name, price: produit.price, quantity: qty, stock: produit.stock, itemType: "accessory" } });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/sequiper/produits" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux produits
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">

                    {/* Images */}
                    <div>
                        <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#e5e7eb] shadow-sm">
                            <img src={produit.images[activeImg]} alt={produit.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-3 mt-4">
                            {produit.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[#01509d]" : "border-[#e5e7eb] hover:border-[#01509d]"}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-[#01509d] bg-[#eef5fb] px-2 py-0.5 rounded-full">{produit.category}</span>
                                {produit.badge && (
                                    <span className="text-xs font-bold text-white bg-[#01509d] px-2 py-0.5 rounded-full">{produit.badge}</span>
                                )}
                            </div>
                            <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] mt-2">{produit.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1 text-sm text-[#808896]">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {produit.rating} ({produit.reviews} avis)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-['Poppins'] font-bold text-4xl text-[#140759]">{produit.price.toFixed(2).replace(".", ",")} €</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${produit.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                {produit.stock > 0 ? `${produit.stock} en stock` : "Rupture"}
                            </span>
                        </div>

                        <p className="text-sm text-[#4b5563] leading-relaxed">{produit.description}</p>

                        {/* Contenu */}
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Package className="w-4 h-4 text-[#01509d]" />
                                <h3 className="font-['Inter'] font-semibold text-sm text-[#140759]">Contenu du coffret</h3>
                            </div>
                            <ul className="space-y-2">
                                {produit.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-[#4b5563]">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2 text-sm text-[#4b5563]">
                            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#01509d]" /> Livraison gratuite dès 50€</div>
                            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#01509d]" /> Produit scellé authentique garanti</div>
                        </div>

                        {/* Quantité + panier */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center text-[#140759] hover:bg-gray-50">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-[#140759]">{qty}</span>
                                <button onClick={() => setQty(Math.min(produit.stock, qty + 1))} className="w-10 h-11 flex items-center justify-center text-[#140759] hover:bg-gray-50">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={produit.stock === 0}
                                className="flex-1 h-11 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 text-white font-['Inter'] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>

                {/* Produits similaires */}
                <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-5">Produits similaires</h2>
                <div className="grid sm:grid-cols-3 gap-5">
                    {SIMILAIRES.filter((s) => s.id !== id).map((s) => (
                        <Link key={s.id} href={`/sequiper/produits/${s.id}`} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-36"><img src={s.img} alt={s.name} className="w-full h-full object-cover" /></div>
                            <div className="p-4 flex items-center justify-between">
                                <p className="font-['Inter'] font-semibold text-sm text-[#140759]">{s.name}</p>
                                <span className="font-['Poppins'] font-bold text-[#140759]">{s.price.toFixed(2).replace(".", ",")} €</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
