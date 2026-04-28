"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Link from "next/link";
import { Search, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/cart-provider";
import { apiGet } from "../../lib/apiClient";

type Deck = { id: string; name: string; description?: string; image: string; badges: string[]; format: string; level: string; price: number; stock: number; slug?: string };

const FORMATS = ["Tous les formats", "Standard", "Expanded"];
const LEVELS  = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"];
const PER_PAGE = 6;

export default function DecksPage() {
  const { dispatch } = useCart();
  const [decks, setDecks]     = useState<Deck[]>([]);
  const [search, setSearch]   = useState("");
  const [format, setFormat]   = useState("Tous les formats");
  const [level, setLevel]     = useState("Tous les niveaux");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    apiGet<Deck[]>("/products?type=DECK").then(setDecks).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return decks.filter((d) => {
      const matchSearch = !q || d.name.toLowerCase().includes(q);
      const matchFormat = format === "Tous les formats" || d.format === format;
      const matchLevel  = level  === "Tous les niveaux"  || d.level === level;
      return matchSearch && matchFormat && matchLevel;
    });
  }, [decks, search, format, level]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearch(v: string) { setSearch(v);  setPage(1); }
  function handleFormat(v: string) { setFormat(v);  setPage(1); }
  function handleLevel(v: string)  { setLevel(v);   setPage(1); }

  function addToCart(d: Deck) {
    dispatch({ type: "ADD_ITEM", payload: { _id: d.id, nameFR: d.name, price: d.price, quantity: 1, stock: d.stock, itemType: "accessory" } });
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* <Navbar />  */}

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

        {/* Bannière featured */}
        <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-r from-[#274c78] to-[#01509d] p-8 flex items-center justify-between">
          <div className="relative z-10 max-w-sm">
            <span className="text-xs font-bold text-[#dbb42b] uppercase tracking-wider mb-2 block">Deck méta du moment</span>
            <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-2">{decks[0]?.name ?? 'Deck compétitif'}</h2>
            <p className="text-sm text-white/70 mb-5">{decks[0]?.description ?? 'Découvrez les meilleurs decks de la meta actuelle.'}</p>
            <Button variant="yellow" href={`/sequiper/decks/${decks[0]?.id ?? ''}`}>Voir le deck</Button>
          </div>
          <div className="hidden lg:flex gap-3 opacity-80">
            <img src="/res/course1.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[-6deg] shadow-xl" />
            <img src="/res/course2.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[3deg] shadow-xl mt-4" />
            <img src="/res/course3.png" alt="" className="w-28 h-36 object-cover rounded-xl rotate-[-2deg] shadow-xl" />
          </div>
        </div>

        {/* Barre recherche + filtres */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-8 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un deck..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]"
            />
          </div>
          {[{ value: format, options: FORMATS, handler: handleFormat }, { value: level, options: LEVELS, handler: handleLevel }].map(({ value, options, handler }, i) => (
            <div key={i} className="relative flex-shrink-0">
              <select value={value} onChange={(e) => handler(e.target.value)} className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none">
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Grille decks */}
        {paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginated.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-44">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {d.badges.map((b) => <Badge key={b} label={b} />)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-['Inter'] font-bold text-[#140759] mb-1">{d.name}</h3>
                  <p className="text-xs text-[#808896] mb-4">{d.format} · {d.level} · {d.stock > 0 ? <span className="text-green-600">{d.stock} en stock</span> : <span className="text-red-500">Rupture</span>}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-['Poppins'] font-bold text-xl text-[#140759]">{d.price} €</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(d)}
                      disabled={d.stock === 0}
                      className="flex-1 h-10 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" /> Ajouter
                    </button>
                    <Link
                      href={`/sequiper/decks/${d.id}`}
                      className="h-10 px-4 border border-[#01509d] text-[#01509d] text-sm font-semibold rounded-xl flex items-center hover:bg-[#01509d]/5 transition-colors"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#808896]">Aucun deck trouvé.</div>
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
