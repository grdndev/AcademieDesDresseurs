"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { formatPrice } from "../../../utils";
import { useCart } from "../../../context/cart-provider";
import { card } from "../../../types/card";
import { ArrowLeft, Star, ShoppingCart, Shield, Truck, Minus, Plus } from "lucide-react";
import getApiBase from "@/app/lib/api";

const CONDITIONS = [
    { label: "Near Mint",  mult: 1.0 },
    { label: "Excellent",  mult: 0.8 },
    { label: "Played",     mult: 0.6 },
];

const VERSIONS = [
    { label: "Holo",    mult: 1.2 },
    { label: "Reverse", mult: 0.8 },
    { label: "Base",    mult: 0.4 },
];

export default function DetailCartePage() {
    const { id } = useParams<{ id: string }>();
    const { dispatch } = useCart();

    const [data, setData]         = useState<card | null>(null);
    const [loading, setLoading]   = useState(true);
    const [condition, setCondition] = useState(0);
    const [version, setVersion]   = useState(0);
    const [qty, setQty]           = useState(1);

    useEffect(() => {
        fetch(`${getApiBase()}/cards/${id}`)
            .then((r) => r.json())
            .then((d) => setData(d.card))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f9fafb]">
                <Navbar /> 
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-[#01509d] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    const basePrice   = data.price;
    const finalPrice  = basePrice * CONDITIONS[condition].mult * VERSIONS[version].mult;

    function addToCart() {
        if (!data) return;
        dispatch({ type: "ADD_ITEM", payload: { ...data, price: finalPrice, quantity: qty, itemType: "card" } });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/sequiper/cartes" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour aux cartes
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Image */}
                    <div>
                        <div className="relative aspect-[2/3] max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl">
                            {data.images.front ? (
                                <Image src={data.images.front} fill className="object-cover" alt={data.nameFR ?? data.nameEN} unoptimized />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Pas d&apos;image</div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="flex justify-center gap-3 mt-4">
                            {([
                                data.images?.front,
                                (data.images as unknown as { back?: string } | undefined)?.back,
                            ])
                                .filter((img): img is string => Boolean(img))
                                .slice(0, 4)
                                .map((img, i) => (
                                    <div key={i} className="w-16 h-20 rounded-lg overflow-hidden border-2 border-[#e5e7eb] cursor-pointer hover:border-[#01509d] transition-colors">
                                        <Image src={img} width={64} height={80} className="object-cover w-full h-full" alt="" unoptimized />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-6">
                        {/* En-tête */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex items-center gap-1 text-sm text-[#808896]">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9/5
                                    <span className="text-xs">(124 avis)</span>
                                </span>
                            </div>
                            <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759]">{data.nameFR ?? data.nameEN}</h1>
                            <p className="text-sm text-[#808896] mt-1">{data.setCode} · {data.setNameFR}</p>
                        </div>

                        {/* Prix + stock */}
                        <div className="flex items-center gap-4">
                            <span className="font-['Poppins'] font-bold text-4xl text-[#140759]">{formatPrice(finalPrice)} €</span>
                            <div className="flex gap-2">
                                {data.stock > 0 ? (
                                    <>
                                        <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">En stock</span>
                                        {data.stock < 5 && <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">Stock limité</span>}
                                    </>
                                ) : (
                                    <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">Rupture</span>
                                )}
                            </div>
                        </div>

                        {/* État de la carte */}
                        <div className="bg-white rounded-2xl p-4 border border-[#e5e7eb]">
                            <h3 className="font-['Inter'] font-semibold text-sm text-[#140759] mb-3">État de la carte</h3>
                            <div className="space-y-2">
                                {CONDITIONS.map(({ label, mult }, i) => (
                                    <label key={label} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${condition === i ? "bg-[#eef5fb] border border-[#01509d]" : "border border-transparent hover:bg-gray-50"}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="condition" checked={condition === i} onChange={() => setCondition(i)} className="accent-[#01509d]" />
                                            <span className="text-sm font-medium text-[#140759]">{label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#140759]">{formatPrice(basePrice * mult)} €</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Version */}
                        <div className="bg-white rounded-2xl p-4 border border-[#e5e7eb]">
                            <h3 className="font-['Inter'] font-semibold text-sm text-[#140759] mb-3">Choisissez votre version</h3>
                            <div className="space-y-2">
                                {VERSIONS.map(({ label, mult }, i) => (
                                    <label key={label} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${version === i ? "bg-[#eef5fb] border border-[#01509d]" : "border border-transparent hover:bg-gray-50"}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="version" checked={version === i} onChange={() => setVersion(i)} className="accent-[#01509d]" />
                                            <span className="text-sm font-medium text-[#140759]">{label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#140759]">{formatPrice(basePrice * mult)} €</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 text-sm text-[#4b5563]">
                            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#01509d]" /> Livraison gratuite dès 50€</div>
                            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#01509d]" /> Garantie authenticité 100%</div>
                        </div>

                        {/* Quantité + panier */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center text-[#140759] hover:bg-gray-50 transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-[#140759]">{qty}</span>
                                <button onClick={() => setQty(Math.min(data.stock, qty + 1))} className="w-10 h-11 flex items-center justify-center text-[#140759] hover:bg-gray-50 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={data.stock === 0}
                                className="flex-1 h-11 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 text-white font-['Inter'] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
