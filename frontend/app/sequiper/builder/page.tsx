'use client';
import { card } from "@/app/types/card";
import { formatPrice } from "../../utils";
import { Plus } from "lucide-react";
import { useCart } from "@/app/context/cart-provider";
import { useState } from "react";
import RequestedCardSmall from "@/app/components/RequestedCardSmall";

export default function BuilderPage() {
    const { dispatch } = useCart();
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState({results: {found: [], notfound: []}});
    const available = cards.results.found.filter((c: {card: card, requested: number}) => c.requested <= c.card?.stock);
    const unavailable = cards.results.found.filter((c: {card: card, requested: number}) => c.requested > c.card?.stock);
    const total = available.reduce((sum, item: {card: card, requested: number}) => sum + (item.card.price * item.requested), 0)
                + unavailable.reduce((sum, item: {card: card, requested: number}) => sum + (item.card.price * item.card.stock), 0);

    async function parseDecklist(value: string) {
        setLoading(true);
        //for LIMITLESS type decklist
        const lines = value.split("\n").map(e => e.trim()).filter(e => !e.includes(":") && e.length);
        const decklist = []

        for(const line of lines) {
            decklist.push({
                quantity: line.split(" ")[0],
                name: line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/) != null ? line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/)![0] : null,
                setCode: line.match(/[A-Z]{3}(?=\s[\d\/]+$)/) != null ? line.match(/[A-Z]{3}(?=\s[\d\/]+$)/)![0] : null,
                cardNumber : line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/) != null ? line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/)![0] : null
            });
        }

        try {
            const response = await fetch("http://localhost:5001/api/cards/batch-check", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cards: decklist})
            });

            const data = await response.json();
            setCards(data);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (<main className="flex flex-col max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 bg-gray-50 border border-gray-200 md:flex-row">
                <div className="w-full md:w-4/6 p-2">
                    <div className="flex flex-row justify-between border-b px-2 pb-4 my-2">
                        <div>
                            <div><span className="font-bold">Disponibles :</span> {available.length}</div>
                            <div><span className="font-bold">Indisponibles :</span> {unavailable.length}</div>
                            <div><span className="font-bold">Introuvables :</span> {cards.results.notfound.length}</div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="text-right px-3"><span className="font-bold">Coût total</span>{!!unavailable.length && <span className="text-red-500"> (achat partiel)</span>} : {formatPrice(total)} €</div>
                            <div className="flex justify-end">
                                <button className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1 text-sm shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
                                    onClick={() => dispatch({ type: "ADD_ITEM", payload: { } })} >
                                    <span>Ajouter au Panier</span>
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {!loading && <div>
                        <div className="flex flex-row flex-wrap">
                            {available.map((c: {card: card, requested: number}) => <RequestedCardSmall card={c} available={true} key={c.card._id} />)}
                            {unavailable.map((c: {card: card, requested: number}) => <RequestedCardSmall card={c} available={false} key={c.card._id} />)}
                        </div>
                        <div className="pt-2 opacity-50">
                            {cards.results.notfound.map((c: {card: {name: string, setCode: string, cardNumber: string}}, i) => {
                                return <div className="flex justify-between text-gray-500" key={i}>
                                    <div>
                                        <span className="px-2 font-bold">{c.card.name}</span>
                                        <span className="px-2 font-bold">{c.card.setCode}</span>
                                        <span className="px-2">{c.card.cardNumber}</span>
                                        <span className="px-2">introuvable</span>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>}
                </div>
                <div className="grow">
                    <textarea
                        onChange={e => parseDecklist(e.target.value)}
                        placeholder="Collez votre decklist ici: 2 Lanssorien-ex TWM 130/191 ..."
                        rows={30}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                    />
                </div>
            </main>
    );
}
