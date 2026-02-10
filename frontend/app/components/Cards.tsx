import { card } from "../types/card";
import { use } from "react";
import Card from "./Card";

export default function Cards({cards}: {
    cards: Promise<{cards: card[]}>
}) {
    const data = use(cards);

    return (
        <div className="flex flex-wrap justify-around">
            {data.cards.map((card) => <Card data={card} key={card._id} />)}
        </div>
    )
}