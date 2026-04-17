"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { formatPrice } from "../../utils";
import getApiBase from "@/app/lib/api";
import { useCart } from "../../context/cart-provider";
import { useRouter } from "next/navigation";
import { cartItem } from "@/app/types/card";
import { ArrowLeft, Truck, Shield, Tag, ChevronDown } from "lucide-react";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    useSameAddress: boolean;
    billingStreetAddress?: string;
    billingCity?: string;
    billingZipCode?: string;
    billingCountry?: string;
    promocode?: string;
}

const COUNTRIES = ["France", "Belgique", "Suisse", "Luxembourg", "Allemagne", "Italie", "Espagne", "Pays-Bas", "Royaume-Uni"];

const inputClass = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af] disabled:bg-gray-50 disabled:text-[#808896]";
const labelClass = "block text-xs font-semibold text-[#140759] mb-1.5";

export default function CheckoutPage() {
    const { state } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");

    const [formData, setFormData] = useState<FormData>({
        firstName: "", lastName: "", email: "", phone: "",
        street: "", city: "", zipCode: "", country: "France",
        useSameAddress: true, promocode: "",
    });

    const subtotal = state.items.reduce((sum: number, item: cartItem) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : subtotal >= 25 ? 2.99 : 4.99;
    const total    = subtotal + shipping;

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    function validate(): boolean {
        const required: [string, string][] = [
            ["firstName", "Le prénom est requis"], ["lastName", "Le nom est requis"],
            ["email", "L'email est requis"], ["phone", "Le téléphone est requis"],
            ["street", "L'adresse est requise"], ["city", "La ville est requise"],
            ["zipCode", "Le code postal est requis"],
        ];
        for (const [field, msg] of required) {
            if (!(formData as Record<string, unknown>)[field]) { setError(msg); return false; }
        }
        if (!formData.useSameAddress) {
            if (!formData.billingStreetAddress) { setError("L'adresse de facturation est requise"); return false; }
            if (!formData.billingCity)          { setError("La ville de facturation est requise"); return false; }
            if (!formData.billingZipCode)        { setError("Le code postal de facturation est requis"); return false; }
        }
        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await fetch(`${getApiBase()}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: state.items.map((item: cartItem) => ({ itemType: item.itemType || "card", itemId: item._id, quantity: item.quantity })),
                    customerInfo: { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone },
                    shippingAddress: { street: formData.street, city: formData.city, zipCode: formData.zipCode, country: formData.country },
                    billingAddress: formData.useSameAddress
                        ? { street: formData.street, city: formData.city, zipCode: formData.zipCode, country: formData.country }
                        : { street: formData.billingStreetAddress, city: formData.billingCity, zipCode: formData.billingZipCode, country: formData.billingCountry },
                    useSameAddress: formData.useSameAddress,
                    promocode: formData.promocode || undefined,
                    paymentMethod: "stripe",
                }),
            });
            const contentType = response.headers.get("content-type") ?? "";
            if (!response.ok || !contentType.includes("application/json")) {
                // API indisponible → mode mock
                const mockId = `MOCK-${Date.now()}`;
                sessionStorage.setItem(`mock_order_${mockId}`, JSON.stringify({
                    formData,
                    items: state.items,
                    subtotal,
                    shipping,
                    total,
                }));
                router.push(`/panier/paiement/${mockId}`);
                return;
            }
            const data = await response.json();
            router.push(`/panier/paiement/${data.orderId}`);
        } catch {
            // Fetch failed (network error) → mode mock
            const mockId = `MOCK-${Date.now()}`;
            sessionStorage.setItem(`mock_order_${mockId}`, JSON.stringify({
                formData,
                items: state.items,
                subtotal,
                shipping,
                total,
            }));
            router.push(`/panier/paiement/${mockId}`);
        } finally {
            setLoading(false);
        }
    }

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f9fafb]">
                <Navbar /> 
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-20 text-center">
                    <p className="text-[#808896] mb-4">Votre panier est vide.</p>
                    <Link href="/sequiper" className="inline-flex h-11 px-6 bg-[#01509d] text-white font-bold text-sm rounded-xl items-center">Voir la boutique</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">
                <Link href="/panier" className="inline-flex items-center gap-2 text-[#808896] hover:text-[#01509d] text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour au panier
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── Formulaire ── */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">{error}</div>
                            )}

                            {/* Infos personnelles */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                                <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Informations personnelles</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Prénom *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} disabled={loading} placeholder="Jean" /></div>
                                    <div><label className={labelClass}>Nom *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} disabled={loading} placeholder="Dupont" /></div>
                                    <div><label className={labelClass}>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} disabled={loading} placeholder="jean@email.com" /></div>
                                    <div><label className={labelClass}>Téléphone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} disabled={loading} placeholder="+33 6 00 00 00 00" /></div>
                                </div>
                            </div>

                            {/* Adresse livraison */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                                <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Adresse de livraison</h2>
                                <div className="space-y-4">
                                    <div><label className={labelClass}>Adresse *</label><input type="text" name="street" value={formData.street} onChange={handleChange} className={inputClass} disabled={loading} placeholder="12 rue des Champions" /></div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div><label className={labelClass}>Ville *</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} disabled={loading} placeholder="Paris" /></div>
                                        <div><label className={labelClass}>Code postal *</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className={inputClass} disabled={loading} placeholder="75000" /></div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Pays *</label>
                                        <div className="relative">
                                            <select name="country" value={formData.country} onChange={handleChange} className={`${inputClass} appearance-none pr-8`} disabled={loading}>
                                                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="useSameAddress" checked={formData.useSameAddress} onChange={handleChange} className="w-4 h-4 accent-[#01509d]" />
                                        <span className="text-sm text-[#4b5563]">Utiliser la même adresse pour la facturation</span>
                                    </label>
                                </div>
                            </div>

                            {/* Adresse facturation */}
                            {!formData.useSameAddress && (
                                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                                    <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Adresse de facturation</h2>
                                    <div className="space-y-4">
                                        <div><label className={labelClass}>Adresse *</label><input type="text" name="billingStreetAddress" value={formData.billingStreetAddress || ""} onChange={handleChange} className={inputClass} disabled={loading} /></div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Ville *</label><input type="text" name="billingCity" value={formData.billingCity || ""} onChange={handleChange} className={inputClass} disabled={loading} /></div>
                                            <div><label className={labelClass}>Code postal *</label><input type="text" name="billingZipCode" value={formData.billingZipCode || ""} onChange={handleChange} className={inputClass} disabled={loading} /></div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Pays *</label>
                                            <div className="relative">
                                                <select name="billingCountry" value={formData.billingCountry || ""} onChange={handleChange} className={`${inputClass} appearance-none pr-8`} disabled={loading}>
                                                    <option value="">Sélectionner</option>
                                                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Code promo */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                                <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#01509d]" /> Code promo
                                </h2>
                                <input type="text" name="promocode" value={formData.promocode} onChange={handleChange} className={inputClass} disabled={loading} placeholder="Entrez votre code promo (optionnel)" />
                            </div>

                            <div className="flex gap-3">
                                <Link href="/panier" className="flex-1 h-12 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    Retour
                                </Link>
                                <button type="submit" disabled={loading} className="flex-1 h-12 bg-[#dbb42b] hover:bg-[#c9a120] disabled:opacity-50 text-[#140759] font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                                    {loading ? "Création…" : "Procéder au paiement"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Résumé ── */}
                    <div>
                        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 sticky top-6">
                            <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Récapitulatif</h2>

                            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                                {state.items.map((item: cartItem) => (
                                    <div key={item._id} className="flex items-center gap-3">
                                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#f3f4f6] flex-shrink-0">
                                            {item.images?.front ? (
                                                <Image src={item.images.front} width={40} height={48} className="object-cover w-full h-full" alt="" unoptimized />
                                            ) : (
                                                <div className="w-full h-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#140759] truncate">{item.nameFR ?? item.nameEN}</p>
                                            <p className="text-xs text-[#808896]">x{item.quantity}</p>
                                        </div>
                                        <span className="text-xs font-bold text-[#140759] flex-shrink-0">{formatPrice(item.price * item.quantity)} €</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#e5e7eb] pt-4 space-y-2 text-sm mb-4">
                                <div className="flex justify-between text-[#4b5563]">
                                    <span>Sous-total</span>
                                    <span className="font-semibold text-[#140759]">{formatPrice(subtotal)} €</span>
                                </div>
                                <div className="flex justify-between text-[#4b5563]">
                                    <span>Livraison</span>
                                    {shipping === 0
                                        ? <span className="font-semibold text-green-600">Gratuite</span>
                                        : <span className="font-semibold text-[#140759]">{formatPrice(shipping)} €</span>
                                    }
                                </div>
                            </div>

                            <div className="border-t border-[#e5e7eb] pt-4 flex justify-between items-center mb-5">
                                <span className="font-['Poppins'] font-bold text-[#140759]">Total</span>
                                <span className="font-['Poppins'] font-bold text-xl text-[#140759]">{formatPrice(total)} €</span>
                            </div>

                            <div className="space-y-2 text-xs text-[#808896]">
                                <div className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-[#01509d]" /> Livraison gratuite dès 50 €</div>
                                <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[#01509d]" /> Paiement 100% sécurisé</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
