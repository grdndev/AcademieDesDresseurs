import Cards from "../../components/Cards";
import { Suspense } from "react"

export default function CartesPage() {
    const cards = fetch("http://localhost:5001/api/cards?sortBy=name").then(response => response.json())

    return (<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Suspense fallback={<div>Chargement...</div>}>
                    <Cards cards={cards} />
                </Suspense>
            </main>
    );
}
