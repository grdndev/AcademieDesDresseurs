"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { formatPrice } from "@/app/utils";
import getApiBase from "@/app/lib/api";
import { useCart } from "@/app/context/cart-provider";
import { useParams } from "next/navigation";
import { CheckCircle, ArrowLeft, Truck, Shield, Package } from "lucide-react";

interface OrderItem {
    _id: string;
    itemType: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    customerInfo: { firstName: string; lastName: string; email: string; phone: string };
    shippingAddress: { street: string; city: string; zipCode: string; country: string };
    items: OrderItem[];
    pricing: { subtotal: number; shippingCost: number; discount: number; tax: number; total: number };
    payment: { method: string; status: string };
}

export default function PaymentPage() {
    const { dispatch } = useCart();
    const params = useParams();
    const orderId = params.orderId as string;

    const [order, setOrder]               = useState<Order | null>(null);
    const [loading, setLoading]           = useState(true);
    const [paying, setPaying]             = useState(false);
    const [error, setError]               = useState("");
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    useEffect(() => {
        if (orderId.startsWith("MOCK-")) {
            const raw = sessionStorage.getItem(`mock_order_${orderId}`);
            if (raw) {
                const { formData: fd, items, subtotal, shipping, total } = JSON.parse(raw);
                setOrder({
                    _id: orderId,
                    orderNumber: orderId,
                    status: "pending",
                    customerInfo: { firstName: fd.firstName, lastName: fd.lastName, email: fd.email, phone: fd.phone },
                    shippingAddress: { street: fd.street, city: fd.city, zipCode: fd.zipCode, country: fd.country },
                    items: items.map((i: any) => ({
                        _id: i._id,
                        itemType: i.itemType ?? "carte",
                        name: i.nameFR ?? i.nameEN ?? "Article",
                        quantity: i.quantity,
                        unitPrice: i.price,
                        subtotal: i.price * i.quantity,
                    })),
                    pricing: { subtotal, shippingCost: shipping, discount: 0, tax: Math.round(subtotal * 0.2 * 100) / 100, total },
                    payment: { method: "stripe", status: "pending" },
                });
            } else {
                setError("Données de commande introuvables");
            }
            setLoading(false);
            return;
        }
        // API réelle
        fetch(`${getApiBase()}/orders/${orderId}`)
            .then((r) => { if (!r.ok) throw new Error("Commande introuvable"); return r.json(); })
            .then((d) => setOrder(d.order))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [orderId]);

    async function handlePayment() {
        if (!order) return;
        setPaying(true);
        setError("");
        if (orderId.startsWith("MOCK-")) {
            await new Promise(r => setTimeout(r, 800));
            setPaymentCompleted(true);
            setOrder({ ...order, payment: { ...order.payment, status: "completed" } });
            dispatch({ type: "CLEAR_CART" });
            setPaying(false);
            return;
        }
        try {
            const r = await fetch(`${getApiBase()}/payment/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });
            if (!r.ok) throw new Error("Erreur lors du traitement du paiement");
            setPaymentCompleted(true);
            setOrder({ ...order, payment: { ...order.payment, status: "completed" } });
            dispatch({ type: "CLEAR_CART" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du paiement");
        } finally {
            setPaying(false);
        }
    }

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

    if (!order) {
        return (
            <div className="min-h-screen bg-[#f9fafb]">
                <Navbar /> 
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-20 text-center">
                    <p className="text-red-500 mb-4">{error || "Commande introuvable"}</p>
                    <Link href="/sequiper" className="inline-flex h-11 px-6 bg-[#01509d] text-white font-bold text-sm rounded-xl items-center">Retour aux achats</Link>
                </div>
            </div>
        );
    }

    /* ─── Commande confirmée ─── */
    if (paymentCompleted) {
        return (
            <div className="min-h-screen bg-[#f9fafb]">
                <Navbar /> 
                <main className="max-w-[760px] mx-auto px-6 py-16">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Commande confirmée !</h1>
                        <p className="text-sm text-[#808896]">
                            Un email de confirmation a été envoyé à <span className="font-semibold text-[#140759]">{order.customerInfo.email}</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xs text-[#808896] mb-0.5">Numéro de commande</p>
                                <p className="font-['Poppins'] font-bold text-[#140759]">#{order.orderNumber}</p>
                            </div>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">Confirmée</span>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 mb-5">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center">
                                            <Package className="w-4 h-4 text-[#808896]" />
                                        </div>
                                        <span className="text-[#140759] font-medium">{item.quantity}× {item.name}</span>
                                    </div>
                                    <span className="font-bold text-[#140759]">{formatPrice(item.subtotal)} €</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing */}
                        <div className="border-t border-[#e5e7eb] pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-[#4b5563]">
                                <span>Sous-total</span>
                                <span className="font-semibold text-[#140759]">{formatPrice(order.pricing.subtotal)} €</span>
                            </div>
                            {order.pricing.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Remise</span>
                                    <span className="font-semibold">−{formatPrice(order.pricing.discount)} €</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#4b5563]">
                                <span>Livraison</span>
                                {order.pricing.shippingCost === 0
                                    ? <span className="font-semibold text-green-600">Gratuite</span>
                                    : <span className="font-semibold text-[#140759]">{formatPrice(order.pricing.shippingCost)} €</span>
                                }
                            </div>
                            <div className="border-t border-[#e5e7eb] pt-3 flex justify-between">
                                <span className="font-['Poppins'] font-bold text-[#140759]">Total</span>
                                <span className="font-['Poppins'] font-bold text-xl text-[#140759]">{formatPrice(order.pricing.total)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Adresse */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-[#01509d]" />
                            <h3 className="font-['Inter'] font-semibold text-sm text-[#140759]">Livraison</h3>
                        </div>
                        <p className="text-sm text-[#4b5563]">
                            {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.zipCode} {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/sequiper" className="flex-1 h-12 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                            Continuer mes achats
                        </Link>
                        <Link href="/espace-joueur" className="flex-1 h-12 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center justify-center transition-colors">
                            Voir mes commandes
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    /* ─── Paiement en attente ─── */
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[760px] mx-auto px-6 py-10">
                <Link href="/panier/checkout" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour à la livraison
                </Link>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">{error}</div>
                )}

                {/* Livraison */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck className="w-4 h-4 text-[#01509d]" />
                        <h3 className="font-['Inter'] font-semibold text-sm text-[#140759]">Adresse de livraison</h3>
                    </div>
                    <p className="text-sm text-[#4b5563]">
                        {order.customerInfo.firstName} {order.customerInfo.lastName} · {order.shippingAddress.street}, {order.shippingAddress.zipCode} {order.shippingAddress.city}
                    </p>
                </div>

                {/* Articles */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 mb-5">
                    <h3 className="font-['Inter'] font-semibold text-sm text-[#140759] mb-4">Articles</h3>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item._id} className="flex justify-between text-sm">
                                <span className="text-[#4b5563]">{item.quantity}× {item.name}</span>
                                <span className="font-bold text-[#140759]">{formatPrice(item.subtotal)} €</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totaux */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5 mb-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#4b5563]"><span>Sous-total</span><span className="font-semibold text-[#140759]">{formatPrice(order.pricing.subtotal)} €</span></div>
                        {order.pricing.discount > 0 && <div className="flex justify-between text-green-600"><span>Remise</span><span className="font-semibold">−{formatPrice(order.pricing.discount)} €</span></div>}
                        <div className="flex justify-between text-[#4b5563]"><span>Livraison</span>{order.pricing.shippingCost === 0 ? <span className="font-semibold text-green-600">Gratuite</span> : <span className="font-semibold text-[#140759]">{formatPrice(order.pricing.shippingCost)} €</span>}</div>
                        <div className="flex justify-between text-[#4b5563]"><span>TVA (20%)</span><span className="font-semibold text-[#140759]">{formatPrice(order.pricing.tax)} €</span></div>
                    </div>
                    <div className="border-t border-[#e5e7eb] mt-3 pt-3 flex justify-between">
                        <span className="font-['Poppins'] font-bold text-[#140759]">Total</span>
                        <span className="font-['Poppins'] font-bold text-xl text-[#140759]">{formatPrice(order.pricing.total)} €</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full h-12 bg-[#dbb42b] hover:bg-[#c9a120] disabled:opacity-50 text-[#140759] font-['Inter'] font-bold rounded-xl transition-colors mb-3"
                >
                    {paying ? "Traitement…" : `Payer ${formatPrice(order.pricing.total)} €`}
                </button>

                <div className="flex justify-center gap-4 text-xs text-[#808896]">
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-[#01509d]" /> Paiement sécurisé</span>
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#01509d]" /> Livraison rapide</span>
                </div>
            </main>
        </div>
    );
}
