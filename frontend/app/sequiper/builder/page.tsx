'use client';

import { card } from "@/app/types/card";
import { formatPrice } from "../../utils";
import { useCart } from "@/app/context/cart-provider";
import { useState } from "react";
import getApiBase from "@/app/lib/api";
import { ClipboardList, Search, PackageCheck, ShoppingCart, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const STEPS = [
    { icon: ClipboardList, label: "Collez votre decklist",  sub: "Importez depuis Limitless TCG-Live" },
    { icon: Search,        label: "Analyse automatique",    sub: "Parsing intelligent des cartes" },
    { icon: PackageCheck,  label: "Génération du panier",   sub: "Calcul automatique des prix" },
    { icon: ShoppingCart,  label: "Ajout des cartes",       sub: "Commande en un clic" },
];

type Section = "Pokémon" | "Trainer" | "Energy";
const SECTION_EMOJI: Record<Section, string> = { "Pokémon": "🟡", "Trainer": "🔵", "Energy": "⚡" };

function buildSectionMap(text: string): Record<string, Section> {
    const map: Record<string, Section> = {};
    let cur: Section = "Pokémon";
    for (const raw of text.split("\n")) {
        const line = raw.trim();
        if (!line) continue;
        if (/^pok[eé]mon/i.test(line)) { cur = "Pokémon"; continue; }
        if (/^(trainer|entra)/i.test(line)) { cur = "Trainer"; continue; }
        if (/^(energy|[eé]nergie)/i.test(line)) { cur = "Energy"; continue; }
        const name = line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s[\d\/]+)/)?.[0];
        if (name) map[name] = cur;
    }
    return map;
}

type FoundCard   = { card: card; requested: number };
type MissingCard = { card: { name: string; setCode: string; cardNumber: string } };

function demoCard(id: string, nameEN: string, nameFR: string, price: number, stock: number, setCode: string): card {
    return { _id: id, nameEN, nameFR, price, stock, setCode, cardNumber: "0", setNameFR: "", images: { front: "" } } as card & { cardNumber: string };
}

const DEMO_FOUND: FoundCard[] = [
    { requested: 4,  card: demoCard("d1", "Pikachu",             "Pikachu",               1.50, 8,  "SWSH1") },
    { requested: 3,  card: demoCard("d2", "Raichu",              "Raichu",                4.00, 5,  "SWSH1") },
    { requested: 2,  card: demoCard("d3", "Miraidon ex",         "Miraidon ex",          45.00, 1,  "SVI"  ) },
    { requested: 3,  card: demoCard("d4", "Ultra Ball",          "Ultra Ball",            3.00, 3,  "SWSH1") },
    { requested: 4,  card: demoCard("d5", "Rare Candy",          "Bonbon Rare",           2.00, 0,  "SWSH1") },
    { requested: 12, card: demoCard("d6", "Lightning Energy",    "Énergie Électrik",      0.20, 20, "SWSH1") },
    { requested: 6,  card: demoCard("d7", "Double Turbo Energy", "Énergie Double Turbo",  1.20, 4,  "BRS"  ) },
];
const DEMO_SECTION_MAP: Record<string, Section> = {
    "Pikachu": "Pokémon", "Raichu": "Pokémon", "Miraidon ex": "Pokémon",
    "Ultra Ball": "Trainer", "Bonbon Rare": "Trainer",
    "Énergie Électrik": "Energy", "Énergie Double Turbo": "Energy",
};

function cardStatus(c: FoundCard): "ok" | "partial" | "out" {
    if (c.card.stock === 0) return "out";
    if (c.requested > c.card.stock) return "partial";
    return "ok";
}

const STATUS_LABEL: Record<string, string> = { ok: "Disponible", partial: "Stock faible", out: "Rupture" };
const STATUS_CLS:   Record<string, string> = {
    ok:      "bg-green-50 text-green-700",
    partial: "bg-orange-50 text-orange-600",
    out:     "bg-red-50 text-red-500",
};

export default function BuilderPage() {
    const { dispatch } = useCart();
    const [loading,      setLoading]     = useState(false);
    const [decklistText, setDecklistText] = useState("");
    const [sectionMap,   setSectionMap]  = useState<Record<string, Section>>(DEMO_SECTION_MAP);
    const [results, setResults] = useState<{ found: FoundCard[]; notfound: MissingCard[] }>({ found: DEMO_FOUND, notfound: [] });

    const found    = results.found;
    const notfound = results.notfound;
    const ok       = found.filter(c => cardStatus(c) === "ok");
    const partial  = found.filter(c => cardStatus(c) === "partial");
    const out      = found.filter(c => cardStatus(c) === "out");
    const total    = ok.reduce((s, i) => s + i.card.price * i.requested, 0)
                   + partial.reduce((s, i) => s + i.card.price * i.card.stock, 0);
    const hasResults = found.length > 0 || notfound.length > 0;

    const SECTIONS: Section[] = ["Pokémon", "Trainer", "Energy"];
    const grouped = Object.fromEntries(
        SECTIONS.map(s => [s, found.filter(c => sectionMap[c.card.nameFR ?? c.card.nameEN] === s)])
    ) as Record<Section, FoundCard[]>;

    async function analyze() {
        if (!decklistText.trim()) return;
        setSectionMap(buildSectionMap(decklistText));
        setLoading(true);
        const lines    = decklistText.split("\n").map(e => e.trim()).filter(e => !e.includes(":") && e.length);
        const decklist = lines.map(line => ({
            quantity:   line.split(" ")[0],
            name:       line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/)?.[0] ?? null,
            setCode:    line.match(/[A-Z]{3}(?=\s[\d\/]+$)/)?.[0] ?? null,
            cardNumber: line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/)?.[0] ?? null,
        }));
        try {
            const res  = await fetch(`${getApiBase()}/cards/batch-check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cards: decklist }) });
            const data = await res.json();
            setResults(data.results);
        } catch {
            // silently fail — user can retry
        } finally {
            setLoading(false);
        }
    }

    function addToCart() {
        const payload = [
            ...ok.map(i => ({ ...i.card, quantity: i.requested })),
            ...partial.map(i => ({ ...i.card, quantity: i.card.stock })),
        ];
        dispatch({ type: "ADD_DECKLIST", payload });
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar /> */}
            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10 space-y-10">

                {/* Comment ça fonctionne */}
                <section className="bg-[#e3ecf8] rounded-2xl p-8">
                    <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-6 text-center">Comment fonctionne l&apos;outil</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STEPS.map(({ icon: Icon, label, sub }, i) => (
                            <div key={label} className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#01509d] flex items-center justify-center relative">
                                    <Icon className="w-5 h-5 text-white" />
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#dbb42b] text-[#140759] text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#274c78]">{label}</p>
                                    <p className="text-xs text-[#6b8fb5] mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Textarea */}
                <section className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                    <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-1">Collez votre decklist</h2>
                    <p className="text-sm text-[#808896] mb-4">Format Limitless : <code className="bg-gray-100 px-1 rounded text-xs">4 Lugia V SIT 138</code></p>
                    <textarea
                        value={decklistText}
                        onChange={e => setDecklistText(e.target.value)}
                        placeholder={"Pokémon: 12\n4 Pikachu SWSH1 1\n3 Raichu SWSH1 2\n\nTrainer: 30\n4 Rare Candy SWSH1 141\n\nEnergy: 18\n12 Lightning Energy SWSH1 167"}
                        rows={10}
                        className="w-full p-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#01509d]/30 focus:border-[#01509d] outline-none resize-none text-[#140759] placeholder:text-[#9ca3af]"
                    />
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={analyze}
                            disabled={!decklistText.trim() || loading}
                            className="h-10 px-5 bg-[#01509d] hover:bg-[#014080] disabled:opacity-50 text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center gap-2 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            {loading ? "Analyse en cours…" : "Analyser la decklist"}
                        </button>
                        <button type="button" className="h-10 px-5 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-[#f9fafb] transition-colors">
                            Importer depuis Limitless
                        </button>
                    </div>
                </section>

                {/* Résultats */}
                {hasResults && !loading && (
                    <>
                        {/* Decklist analysée + Analyse des stocks */}
                        <section className="grid md:grid-cols-2 gap-6">

                            {/* Decklist groupée par section */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Decklist analysée</h2>
                                <div className="space-y-5">
                                    {SECTIONS.map(section => {
                                        const cards = grouped[section];
                                        if (!cards || cards.length === 0) return null;
                                        const total = cards.reduce((s, c) => s + c.requested, 0);
                                        const SHOW  = 4;
                                        const shown = cards.slice(0, SHOW);
                                        const rest  = cards.length - SHOW;
                                        return (
                                            <div key={section}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span>{SECTION_EMOJI[section]}</span>
                                                    <span className="font-semibold text-sm text-[#140759]">{section}</span>
                                                    <span className="text-xs text-[#808896]">({total})</span>
                                                </div>
                                                <div className="space-y-1.5 pl-1">
                                                    {shown.map(c => {
                                                        const s = cardStatus(c);
                                                        return (
                                                            <div key={c.card._id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s === "ok" ? "bg-green-500" : s === "partial" ? "bg-orange-400" : "bg-red-400"}`} />
                                                                    <span className="text-[#140759]">{c.card.nameFR ?? c.card.nameEN}</span>
                                                                </div>
                                                                <span className="text-[#808896] tabular-nums">{c.requested}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {rest > 0 && (
                                                        <p className="text-xs text-[#01509d] cursor-pointer hover:underline pl-4">+{rest} autres cartes</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Non groupées (section inconnue) */}
                                    {(() => {
                                        const ungrouped = found.filter(c => !sectionMap[c.card.nameFR ?? c.card.nameEN]);
                                        if (ungrouped.length === 0) return null;
                                        return ungrouped.map(c => {
                                            const s = cardStatus(c);
                                            return (
                                                <div key={c.card._id} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s === "ok" ? "bg-green-500" : s === "partial" ? "bg-orange-400" : "bg-red-400"}`} />
                                                        <span className="text-[#140759]">{c.card.nameFR ?? c.card.nameEN}</span>
                                                    </div>
                                                    <span className="text-[#808896] tabular-nums">{c.requested}</span>
                                                </div>
                                            );
                                        });
                                    })()}

                                    {notfound.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-red-500 mb-1.5">Introuvables ({notfound.length})</p>
                                            <div className="space-y-1">
                                                {notfound.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm">
                                                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                        <span className="text-[#9ca3af]">{c.card.name} {c.card.setCode}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Analyse des stocks */}
                            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Analyse des stocks</h2>
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                                        <span className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Cartes disponibles
                                        </span>
                                        <span className="font-bold text-green-700">{ok.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <span className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                                            <AlertCircle className="w-4 h-4" /> Stock faible
                                        </span>
                                        <span className="font-bold text-orange-600">{partial.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                        <span className="flex items-center gap-2 text-sm text-red-500 font-medium">
                                            <XCircle className="w-4 h-4" /> Rupture de stock
                                        </span>
                                        <span className="font-bold text-red-500">{out.length + notfound.length}</span>
                                    </div>
                                </div>

                                <h3 className="font-['Inter'] font-semibold text-sm text-[#140759] mb-3">Détail par carte</h3>
                                <div className="space-y-2">
                                    {found.slice(0, 7).map(c => {
                                        const s = cardStatus(c);
                                        return (
                                            <div key={c.card._id} className="flex items-center justify-between text-sm">
                                                <span className="text-[#140759] truncate mr-2">
                                                    {c.card.nameFR ?? c.card.nameEN}
                                                    <span className="text-[#808896] ml-1">({c.requested})</span>
                                                </span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_CLS[s]}`}>
                                                    {STATUS_LABEL[s]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {found.length > 7 && (
                                        <p className="text-xs text-[#808896]">+{found.length - 7} autres cartes analysées</p>
                                    )}
                                </div>
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
                                        <th className="text-center px-4 py-3 font-semibold text-[#808896]">Quantité</th>
                                        <th className="text-right px-4 py-3 font-semibold text-[#808896]">Prix</th>
                                        <th className="text-center px-6 py-3 font-semibold text-[#808896]">Disponibilité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...ok, ...partial, ...out].map((item, i) => {
                                        const s = cardStatus(item);
                                        return (
                                            <tr key={i} className="border-b border-[#e5e7eb] last:border-0">
                                                <td className="px-6 py-3 font-medium text-[#140759]">{item.card.nameFR ?? item.card.nameEN}</td>
                                                <td className="px-4 py-3 text-center text-[#808896]">{item.requested}</td>
                                                <td className="px-4 py-3 text-right text-[#140759] font-semibold">
                                                    {formatPrice(item.card.price * Math.min(item.requested, item.card.stock))} €
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CLS[s]}`}>
                                                        {s === "ok"      && <><CheckCircle className="w-3 h-3" /> Disponible</>}
                                                        {s === "partial" && <><AlertCircle className="w-3 h-3" /> Stock faible</>}
                                                        {s === "out"     && <><XCircle className="w-3 h-3" /> Rupture</>}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-[#f9fafb] border-t-2 border-[#e5e7eb]">
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 font-bold text-[#140759]">
                                            Total {partial.length > 0 && <span className="text-orange-500 text-xs font-normal ml-1">(achat partiel)</span>}
                                        </td>
                                        <td className="px-4 py-4 text-right font-['Poppins'] font-bold text-xl text-[#140759]">{formatPrice(total)} €</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className="h-9 px-4 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                                                    Modifier les cartes
                                                </button>
                                                <button onClick={addToCart} className="h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl flex items-center gap-2 transition-colors">
                                                    <ShoppingCart className="w-3.5 h-3.5" /> Ajouter tout au panier
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        {/* Cartes alternatives */}
                        {(partial.length > 0 || out.length > 0) && (
                            <section className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                                <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-1 text-center">Cartes alternatives disponibles</h2>
                                <p className="text-sm text-[#808896] text-center mb-6">Ces cartes peuvent remplacer celles en rupture ou en stock limité.</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[...partial, ...out].slice(0, 3).map((c, i) => (
                                        <div key={i} className="border border-[#e5e7eb] rounded-xl p-4 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-sm text-[#140759]">{c.card.nameFR ?? c.card.nameEN} (Alternative)</p>
                                                    <p className="text-xs text-[#808896] mt-0.5">Version alternative disponible en stock</p>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap flex-shrink-0">
                                                    Compatible
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                                                <span className="font-bold text-[#140759]">{formatPrice(c.card.price)} €</span>
                                                <button className="h-8 px-3 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-lg transition-colors">
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
