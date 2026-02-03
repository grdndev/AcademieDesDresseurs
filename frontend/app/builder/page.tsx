'use client';
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Search, ShoppingCart, Filter, Box, Zap, Layers } from "lucide-react";

export default function SEquiperPage() {
    const [decklist, setDecklist] = useState([]);

    function parseDecklist(value) {
        //for LIMITLESS type decklist
        let lines = value.split("\n").map(e => e.trim()).filter(e => !e.includes(":") && e.length);
        let cards = []

        for(let line of lines) {


            cards.push({
                quantity: line.split(" ")[0],
                name: line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/) != null ? line.match(/(?<=^\d+\s).+(?=\s[A-Z]{3}\s\d+)/)[0] : null,
                setCode: line.match(/[A-Z]{3}(?=\s[\d\/]+$)/) != null ? line.match(/[A-Z]{3}(?=\s[\d\/]+$)/)[0] : null,
                cardNumber : line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/) != null ? line.match(/(?<=[A-Z]{3}\s)[\d\/]+$/)[0] : null
            });
        }

        setDecklist(cards);
    }

    //TODO : Requêter /api/cards/batch-check

    return (
        <div className="min-h-screen bg-[#F9FAEE] font-outfit">
            <Navbar />

            {/* Header Boutique */}
            <div className="bg-white border-b border-gray-200 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900">Deck-to-stock Builder</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 border border-gray-200">
                <div className="w-4/6 p-8">{JSON.stringify(decklist)}</div>
                <div className="grow">
                    <textarea
                        onChange={e => parseDecklist(e.target.value)}
                        placeholder="Collez votre decklist ici: 2 Lanssorien-ex TWM 130/191 ..."
                        rows="30"
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                    />
                </div>
            </main>
        </div>
    );
}
