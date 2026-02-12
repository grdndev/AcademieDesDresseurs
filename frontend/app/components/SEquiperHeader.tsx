"use client";

import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "../context/cart-provider";
import Link from "next/link";

export default function SEquiperHeader() {
    const { state } = useCart();

    return (<div className="bg-white border-b border-gray-200 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="grow">
                        <h1 className="text-4xl font-black text-slate-900">Boutique Officielle</h1>
                        <p className="text-gray-500 mt-2">Équipez-vous avec le meilleur matériel TCG.</p>
                    </div>

                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un deck, une carte..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <Link href="/panier" className="flex px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all sm:max-w-md">
                            <ShoppingCart />
                            <div className="px-1 text-xl">Panier</div>
                            {!!state.items.length && <div>{state.items.length}</div>}
                        </Link>
                    </div>
                </div>
            </div>
    </div>);
}