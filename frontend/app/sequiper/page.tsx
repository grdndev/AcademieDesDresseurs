import { Filter, Box, Zap, Layers } from "lucide-react";
import Link from "next/link";

export default function SEquiperPage() {
    const categories = [
        { title: "Decks Préconstruits", count: 24, icon: Layers, href: "/sequiper/decks" },
        { title: "Cartes à l'unité", count: "5000+", icon: Zap, href: "/sequiper/cartes" },
        { title: "Accessoires", count: 120, icon: Box, href: "/sequiper/accessoires" },
    ];

    return (<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {categories.map((cat, idx) => (
                        <Link href={cat.href} key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                                <cat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{cat.title}</h3>
                                <span className="text-sm text-gray-500">{cat.count} articles</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Deck-to-Stock Promo */}
                <div className="bg-[#004A99] rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-10 mb-16 relative overflow-hidden shadow-2xl">
                    <div className="flex-1 relative z-10">
                        <span className="bg-accent text-slate-900 px-3 py-1 rounded-lg text-xs font-black mb-4 inline-block">EXCLUSIVITÉ ACADÉMIE</span>
                        <h2 className="text-3xl font-black mb-4">Outil Deck-to-Stock Builder</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-md">
                            Collez votre decklist (Limitless/Live) et nous préparons votre panier automatiquement selon nos stocks.
                        </p>
                        <button className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
                            Essayer l&apos;outil
                            <Zap className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                    <div className="w-full md:w-1/3 h-64 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center relative z-10">
                        <div className="text-center opacity-50">
                            <Layers className="w-16 h-16 mx-auto mb-4" />
                            <span className="text-sm">Prévisualisation de l'outil</span>
                        </div>
                    </div>
                    {/* Flare */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Filters & Grid Placeholders */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black">Nouveautés</h2>
                    <button className="flex items-center gap-2 text-primary font-bold">
                        <Filter className="w-5 h-5" />
                        Filtres
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-3xl overflow-hidden h-80">
                            <div className="h-48 bg-gray-100"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                                <div className="h-6 bg-gray-100 rounded-full w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
    );
}
