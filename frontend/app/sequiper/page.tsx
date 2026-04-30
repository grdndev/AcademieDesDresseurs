import Link from "next/link";
import { Layers, Search, Box, Zap, ShoppingCart, CheckCircle } from "lucide-react";

const FEATURED_DECKS = [
    { name: "Deck Charizard", img: "/res/course1.png", price: 99 },
    { name: "Deck Pikachu",   img: "/res/course2.png", price: 79 },
    { name: "Deck Mewtwo",    img: "/res/course3.png", price: 99 },
];

const ACCESSORIES = [
    { name: "Protège-cartes", img: "/res/course1.png", price: 12 },
    { name: "Tapis de jeu",   img: "/res/course2.png", price: 35 },
    { name: "Deck Box",       img: "/res/course3.png", price: 25 },
];

const RECOMMENDATIONS = [
    { name: "Charizard ex",     img: "/res/course1.png", price: 159, stock: true },
    { name: "Pikachu VMAX",     img: "/res/course2.png", price: 89,  stock: true },
    { name: "Ultra Pro Sleeves",img: "/res/course3.png", price: 15,  stock: true },
    { name: "Booster Pack",     img: "/res/course1.png", price: 4,   stock: true },
];

export default function SEquiperPage() {
    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* <Navbar /> */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10 space-y-5">

                {/* Builder promo */}
                <div className="bg-gradient-to-r from-[#140759] to-[#01509d] rounded-2xl p-7 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <span className="inline-block text-[10px] font-bold text-[#dbb42b] bg-[#dbb42b]/15 border border-[#dbb42b]/30 px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                            Exclusivité Académie
                        </span>
                        <h2 className="font-['Poppins'] font-bold text-xl text-white mb-2">Outil Deck-to-Stock Builder</h2>
                        <p className="text-sm text-white/70 mb-4 max-w-md">
                            Collez votre decklist Limitless/Live et nous vous préparons votre panier automatiquement selon nos stocks.
                        </p>
                        <Link href="/sequiper/builder"
                            className="inline-flex h-9 px-5 bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl items-center gap-2 transition-colors">
                            <Zap className="w-3.5 h-3.5" /> Essayez l&apos;outil
                        </Link>
                    </div>
                    <div className="hidden md:flex w-48 h-32 bg-white/10 rounded-xl items-center justify-center border border-white/20 flex-shrink-0">
                        <Layers className="w-10 h-10 text-white/40" />
                    </div>
                </div>

                {/* Decks préconstruits */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-7 flex flex-col md:flex-row gap-8">
                    <div className="md:w-64 flex-shrink-0 flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#01509d]/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-[#01509d]" />
                        </div>
                        <h3 className="font-['Poppins'] font-bold text-lg text-[#140759]">Decks préconstruits</h3>
                        <p className="text-sm text-[#808896] leading-relaxed">Decks compétitifs prêts à jouer, optimisés par nos experts pour tous les niveaux.</p>
                        <Link href="/sequiper/decks"
                            className="mt-auto inline-flex h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl items-center transition-colors w-fit">
                            Voir tous les decks
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                        {FEATURED_DECKS.map(d => (
                            <Link key={d.name} href="/sequiper/decks" className="group flex flex-col rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-28 overflow-hidden bg-[#f3f4f6]">
                                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-3">
                                    <p className="font-['Inter'] font-semibold text-xs text-[#140759] mb-1">{d.name}</p>
                                    <p className="font-['Poppins'] font-bold text-sm text-[#01509d]">{d.price}€</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Cartes à l'unité */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-7 flex flex-col md:flex-row gap-8">
                    <div className="md:w-64 flex-shrink-0 flex flex-col gap-3">
                        <h3 className="font-['Poppins'] font-bold text-xl text-[#140759] flex items-center gap-2">
                            <Search className="w-5 h-5 text-[#01509d]" /> Cartes à l&apos;unité
                        </h3>
                        <p className="text-sm text-[#4b5563] leading-relaxed">Plus de 10 000 cartes disponibles. Trouvez exactement ce dont vous avez besoin.</p>
                        <Link href="/sequiper/cartes"
                            className="mt-2 inline-flex h-11 px-5 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl items-center transition-colors w-fit">
                            Rechercher une carte
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 justify-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom de carte…"
                                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#01509d] placeholder:text-[#9ca3af] text-[#140759] shadow-sm"
                                readOnly
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#f9fafb] rounded-xl px-4 py-3 border border-[#e5e7eb]">
                                <p className="font-['Inter'] font-semibold text-sm text-[#140759] mb-0.5">Filtres avancés</p>
                                <p className="text-xs text-[#808896]">Rareté, extension, prix</p>
                            </div>
                            <div className="bg-[#f9fafb] rounded-xl px-4 py-3 border border-[#e5e7eb]">
                                <p className="font-['Inter'] font-semibold text-sm text-[#140759] mb-0.5">État des cartes</p>
                                <p className="text-xs text-[#808896]">Mint, Near Mint, Played</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessoires */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-7 flex flex-col md:flex-row gap-8">
                    <div className="md:w-64 flex-shrink-0 flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Box className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-['Poppins'] font-bold text-lg text-[#140759]">Accessoires</h3>
                        <p className="text-sm text-[#808896] leading-relaxed">Protégez et organisez votre collection avec nos accessoires officiels.</p>
                        <Link href="/sequiper/accessoires"
                            className="mt-auto inline-flex h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl items-center transition-colors w-fit">
                            Explorer les accessoires
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                        {ACCESSORIES.map(a => (
                            <Link key={a.name} href="/sequiper/accessoires" className="group flex flex-col rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-28 overflow-hidden bg-[#f3f4f6]">
                                    <img src={a.img} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-3">
                                    <p className="font-['Inter'] font-semibold text-xs text-[#140759] mb-1">{a.name}</p>
                                    <p className="font-['Poppins'] font-bold text-sm text-[#01509d]">{a.price}€</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Nos recommandations */}
                <section className="pt-4">
                    <h2 className="font-['Poppins'] font-bold text-xl text-[#140759] text-center mb-6">Nos recommandations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {RECOMMENDATIONS.map(r => (
                            <div key={r.name} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden flex flex-col">
                                <div className="h-36 overflow-hidden bg-[#f3f4f6]">
                                    <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 flex flex-col gap-2 flex-1">
                                    <p className="font-['Inter'] font-bold text-sm text-[#140759]">{r.name}</p>
                                    <p className="font-['Poppins'] font-bold text-lg text-[#140759]">{r.price}€</p>
                                    {r.stock && (
                                        <p className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                            <CheckCircle className="w-3.5 h-3.5" /> En stock
                                        </p>
                                    )}
                                    <button className="mt-auto w-full h-9 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                                        <ShoppingCart className="w-3.5 h-3.5" /> Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
