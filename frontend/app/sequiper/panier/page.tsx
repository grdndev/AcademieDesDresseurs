"use client";

import { formatPrice } from "../../utils";
import { useCart } from "../../context/cart-provider";
import { useEffect } from "react";
import Link from "next/link";
import { cartItem } from "@/app/types/card";

export default function PanierPage() {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum: number, item: cartItem) => sum + item.price * item.quantity, 0);
  const missing = state.items.filter((item: cartItem) => item.stock !== undefined && item.quantity > item.stock);
  const isValid = missing.length === 0;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Vérifier si le changement dépasse le stock
    const item = state.items.find((i: cartItem) => i._id === itemId);
    if (item && newQuantity > 0) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: itemId, quantity: newQuantity } });
    } else if (newQuantity === 0) {
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
    }
  };

  const handleRemove = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const checkCart = async () => {
    try {
      if (state.items.length === 0) {
        return;
      }

      const items = state.items.map((item: cartItem) => ({
        itemType: item.itemType,
        itemId: item._id,
        quantity: item.quantity
      }));

      const response = await fetch("http://localhost:5001/api/orders/check-cart", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      const data = await response.json();

      const itemsWithStock = data.stock.map((i: cartItem) => {
        const cartItem = state.items.find((ci: cartItem) => ci._id === i._id)
        return {
          ...cartItem,
          stock: i.stock
        };
      })

      dispatch({ type: "SET_STOCK", payload: itemsWithStock });
    } catch (err) {

    }
  };

  useEffect(() => { checkCart() }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#004A99] mb-2">Mon panier</h1>
        <div className="h-1 w-24 bg-[#E1BC2E]"></div>
      </div>

      {/* Alertes de stock */}
      {!isValid && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div>Stock insuffisant :</div>
            <div className="space-y-2 text-red-600">
              {missing.map((missingItem: cartItem) => (
                <div key={missingItem._id} className="text-sm">
                  <span className="font-medium">- {missingItem.nameFR ?? missingItem.nameEN}</span>: {missingItem.quantity} demandés / {missingItem.stock !== undefined && missingItem.stock > 0 ? missingItem.stock + " en stock" : "stock épuisé" }
                </div>
              ))}
            </div>
        </div>
      )}

      {state.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Votre panier est vide</p>
          <Link
            href="/sequiper/cartes"
            className="inline-block bg-[#004A99] text-white px-6 py-3 rounded-lg hover:bg-[#25476E] transition-colors"
          >
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-6 font-semibold text-gray-700 border-b">
                <div className="col-span-4">Produit</div>
                <div className="col-span-2 text-center">Prix</div>
                <div className="col-span-3 text-center">Quantité</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="divide-y">
                {state.items.map((item: cartItem) => (
                  <div
                    key={item._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="md:hidden mb-4">
                      <h3 className="font-semibold text-[#004A99] mb-2">
                        {item.nameFR ?? item.nameEN}
                      </h3>
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Nom du produit */}
                      <div className="col-span-12 md:col-span-4">
                        <p className="hidden md:block font-semibold text-[#004A99]">
                          {item.nameFR ?? item.nameEN}
                        </p>
                      </div>

                      {/* Prix */}
                      <div className="col-span-6 md:col-span-2 md:text-center">
                        <span className="md:hidden font-semibold mr-2">
                          Prix:
                        </span>
                        <span className="text-gray-700">{formatPrice(item.price)}€</span>
                      </div>

                      {/* Quantité */}
                      <div className="col-span-6 md:col-span-3 flex justify-end md:justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded flex items-center justify-center transition-colors"
                          title="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          className="bg-[#8BBF00] hover:bg-[#6fa000] text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                          title="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      {/* Total ligne et bouton supprimer */}
                      <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                        <span className="font-semibold text-[#004A99]">
                          {formatPrice(item.price * item.quantity)}€
                        </span>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                          title="Supprimer cet article"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé et paiement */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-[#004A99] mb-6">
                Résumé
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total:</span>
                  <span>{formatPrice(total)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais de port:</span>
                  <span className="text-green-600 font-semibold">Gratuit</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-[#004A99] mb-6">
                <span>Total:</span>
                <span>{formatPrice(total)}€</span>
              </div>

              {isValid ? <Link
                href="/sequiper/checkout"
                className="block text-center w-full bg-[#E1BC2E] hover:bg-[#d4b620] text-[#004A99] font-bold py-3 px-4 rounded-lg transition-colors mb-3"
              >
                Commander
              </Link> : <div className="block text-center w-full bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-lg mb-3 cursor-not-allowed">
                Commander
              </div>}

              <Link
                href="/sequiper/cartes"
                className="block text-center text-[#004A99] hover:text-[#25476E] font-semibold py-2 transition-colors"
              >
                Continuer les achats
              </Link>

              <div className="mt-6 p-4 bg-blue-50 rounded border border-[#689BBC]">
                <p className="text-sm text-gray-600">
                  ✓ Livraison sécurisée
                </p>
                <p className="text-sm text-gray-600">
                  ✓ Paiement sécurisé
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
