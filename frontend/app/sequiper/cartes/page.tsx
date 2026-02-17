import { card } from "@/app/types/card";
import { Suspense } from "react";
import { use } from "react";
import Card from "@/app/components/Card";

export default function CartesPage() {
    const data = use(fetch(`${process.env.NEXT_LOCAL_API_URL}/cards?sortBy=name`, {cache: 'no-store'})
                .then(res => {
                    if (!res.ok) throw new Error("Erreur serveur");
                    return res.json();
                }));

    return (<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<div>Chargement...</div>}>
            <div className="flex flex-wrap justify-around">
                {data.cards.map((card: card) => <Card data={card} key={card._id} />)}
            </div>
        </Suspense>
    </main>
    );
}
