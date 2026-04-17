'use client';

import { card } from "@/app/types/card";
import { formatPrice } from "../../utils";
import { useCart } from "@/app/context/cart-provider";
import { useState } from "react";
import RequestedCardSmall from "@/app/components/RequestedCardSmall";
import Navbar from "@/app/components/Navbar";
import getApiBase from "@/app/lib/api";
import { ClipboardList, Search, PackageCheck, ShoppingCart, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const STEPS = [
    { icon: ClipboardList, label: "Collez votre decklist" },
    { icon: Search,        label: "Analyse automatique" },
    { icon: PackageCheck,  label: "Vérification du stock" },
    { icon: ShoppingCart,  label: "Panier généré" },
];

export default function BuilderPage() {
    const { dispatch } = useCart();
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<{ results: { found: { card: card; requested: number }[]; notfound: { card: { name: string; setCode: string; cardNumber: string } }[] } }>({ results: { found: [], notfound: [] } });

    const available   = cards.results.found.filter((c) => c.requested <= c.card?.stock);
    const unavailable = cards.results.found.filter((c) => c.requested > c.card?.stock);
    const total       = available.reduce((s, i) => s + i.card.price * i.requested, 0)
                      + unavailable.reduce((s, i) => s + i.card.price * i.card.stock, 0);
    const hasResults  = cards.results.found.length > 0 || cards.results.notfound.length > 0;

    async function parseDecklist(value: string) {
        setLoading(true);
        const lines    = value.split("\n").map((e) => e.trim()).filter((e) => !e.includes(":") && e.length);
        const decklist = lines.map((line) => ({
            quantity:   line.split(" ")[0],
            name:       line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/)?.[0] ?? null,
            setCode:    line.match(/[A-Z]{3}(?=\s[\d\/]+$)/)?.[0] ?? null,
            cardNumber: line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/)?.[0] ?? null,
        }));

        try {
            const res  = await fetch(`${getApiBase()}/cards/batch-check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cards: decklist }) });
            const data = await res.json();
            setCards(data);
        } catch {
            // silently fail — user can retry
        } finally {
            setLoading(false);
        }
    }

    function addToCart() {
        const payload = [
            ...available.map((i) => ({ ...i.card, quantity: i.requested })),
            ...unavailable.map((i) => ({ ...i.card, quantity: i.card.stock })),
        ];
        dispatch({ type: "ADD_DECKLIST", payload });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10 space-y-10">

                {/* Comment ça fonctionne */}
                <section className="bg-[#e3ecf8] rounded-2xl p-8">
                    <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-6 text-center">Comment fonctionne l'outil</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STEPS.map(({ icon: Icon, label }, i) => (
                            <div key={label} className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#01509d] flex items-center justify-center relative">
                                    <Icon className="w-5 h-5 text-white" />
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#dbb42b] text-[#140759] text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                                </div>
                                <p className="text-sm font-medium text-[#274c78]">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Textarea */}
                <section className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                    <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-3">Collez votre decklist</h2>
                    <p className="text-sm text-[#808896] mb-4">Format Limitless : <code className="bg-gray-100 px-1 rounded text-xs">4 Lugia V SIT 138</code></p>
                    <textarea
                        onChange={(e) => parseDecklist(e.target.value)}
                        placeholder={"4 Lugia V SIT 138\n3 Lugia VSTAR SIT 139\n2 Archeops SIT 147\n..."}
                        rows={8}
                        className="w-full p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#01509d]/30 focus:border-[#01509d] outline-none resize-none text-[#140759] placeholder:text-[#9ca3af]"
                    />
                    {loading && (
                        <p className="text-sm text-[#01509d] mt-2 animate-pulse">Analyse en cours…</p>
                    )}
                </section>

                {/* Résultats */}
                {hasResults && !loading && (
                    <>
                        <section className="grid md:grid-cols-2 gap-6">
                            {/* Decklist soumise */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Decklist soumise</h2>
                                <div className="space-y-2">
                                    {available.map((c) => (
                                        <div key={c.card._id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-[#140759]">{c.card.nameFR ?? c.card.nameEN}</span>
                                            </div>
                                            <span className="text-[#808896]">×{c.requested}</span>
                                        </div>
                                    ))}
                                    {unavailable.map((c) => (
                                        <div key={c.card._id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                                <span className="text-[#140759]">{c.card.nameFR ?? c.card.nameEN}</span>
                                            </div>
                                            <span className="text-orange-500">{c.card.stock}/{c.requested}</span>
                                        </div>
                                    ))}
                                    {cards.results.notfound.map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                <span className="text-[#9ca3af]">{c.card.name} {c.card.setCode}</span>
                                            </div>
                                            <span className="text-red-400 text-xs">Introuvable</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Analyse du stock */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Analyse du stock</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-sm text-green-700">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Disponibles</span>
                                        </div>
                                        <span className="font-bold text-green-700">{available.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-sm text-orange-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Stock partiel</span>
                                        </div>
                                        <span className="font-bold text-orange-600">{unavailable.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-sm text-red-500">
                                            <XCircle className="w-4 h-4" />
                                            <span>Introuvables</span>
                                        </div>
                                        <span className="font-bold text-red-500">{cards.results.notfound.length}</span>
                                    </div>
                                </div>

                                {/* Aperçu cartes */}
                                {(available.length > 0 || unavailable.length > 0) && (
                                    <div className="mt-4 flex flex-wrap">
                                        {available.map((c) => <RequestedCardSmall card={c} available={true} key={c.card._id} />)}
                                        {unavailable.map((c) => <RequestedCardSmall card={c} available={false} key={c.card._id} />)}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Panier généré */}
                        <section className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-[#e5e7eb]">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759]">Panier généré automatiquement</h2>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                                    <tr>
                                        <th className="text-left px-6 py-3 font-semibold text-[#808896]">Carte</th>
                                        <th className="text-center px-4 py-3 font-semibold text-[#808896]">Qté</th>
                                        <th className="text-right px-4 py-3 font-semibold text-[#808896]">Prix unit.</th>
                                        <th className="text-center px-4 py-3 font-semibold text-[#808896]">Dispo</th>
                                        <th className="text-right px-6 py-3 font-semibold text-[#808896]">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...available, ...unavailable].map((item, i) => (
                                        <tr key={i} className="border-b border-[#e5e7eb] last:border-0">
                                            <td className="px-6 py-3 font-medium text-[#140759]">{item.card.nameFR ?? item.card.nameEN}</td>
                                            <td className="px-4 py-3 text-center text-[#808896]">{item.requested}</td>
                                            <td className="px-4 py-3 text-right text-[#808896]">{formatPrice(item.card.price)} €</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.requested <= item.card.stock ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-600"}`}>
                                                    {Math.min(item.requested, item.card.stock)}/{item.requested}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-[#140759]">
                                                {formatPrice(item.card.price * Math.min(item.requested, item.card.stock))} €
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#f9fafb] border-t border-[#e5e7eb]">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 font-bold text-[#140759]">
                                            Total {unavailable.length > 0 && <span className="text-orange-500 text-xs font-normal">(achat partiel)</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right font-['Poppins'] font-bold text-xl text-[#140759]">{formatPrice(total)} €</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="px-6 py-4 flex justify-end">
                                <button
                                    onClick={addToCart}
                                    className="h-11 px-8 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center gap-2 transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" /> Soumettre ma commande
                                </button>
                            </div>
                        </section>
                    </>
                )}

            </main>
        </div>
    );
}
