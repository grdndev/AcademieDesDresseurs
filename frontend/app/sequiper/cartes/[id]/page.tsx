import Image from "next/image";
import { formatPrice } from "../../../utils";

export default async function DetailCartePage({params}: {params: Promise<{id: string}> }) {
    const { id } = await params;
    const card = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}`).then(response => response.json())
    const data = card.card;

    return(<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white max-w-2xl p-8 border border-gray-200 rounded-lg shadow-md flex flex-col justify-between mx-auto">
                    <div className="flex flex-row justify-between grow">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold">
                            {data.nameFR ?? data.nameEN}
                            </h1>
                            <h2>
                                <span>{data.setCode} {data.setNameFR ?? data.setNameEN}</span>
                                <span className="px-2">-</span>
                                <span>{data.rarity}</span>
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <div className="text-xl font-semibold text-gray-900">
                                    Prix: {formatPrice(data.price.toString())} €
                                </div>

                                <div className="text-sm text-gray-600">
                                Stock : <span className="font-medium text-gray-800">{data.stock}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:max-w-md px-10 pt-4 mx-auto">
                        {data.images.front && (
                        <Image
                            className="rounded-md object-cover shadow-sm"
                            src={data.images.front}
                            width={600}
                            height={825}
                            alt={data.nameFR ?? data.nameEN}
                        />
                        )}
                    </div>
                </div>
            </main>
    );
}