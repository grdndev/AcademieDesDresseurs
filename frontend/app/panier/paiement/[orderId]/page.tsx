"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart-provider";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "../../../utils";

interface OrderItem {
  _id: string;
  itemType: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shippingCost: number;
    discount: number;
    tax: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
  };
}

export default function PaymentPage() {
  const { dispatch } = useCart();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Commande introuvable");
      }
      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement de la commande"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    setPaying(true);
    setError("");

    try {
      // Simulation d'un appel à Stripe ou autre service de paiement
      // Pour l'instant, on simule un paiement réussi

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du traitement du paiement");
      }

      setPaymentCompleted(true);
      setOrder({
        ...order,
        payment: {
          ...order.payment,
          status: "completed",
        },
      });
      dispatch({type: "CLEAR_CART"});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du paiement"
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-red-600 mb-6">{error}</p>
          <Link
            href="/sequiper/cartes"
            className="inline-block bg-[#004A99] text-white px-6 py-3 rounded-lg hover:bg-[#25476E] transition-colors"
          >
            Retour aux achats
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 md:px-30">
        <h1 className="text-4xl font-bold text-[#004A99] mb-2">Paiement</h1>
        <div className="h-1 w-24 bg-[#E1BC2E]"></div>
      </div>

      <div className="md:px-30">
          {paymentCompleted ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Paiement réussi!
              </h2>
              <p className="text-gray-700 mb-2">
                Votre commande <span className="font-bold">#{order.orderNumber}</span> a été confirmée.
              </p>
              <p className="text-gray-600 mb-6">
                Un email de confirmation a été envoyé à <span className="font-semibold">{order.customerInfo.email}</span>
              </p>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-[#004A99] mb-4">
                  Informations de commande
                </h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Numéro de commande</p>
                    <p className="font-bold text-lg">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="font-bold text-lg">
                      {formatPrice(order.pricing.total)}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className="font-bold text-lg text-green-600">Confirmée</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Livraison</p>
                    <p className="font-bold text-lg">Gratuite</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/sequiper/cartes"
                  className="flex-1 bg-[#004A99] hover:bg-[#25476E] text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continuer les achats
                </Link>
                <Link
                  href="/sequiper"
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Aller à l&apos;accueil
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Détails livraison */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#004A99] mb-4">
                  Adresse de livraison
                </h2>
                <div className="text-gray-700">
                  <p className="font-semibold">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.zipCode}, {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Détails articles */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#004A99] mb-4">
                  Articles
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center pb-4"
                    >
                      <div>
                        {item.quantity}x<span className="font-semibold text-gray-900 pl-2">{item.name}</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}€
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-row justify-between">
                    <h2 className="text-md">
                    Sous-total
                    </h2>
                    <h2 className="text-md font-bold">
                        {formatPrice(order.pricing.subtotal)}€
                    </h2>
                </div>
                <div className="flex flex-row justify-between">
                    <h2 className="text-md">
                    Remise
                    </h2>
                    <h2 className="text-md font-bold">
                        {formatPrice(order.pricing.discount)}€
                    </h2>
                </div>
                <div className="flex flex-row justify-between">
                    <h2 className="text-md">
                    Frais de port
                    </h2>
                    <h2 className="text-md font-bold">
                        {formatPrice(order.pricing.shippingCost)}€
                    </h2>
                </div>
                <div className="flex flex-row justify-between">
                    <h2 className="text-md">
                    TVA (20%)
                    </h2>
                    <h2 className="text-md font-bold">
                        {formatPrice(order.pricing.tax)}€
                    </h2>
                </div>
                <div className="flex flex-row justify-between border-t pt-1">
                    <h2 className="text-2xl font-bold text-[#004A99]">
                    Total :
                    </h2>
                    <h2 className="text-2xl font-bold">
                        {formatPrice(order.pricing.total)}€
                    </h2>
                </div>
              </div>

              {/* Bouton paiement */}
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-[#E1BC2E] hover:bg-[#d4b620] text-[#004A99] font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {paying ? "Traitement du paiement..." : `Payer ${formatPrice(order.pricing.total)}€`}
              </button>

              <Link
                href="/panier"
                className="block text-center text-[#004A99] hover:text-[#25476E] font-semibold py-2 transition-colors"
              >
                Retour au panier
              </Link>
            </div>
          )}
      </div>
    </main>
  );
}
