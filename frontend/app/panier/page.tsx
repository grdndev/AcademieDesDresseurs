"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { formatPrice } from "../utils";
import getApiBase from "@/app/lib/api";
import { useCart } from "../context/cart-provider";
import { cartItem } from "@/app/types/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck, Shield } from "lucide-react";

export default function PanierPage() {
    const { state, dispatch } = useCart();

    const subtotal  = state.items.reduce((sum: number, item: cartItem) => sum + item.price * item.quantity, 0);
    const missing   = state.items.filter((item: cartItem) => item.stock !== undefined && item.quantity > item.stock);
    const isValid   = missing.length === 0;
    const shipping  = subtotal >= 50 ? 0 : subtotal >= 25 ? 2.99 : 4.99;
    const total     = subtotal + shipping;

    function handleQty(id: string, qty: number) {
        if (qty <= 0) dispatch({ type: "REMOVE_ITEM", payload: id });
        else dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: qty } });
    }

    const checkCart = async () => {
        if (state.items.length === 0) return;
        try {
            const items = state.items.map((item: cartItem) => ({ itemType: item.itemType, itemId: item._id, quantity: item.quantity }));
            const response = await fetch(`${getApiBase()}/orders/check-cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });
            const data = await response.json();
            const itemsWithStock = data.stock.map((i: cartItem) => {
                const ci = state.items.find((c: cartItem) => c._id === i._id);
                return { ...ci, stock: i.stock };
            });
            dispatch({ type: "SET_STOCK", payload: itemsWithStock });
        } catch {}
    };

    useEffect(() => { checkCart(); }, []);

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

                <Link href="/sequiper" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continuer mes achats
                </Link>

                {/* Stock alerts */}
                {!isValid && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
                        <p className="font-semibold mb-1">Certains articles dépassent le stock disponible :</p>
                        {missing.map((item: cartItem) => (
                            <p key={item._id}>
                                — {item.nameFR ?? item.nameEN} : {item.quantity} demandés /{" "}
                                {item.stock !== undefined && item.stock > 0 ? `${item.stock} en stock` : "rupture"}
                            </p>
                        ))}
                    </div>
                )}

                {state.items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-16 flex flex-col items-center gap-5">
                        <ShoppingBag className="w-14 h-14 text-[#e5e7eb]" />
                        <p className="font-['Poppins'] font-bold text-xl text-[#140759]">Votre panier est vide</p>
                        <p className="text-sm text-[#808896]">Parcourez notre boutique et ajoutez des articles.</p>
                        <Link href="/sequiper" className="h-11 px-6 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center gap-2 transition-colors">
                            <ShoppingBag className="w-4 h-4" /> Découvrir la boutique
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* ── Articles ── */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="font-['Poppins'] font-bold text-lg text-[#140759] mb-2">
                                Mon panier ({state.items.length} article{state.items.length > 1 ? "s" : ""})
                            </h2>

                            {state.items.map((item: cartItem) => {
                                const overStock = item.stock !== undefined && item.quantity > item.stock;
                                return (
                                    <div key={item._id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 ${overStock ? "border-red-300" : "border-[#e5e7eb]"}`}>
                                        {/* Thumbnail */}
                                        <div className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#f3f4f6]">
                                            {item.images?.front ? (
                                                <Image src={item.images.front} width={64} height={80} className="object-cover w-full h-full" alt={item.nameFR ?? item.nameEN ?? ""} unoptimized />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-xs">—</div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-['Inter'] font-semibold text-sm text-[#140759] truncate">{item.nameFR ?? item.nameEN}</p>
                                            {overStock && (
                                                <p className="text-xs text-red-500 mt-0.5">Stock insuffisant ({item.stock} disponible{item.stock !== 1 ? "s" : ""})</p>
                                            )}
                                            <p className="text-xs text-[#808896] mt-1 capitalize">{item.itemType}</p>
                                        </div>

                                        {/* Qty */}
                                        <div className="flex items-center border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                                            <button onClick={() => handleQty(item._id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-[#140759] hover:bg-gray-50 transition-colors">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-[#140759]">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQty(item._id, item.quantity + 1)}
                                                disabled={item.stock !== undefined && item.quantity >= item.stock}
                                                className="w-9 h-9 flex items-center justify-center text-[#140759] hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-['Poppins'] font-bold text-[#140759]">{formatPrice(item.price * item.quantity)} €</p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-[#808896]">{formatPrice(item.price)} € / unité</p>
                                            )}
                                        </div>

                                        {/* Remove */}
                                        <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item._id })} className="w-9 h-9 flex items-center justify-center text-[#808896] hover:text-red-500 transition-colors flex-shrink-0">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Résumé ── */}
                        <div>
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 sticky top-6">
                                <h2 className="font-['Poppins'] font-bold text-lg text-[#140759] mb-6">Résumé de la commande</h2>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between text-[#4b5563]">
                                        <span>Sous-total</span>
                                        <span className="font-semibold text-[#140759]">{formatPrice(subtotal)} €</span>
                                    </div>
                                    <div className="flex justify-between text-[#4b5563]">
                                        <span>Livraison</span>
                                        {shipping === 0 ? (
                                            <span className="font-semibold text-green-600">Gratuite</span>
                                        ) : (
                                            <span className="font-semibold text-[#140759]">{formatPrice(shipping)} €</span>
                                        )}
                                    </div>
                                    {subtotal > 0 && subtotal < 50 && (
                                        <p className="text-xs text-[#808896] bg-[#f9fafb] rounded-xl p-3">
                                            Plus que <span className="font-semibold text-[#01509d]">{formatPrice(50 - subtotal)} €</span> pour la livraison gratuite !
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-[#e5e7eb] pt-4 mb-6 flex justify-between items-center">
                                    <span className="font-['Poppins'] font-bold text-[#140759]">Total</span>
                                    <span className="font-['Poppins'] font-bold text-2xl text-[#140759]">{formatPrice(total)} €</span>
                                </div>

                                {isValid ? (
                                    <Link href="/panier/checkout" className="block w-full h-12 bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        Commander
                                    </Link>
                                ) : (
                                    <div className="block w-full h-12 bg-gray-200 text-gray-500 font-['Inter'] font-bold text-sm rounded-xl flex items-center justify-center cursor-not-allowed">
                                        Commander
                                    </div>
                                )}

                                <div className="mt-4 space-y-2 text-xs text-[#808896]">
                                    <div className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-[#01509d]" /> Livraison gratuite dès 50 €</div>
                                    <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[#01509d]" /> Paiement sécurisé</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state.items.length > 0 && (
                    <section className="mt-12">
                        <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] mb-6">Vous pourriez aussi aimer</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { title: "Dragon Shield Sleeves x100", type: "Accessoire", price: 12.99, color: "bg-[#01509d]",   href: "/sequiper/accessoires" },
                                { title: "Charizard ex Control Deck",  type: "Deck",       price: 34,    color: "bg-[#140759]",   href: "/sequiper/decks" },
                                { title: "Booster Box Paldea",         type: "Produit",    price: 129.99,color: "bg-[#4f46e5]",   href: "/sequiper/produits" },
                                { title: "Cours : Bases du TCG",       type: "Cours",      price: 19,    color: "bg-[#059669]",   href: "/apprendre" },
                            ].map((p) => (
                                <Link key={p.title} href={p.href} className={`${p.color} rounded-2xl p-5 flex flex-col gap-3 min-h-[110px] hover:opacity-90 transition-opacity`}>
                                    <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full w-fit">{p.type}</span>
                                    <p className="font-['Inter'] font-bold text-sm text-white leading-snug flex-1">{p.title}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-['Poppins'] font-bold text-white">{p.price.toFixed(2).replace(".", ",")} €</span>
                                        <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">Voir</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
