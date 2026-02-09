import Card from "./Card";
import { use } from "react";

export default function Cards({cards}: {
    cards: Promise<{cards: object[]}>
}) {
    const data = use(cards);

    return (
        <div className="flex flex-wrap justify-around">
            {data.cards.map((card, i) => <Card card={card} key={i} />)}
        </div>
    )
}