import Image from "next/image";
import { formatPrice } from "../utils";
import { card } from "../types/card";

export default function RequestedCardSmall({card, available}: {card: {card: card, requested: number}, available: boolean}) {
    const data = card.card;

    return (
        <div className="w-[5em] mx-2 my-2 relative">
            <div className={`min-h-[7em] rotate-x-20 rotate-z-0 hover:rotate-x-0 hover:rotate-z-3 transition-rotate duration-400 bg-gray-200 ${!available ? "opacity-50 grayscale" : ""}`}>
                {data.images.front && <Image className="relative" src={data.images.front} width={600} height={825} alt={data.nameFR ?? data.nameEN} />}
            </div>
            <div className="bg-white border border-gray-200 rounded-b px-2 pt-2 text-xs">
                <div className="truncate font-bold">{data.nameFR ?? data.nameEN}</div>
                <div className="flex justify-between relative -top-1">
                    <div>{data.setCode}</div>
                </div>
                <div className="text-gray-800">
                    {formatPrice(data.price)} € x {card.requested}
                </div>
                <div className={"text-xs font-medium"}>
                    {formatPrice(data.price * card.requested)} €
                </div>
                <div className={`ml-auto text-xs font-medium ${available && data.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {card.requested} / {data.stock}
                </div>
            </div>
        </div>
    )
}