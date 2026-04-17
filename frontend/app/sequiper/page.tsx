import Navbar from "../components/Navbar";
import { Layers, Zap, Box, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
    { icon: Layers,  iconBg: "bg-[#01509d]/10", iconColor: "text-[#01509d]",   title: "Decks préconstruits",    desc: "Decks compétitifs prêts à jouer, validés par nos experts.",           count: "24 decks",      href: "/sequiper/decks",       cta: "Voir les decks" },
    { icon: Zap,     iconBg: "bg-yellow-400/10", iconColor: "text-yellow-600",  title: "Cartes à l'unité",       desc: "Boutique de cartes à l'unité avec stock en temps réel.",              count: "5 000+ cartes", href: "/sequiper/cartes",      cta: "Parcourir les cartes" },
    { icon: Box,     iconBg: "bg-purple-500/10", iconColor: "text-purple-600",  title: "Accessoires",            desc: "Sleeves, playmats, deck boxes — le matériel des champions.",          count: "120+ produits", href: "/sequiper/accessoires", cta: "Voir les accessoires" },
    { icon: Package, iconBg: "bg-red-400/10",    iconColor: "text-red-500",     title: "Produits officiels",     desc: "Booster boxes, ETBs et coffrets Pokémon Company authentiques.",        count: "50+ produits",  href: "/sequiper/produits",    cta: "Voir les produits" },
];

const FEATURED_DECKS = [
    { name: "Lugia VSTAR Combo",    img: "/res/course1.png", price: 29, badge: "Méta" },
    { name: "Miraidon ex Turbo",    img: "/res/course2.png", price: 29, badge: "Méta" },
    { name: "Charizard ex Control", img: "/res/course3.png", price: 34, badge: "Standard" },
];

export default function SEquiperPage() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main>
                {/* Catégories */}
                <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {CATEGORIES.map(({ icon: Icon, iconBg, iconColor, title, desc, count, href, cta }) => (
                            <div key={title} className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-['Inter'] font-bold text-[#140759] mb-0.5">{title}</h3>
                                    <p className="text-xs text-[#808896] mb-1">{count}</p>
                                    <p className="text-sm text-[#4b5563]">{desc}</p>
                                </div>
                                <Link href={href} className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                                    {cta} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Builder promo */}
                    <div className="bg-gradient-to-r from-[#140759] to-[#01509d] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="text-xs font-bold text-[#dbb42b] uppercase tracking-wider mb-2 block">Exclusivité Académie</span>
                            <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-2">Deck-to-Stock Builder</h2>
                            <p className="text-sm text-white/70 max-w-md">Collez votre decklist Limitless et nous préparons votre panier automatiquement selon nos stocks.</p>
                        </div>
                        <Link href="/sequiper/builder" className="flex-shrink-0 h-11 px-6 bg-[#dbb42b] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-[#c9a120] transition-colors">
                            <Zap className="w-4 h-4" /> Essayer l&apos;outil
                        </Link>
                    </div>
                </section>

                {/* Tous les decks faits pour vous */}
                <section className="bg-[#e3ecf8] py-14">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759]">Tous les decks faits pour vous</h2>
                                <p className="text-sm text-[#808896] mt-1">Sélectionnés et validés par nos experts compétitifs.</p>
                            </div>
                            <Link href="/sequiper/decks" className="flex items-center gap-1 text-sm font-semibold text-[#01509d] hover:underline">
                                Voir tous <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {FEATURED_DECKS.map((d) => (
                                <Link key={d.name} href="/sequiper/decks" className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-36 overflow-hidden">
                                        <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-['Inter'] font-bold text-sm text-[#140759]">{d.name}</p>
                                            <span className="text-xs bg-[#01509d] text-white px-2 py-0.5 rounded-full mt-1 inline-block">{d.badge}</span>
                                        </div>
                                        <span className="font-['Poppins'] font-bold text-lg text-[#140759]">{d.price}€</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
