"use client";

import { useEffect, useMemo, useState } from "react";
import { card } from "@/app/types/card";
import Card from "@/app/components/Card";
import Navbar from "@/app/components/Navbar";
import Pagination from "@/app/components/ui/Pagination";
import getApiBase from "@/app/lib/api";
import { Search, ChevronDown } from "lucide-react";

const RARITIES = ["Toutes les raretés", "Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare"];
const PER_PAGE = 12;

export default function CartesPage() {
    const [allCards, setAllCards] = useState<card[]>([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");
    const [rarity, setRarity]     = useState("Toutes les raretés");
    const [page, setPage]         = useState(1);

    useEffect(() => {
        fetch(`${getApiBase()}/cards?sortBy=name`, { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => setAllCards(d.cards ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return allCards.filter((c) => {
            const matchSearch = !q || (c.nameFR ?? c.nameEN).toLowerCase().includes(q);
            const matchRarity = rarity === "Toutes les raretés" || c.rarity === rarity;
            return matchSearch && matchRarity;
        });
    }, [allCards, search, rarity]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    function handleSearch(v: string) { setSearch(v); setPage(1); }
    function handleRarity(v: string) { setRarity(v); setPage(1); }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* <Navbar />  */}

            <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

                {/* Barre recherche + filtres */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-10 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Rechercher une carte..."
                            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]"
                        />
                    </div>
                    <div className="relative flex-shrink-0">
                        <select
                            value={rarity}
                            onChange={(e) => handleRarity(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none"
                        >
                            {RARITIES.map((r) => <option key={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                    </div>
                </div>

                {/* Skeleton loading */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Grille */}
                {!loading && paginated.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
                        {paginated.map((c) => <Card data={c} key={c._id} />)}
                    </div>
                )}

                {!loading && paginated.length === 0 && (
                    <div className="text-center py-20 text-[#808896]">Aucune carte trouvée.</div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination current={page} total={totalPages} onChange={setPage} />
                    </div>
                )}

            </main>
        </div>
    );
}
