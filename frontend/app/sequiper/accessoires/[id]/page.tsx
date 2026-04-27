"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { useCart } from "../../../context/cart-provider";
import { ArrowLeft, Star, ShoppingCart, Shield, Truck, Minus, Plus, CheckCircle } from "lucide-react";

const PRODUITS: Record<string, { id: string; name: string; category: string; price: number; stock: number; rating: number; reviews: number; image: string; images: string[]; description: string; features: string[] }> = {
    "a1": { id: "a1", name: "Ultra Pro Deck Box",          category: "Rangement",   price: 9.99,  stock: 15, rating: 4.7, reviews: 42,  image: "/res/course1.png", images: ["/res/course1.png", "/res/course2.png", "/res/course3.png"], description: "Deck box rigide Ultra Pro pour protéger vos 80 cartes sleevées. Fermeture magnétique et revêtement anti-scratch.", features: ["Capacité 80 cartes sleevées", "Fermeture magnétique", "Revêtement anti-scratch", "Compatible sleeves standard"] },
    "a2": { id: "a2", name: "Dragon Shield Sleeves x100",  category: "Protèges",    price: 12.99, stock: 8,  rating: 4.9, reviews: 186, image: "/res/course2.png", images: ["/res/course2.png", "/res/course1.png", "/res/course3.png"], description: "Les sleeves Dragon Shield sont la référence pour les joueurs compétitifs. Ultra-transparentes, anti-accroc et résistantes.", features: ["100 sleeves par boîte", "Format standard 66×91mm", "Anti-accroc certifié", "Référence des tournois"] },
    "a3": { id: "a3", name: "Playmat Officiel Pokémon",    category: "Playmat",     price: 24.99, stock: 5,  rating: 4.8, reviews: 73,  image: "/res/course3.png", images: ["/res/course3.png", "/res/course1.png", "/res/course2.png"], description: "Playmat officiel sous licence Pokémon. Surface néoprène antidérapante, idéale pour les tournois et parties à domicile.", features: ["60×35cm — taille tournoi", "Surface néoprène antidérapante", "Sous licence officielle Pokémon", "Lavable à la main"] },
};

const SIMILAIRES = [
    { id: "a1", name: "Ultra Pro Deck Box",         price: 9.99,  img: "/res/course1.png" },
    { id: "a2", name: "Dragon Shield Sleeves x100", price: 12.99, img: "/res/course2.png" },
    { id: "a3", name: "Playmat Officiel Pokémon",   price: 24.99, img: "/res/course3.png" },
];

export default function AccessoireDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { dispatch } = useCart();
    const [qty, setQty]           = useState(1);
    const [activeImg, setActiveImg] = useState(0);

    const produit = PRODUITS[id] ?? PRODUITS["a1"];

    function addToCart() {
        dispatch({ type: "ADD_ITEM", payload: { _id: produit.id, nameFR: produit.name, price: produit.price, quantity: qty, stock: produit.stock, itemType: "accessory" } });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/sequiper/accessoires" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux accessoires
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
                            <span className="text-xs font-semibold text-[#01509d] bg-[#eef5fb] px-2 py-0.5 rounded-full">{produit.category}</span>
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

                        {/* Features */}
                        <ul className="space-y-2">
                            {produit.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#4b5563]">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-2 text-sm text-[#4b5563]">
                            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#01509d]" /> Livraison gratuite dès 50€</div>
                            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#01509d]" /> Produit authentique garanti</div>
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
                        <Link key={s.id} href={`/sequiper/accessoires/${s.id}`} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
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
