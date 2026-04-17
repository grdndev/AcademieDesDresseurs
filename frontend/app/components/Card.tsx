"use client";

import { formatPrice } from "../utils";
import { useCart } from "@/app/context/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { card } from "../types/card";
import AddToCartButton from "./AddToCartButton";

export default function Card({ data }: { data: card }) {
    const { dispatch } = useCart();

    function addToCart() {
        dispatch({ type: "ADD_ITEM", payload: { ...data, itemType: "card", quantity: 1 } });
    }

    return (
        <div className="relative group">
            <Link href={`/sequiper/cartes/${data._id}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                    {data.images.front ? (
                        <Image
                            src={data.images.front}
                            fill
                            className="object-cover"
                            alt={data.nameFR ?? data.nameEN}
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            Pas d&apos;image
                        </div>
                    )}
                </div>
            </Link>

            <div className="mt-2 px-0.5">
                <p className="font-['Inter'] font-bold text-[#140759] text-sm truncate">
                    {data.nameFR ?? data.nameEN}
                </p>
                <p className={`text-xs mt-0.5 ${data.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.stock > 0 ? `${data.stock} en stock` : "Rupture de stock"}
                </p>
                <p className="text-xs text-[#808896] mt-0.5">
                    A partir de{" "}
                    <span className="font-bold text-[#140759]">{formatPrice(data.price.toString())} €</span>
                </p>
            </div>

            {/* Bouton panier visible au hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AddToCartButton addToCart={addToCart} />
            </div>
        </div>
    );
}
