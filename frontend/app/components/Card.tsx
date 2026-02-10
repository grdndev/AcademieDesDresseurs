"use client";

import { formatPrice } from "../utils";
import { Plus } from "lucide-react";
import { useCart } from "@/app/context/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { card } from "../types/card";

export default function Card({data}: {data: card}) {
    const { dispatch } = useCart();

    return (
        <div className="w-[15em] mx-6 my-4 relative">
            <Link href={`/sequiper/cartes/${data._id}`}><div className="h-[20em] rotate-x-10 rotate-z-0 hover:rotate-x-0 hover:rotate-z-1 transition-rotate duration-400">
                {data.images.front && <Image className="relative" src={data.images.front} width={600} height={825} alt={data.nameFR ?? data.nameEN} />}
            </div></Link>
            <div className="bg-white border border-gray-200 rounded-b px-2 pt-2">
                <div className="truncate font-bold">{data.nameFR ?? data.nameEN}</div>
                <div className="flex justify-between text-sm relative -top-1">
                    <div>{data.setNameFR}</div>
                    <div>{data.setCode}</div>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm">
                    <span className="font-medium text-gray-800">
                        {formatPrice(data.price.toString())} €
                    </span>
                    <span className={`text-xs font-medium ${data.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                        Stock: {data.stock}
                    </span>
                </div>
            </div>
            <button className="absolute -top-3 -right-3 flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1 text-sm shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
                onClick={() => dispatch({ type: "ADD_ITEM", payload: { ...data, itemType: 'card', quantity: 1 } })} >
                <span>Ajouter</span>
                <Plus className="w-4 h-4" />
            </button>
        </div>
    )
}