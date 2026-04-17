"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Users, Star, CheckCircle } from "lucide-react";
import { useCart } from "@/app/context/cart-provider";

const DECKS: Record<string, {
    id: string; name: string; description: string; author: string;
    price: number; stock: number; image: string; badges: string[];
    format: string; level: string; rating: number; reviews: number;
    cards: { qty: number; name: string; type: string }[];
    strategy: string;
}> = {
    d1: {
        id: "d1", name: "Lugia VSTar Combo", image: "/res/course1.png",
        badges: ["Méta", "Standard"], format: "Standard", level: "Avancé",
        price: 29, stock: 5, author: "Tonio", rating: 4.8, reviews: 42,
        description: "Un deck agressif basé sur les attaques dévastatrices de Lugia VSTAR, couplé à des Pokémon d'énergie pour une pression constante.",
        strategy: "L'objectif est de setup Lugia VSTAR dès le tour 2 et d'enchaîner les KO en utilisant ses attaques de recharge d'énergie pour accélérer votre board.",
        cards: [
            { qty: 4, name: "Lugia V", type: "Pokémon" },
            { qty: 3, name: "Lugia VSTAR", type: "Pokémon" },
            { qty: 2, name: "Archeops", type: "Pokémon" },
            { qty: 4, name: "Professeur Magnolia", type: "Dresseur" },
            { qty: 4, name: "Marnie", type: "Dresseur" },
            { qty: 4, name: "Boss's Orders", type: "Dresseur" },
            { qty: 4, name: "Ultra Ball", type: "Objet" },
            { qty: 4, name: "Capture Energy", type: "Énergie" },
            { qty: 4, name: "Double Turbo Energy", type: "Énergie" },
        ],
    },
    d2: {
        id: "d2", name: "Miraidon ex Turbo", image: "/res/course2.png",
        badges: ["Méta", "Standard"], format: "Standard", level: "Intermédiaire",
        price: 29, stock: 3, author: "Lucas B.", rating: 4.6, reviews: 38,
        description: "Deck électrique ultra-rapide basé sur l'accélération d'énergie de Miraidon ex pour construire un board menaçant en 1-2 tours.",
        strategy: "Utilisez Miraidon ex pour attacher des énergies Foudre depuis la défausse sur vos Pokémon et créez une présence écrasante dès les premiers tours.",
        cards: [
            { qty: 4, name: "Miraidon ex", type: "Pokémon" },
            { qty: 3, name: "Raichu V", type: "Pokémon" },
            { qty: 2, name: "Raichu VMAX", type: "Pokémon" },
            { qty: 4, name: "Iono", type: "Dresseur" },
            { qty: 4, name: "Arven", type: "Dresseur" },
            { qty: 4, name: "Nest Ball", type: "Objet" },
            { qty: 4, name: "Electric Generator", type: "Objet" },
            { qty: 12, name: "Énergie Foudre", type: "Énergie" },
        ],
    },
};

const BADGE_COLORS: Record<string, string> = {
    Méta: "bg-[#01509d] text-white",
    Courant: "bg-[#16a34a] text-white",
    Standard: "bg-[#dbb42b] text-[#1a3a6e]",
};

const TYPE_COLORS: Record<string, string> = {
    "Pokémon": "bg-red-50 text-red-600",
    "Dresseur": "bg-blue-50 text-blue-600",
    "Objet": "bg-purple-50 text-purple-600",
    "Énergie": "bg-yellow-50 text-yellow-700",
};

export default function DeckDetailPage({ params }: { params: { id: string } }) {
    const { dispatch } = useCart();
    const deck = DECKS[params.id] ?? DECKS["d1"];

    function addToCart() {
        dispatch({
            type: "ADD_ITEM",
            payload: { _id: deck.id, nameFR: deck.name, price: deck.price, quantity: 1, stock: deck.stock, itemType: "accessory" },
        });
    }

    const grouped = deck.cards.reduce<Record<string, typeof deck.cards>>((acc, c) => {
        (acc[c.type] ??= []).push(c);
        return acc;
    }, {});

    return (
        <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
            <Link href="/sequiper/decks" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour aux decks
            </Link>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero */}
                    <div className="relative h-64 rounded-2xl overflow-hidden">
                        <Image src={deck.image} alt={deck.name} fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-5 left-6">
                            <div className="flex gap-2 mb-2">
                                {deck.badges.map((b) => (
                                    <span key={b} className={`text-xs font-bold px-2.5 py-1 rounded-md ${BADGE_COLORS[b] ?? "bg-gray-200"}`}>{b}</span>
                                ))}
                            </div>
                            <h1 className="font-['Poppins'] font-bold text-2xl text-white">{deck.name}</h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
                                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {deck.author}</span>
                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {deck.rating} ({deck.reviews} avis)</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Présentation</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{deck.description}</p>
                    </div>

                    {/* Strategy */}
                    <div className="bg-[#e3ecf8] rounded-2xl p-6">
                        <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Stratégie</h2>
                        <p className="text-sm text-[#274c78] leading-relaxed">{deck.strategy}</p>
                    </div>

                    {/* Decklist */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-5">Liste du deck</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(grouped).map(([type, cards]) => (
                                <div key={type}>
                                    <h3 className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 ${TYPE_COLORS[type] ?? "bg-gray-100 text-gray-600"}`}>
                                        {type} ({cards.reduce((s, c) => s + c.qty, 0)})
                                    </h3>
                                    <ul className="space-y-1">
                                        {cards.map((c) => (
                                            <li key={c.name} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{c.name}</span>
                                                <span className="font-semibold text-[#140759] bg-gray-50 w-7 h-7 rounded-lg flex items-center justify-center text-xs">{c.qty}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-6 space-y-5">
                        <div>
                            <span className="font-['Poppins'] font-bold text-4xl text-[#140759]">{deck.price} €</span>
                            <span className={`ml-3 text-sm font-semibold ${deck.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                                {deck.stock > 0 ? `${deck.stock} en stock` : "Rupture"}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            {[
                                { label: "Format", value: deck.format },
                                { label: "Niveau", value: deck.level },
                                { label: "Cartes", value: `${deck.cards.reduce((s, c) => s + c.qty, 0)} cartes` },
                            ].map((r) => (
                                <div key={r.label} className="flex justify-between text-gray-600">
                                    <span>{r.label}</span>
                                    <span className="font-semibold text-[#140759]">{r.value}</span>
                                </div>
                            ))}
                        </div>

                        <ul className="space-y-2 text-sm">
                            {["Deck prêt à jouer", "Validé par nos experts", "Livraison sous 48h"].map((f) => (
                                <li key={f} className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={addToCart}
                            disabled={deck.stock === 0}
                            className="w-full h-12 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-['Inter'] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" /> Ajouter au panier
                        </button>

                        <Link
                            href="/sequiper/builder"
                            className="block w-full h-10 border border-[#01509d] text-[#01509d] font-['Inter'] font-semibold text-sm rounded-xl flex items-center justify-center hover:bg-[#01509d]/5 transition-colors"
                        >
                            Construire carte par carte
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
