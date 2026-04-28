"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import { Search, ChevronDown, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/cart-provider";
import { apiGet } from "../../lib/apiClient";

type Produit = { id: string; name: string; image: string; category: string; price: number; stock: number; rating: number; slug?: string };

const CATEGORIES = ["Toutes", "Rangement", "Protèges", "Playmat", "Accessoires"];
const PER_PAGE = 6;

export default function AccessoiresPage() {
  const { dispatch } = useCart();
  const [produits, setProduits]   = useState<Produit[]>([]);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("Toutes");
  const [page, setPage]           = useState(1);

  useEffect(() => {
    apiGet<Produit[]>("/products?type=ACCESSORY").then(setProduits).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return produits.filter((p) => {
      const matchSearch   = !q || p.name.toLowerCase().includes(q);
      const matchCategory = category === "Toutes" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [produits, search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleFilter(val: string) { setCategory(val); setPage(1); }
  function handleSearch(val: string) { setSearch(val);   setPage(1); }

  function addToCart(p: Produit) {
    dispatch({ type: "ADD_ITEM", payload: { _id: p.id, nameFR: p.name, price: p.price, quantity: 1, stock: p.stock, itemType: "accessory" } });
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* <Navbar />  */}

      <main className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-10">

        {/* Bannière */}
        <div className="bg-[#01509d] rounded-2xl p-8 mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-1">Équipez-vous pour performer</h2>
            <p className="text-sm text-white/70">Sleeves, playmats, deck boxes — le matériel des champions.</p>
          </div>
          <Button variant="yellow" href="/sequiper/decks">Voir les decks</Button>
        </div>

        {/* Barre recherche + filtres */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-8 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un accessoire..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-[#9ca3af] text-[#140759]"
            />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={category}
              onChange={(e) => handleFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm font-medium text-[#140759] border border-[#e5e7eb] rounded-xl bg-white cursor-pointer outline-none"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
          </div>
        </div>

        {/* Grille produits */}
        {paginated.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginated.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-[#f9fafb]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-[#01509d] bg-[#eef5fb] px-2 py-0.5 rounded-full">{p.category}</span>
                  <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mt-2 mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-[#808896]">{p.rating > 0 ? p.rating.toFixed(1) : '—'}</span>
                    <span className={`ml-auto text-xs font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                      {p.stock > 0 ? `${p.stock} en stock` : "Rupture"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Poppins'] font-bold text-lg text-[#140759]">{p.price.toFixed(2).replace(".", ",")} €</span>
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                      className="flex items-center gap-2 h-9 px-4 bg-[#01509d] hover:bg-[#014080] disabled:bg-gray-200 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#808896]">Aucun accessoire trouvé.</div>
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
