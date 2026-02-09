"use client";

import { useState } from "react";
import { useCart } from "../../context/cart-provider";
import { formatPrice } from "../../utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  useSameAddress: boolean;
  billingStreetAddress?: string;
  billingCity?: string;
  billingZipCode?: string;
  billingCountry?: string;
  promocode?: string;
}

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    country: "France",
    useSameAddress: true,
    promocode: "",
  });

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError("Le prénom est requis");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Le nom est requis");
      return false;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Le téléphone est requis");
      return false;
    }
    if (!formData.street.trim()) {
      setError("L'adresse est requise");
      return false;
    }
    if (!formData.city.trim()) {
      setError("La ville est requise");
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError("Le code postal est requis");
      return false;
    }
    if (!formData.country.trim()) {
      setError("Le pays est requis");
      return false;
    }

    if (!formData.useSameAddress) {
      if (!formData.billingStreetAddress?.trim()) {
        setError("L'adresse de facturation est requise");
        return false;
      }
      if (!formData.billingCity?.trim()) {
        setError("La ville de facturation est requise");
        return false;
      }
      if (!formData.billingZipCode?.trim()) {
        setError("Le code postal de facturation est requis");
        return false;
      }
      if (!formData.billingCountry?.trim()) {
        setError("Le pays de facturation est requis");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            itemType: item.itemType || "card",
            itemId: item._id,
            quantity: item.quantity,
          })),
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          billingAddress: formData.useSameAddress
            ? {
                street: formData.street,
                city: formData.city,
                zipCode: formData.zipCode,
                country: formData.country,
              }
            : {
                street: formData.billingStreetAddress,
                city: formData.billingCity,
                zipCode: formData.billingZipCode,
                country: formData.billingCountry,
              },
          useSameAddress: formData.useSameAddress,
          promocode: formData.promocode || undefined,
          paymentMethod: "stripe",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création de la commande");
      }

      const data = await response.json();
      router.push(`/sequiper/payment/${data.orderId}`);
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création de la commande"
      );
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Votre panier est vide</p>
          <Link
            href="/sequiper/cartes"
            className="inline-block bg-[#004A99] text-white px-6 py-3 rounded-lg hover:bg-[#25476E] transition-colors"
          >
            Continuer vos achats
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#004A99] mb-2">Commande</h1>
        <div className="h-1 w-24 bg-[#E1BC2E]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#004A99] mb-4">
                Informations personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#004A99] mb-4">
                Adresse de livraison
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                    disabled={loading}
                  >
                    <option>France</option>
                    <option>Belgique</option>
                    <option>Suisse</option>
                    <option>Luxembourg</option>
                    <option>Allemagne</option>
                    <option>Italie</option>
                    <option>Espagne</option>
                    <option>Pays-Bas</option>
                    <option>Royaume-Uni</option>
                  </select>
                </div>
              </div>

              {/* Même adresse */}
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="useSameAddress"
                  name="useSameAddress"
                  checked={formData.useSameAddress}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#004A99] rounded focus:ring-2"
                  disabled={loading}
                />
                <label
                  htmlFor="useSameAddress"
                  className="ml-2 text-sm text-gray-700"
                >
                  Utiliser la même adresse pour la facturation
                </label>
              </div>
            </div>

            {/* Adresse de facturation */}
            {!formData.useSameAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#004A99] mb-4">
                  Adresse de facturation
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="billingStreetAddress"
                      value={formData.billingStreetAddress || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="billingZipCode"
                        value={formData.billingZipCode || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays *
                    </label>
                    <select
                      name="billingCountry"
                      value={formData.billingCountry || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Sélectionner un pays</option>
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Luxembourg</option>
                      <option>Allemagne</option>
                      <option>Italie</option>
                      <option>Espagne</option>
                      <option>Pays-Bas</option>
                      <option>Royaume-Uni</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Code promo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#004A99] mb-4">Code promo</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code promo (optionnel)
                </label>
                <input
                  type="text"
                  name="promocode"
                  value={formData.promocode}
                  onChange={handleInputChange}
                  placeholder="Entrez votre code promo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4">
              <Link
                href="/sequiper/panier"
                className="flex-1 text-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Retour au panier
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#E1BC2E] hover:bg-[#d4b620] text-[#004A99] font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Création en cours..." : "Procéder au paiement"}
              </button>
            </div>
          </form>
        </div>

        {/* Résumé de commande */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-[#004A99] mb-6">
              Résumé de votre commande
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b max-h-96 overflow-y-auto">
              {state.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.nameFR ?? item.nameEN}
                    </p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}€
                  </p>
                </div>
              ))}
            </div>

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

            <div className="flex justify-between text-xl font-bold text-[#004A99]">
              <span>Total:</span>
              <span>{formatPrice(total)}€</span>
            </div>

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
    </main>
  );
}
