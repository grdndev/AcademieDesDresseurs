import { Plus, Download, ArrowUp, ArrowDown } from 'lucide-react';

export default function WalletPage() {

    const transactions = [
        { type: 'Achat', description: '10x boosters Écarlate et Violet', amount: -49.90, date: '28 Mars 2026' },
        { type: 'Dépôt', description: 'Ajout de fonds', amount: 100.00, date: '25 Mars 2026' },
        { type: 'Coaching', description: 'Session avec Tonio', amount: -25.00, date: '22 Mars 2026' },
        { type: 'Vente', description: 'Carte Dracaufeu VMAX', amount: 120.00, date: '20 Mars 2026' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Balance and Actions */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-lg h-fit">
                        <p className="text-lg text-gray-500 mb-2">Solde actuel</p>
                        <p className="text-6xl font-bold text-[#1A3A6E] font-['Poppins'] mb-8">245,10€</p>
                        <div className="flex flex-col gap-4">
                            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1A3A6E] text-white font-semibold rounded-xl shadow-md hover:bg-blue-800 transition-colors">
                                <Plus className="w-5 h-5" />
                                Ajouter des fonds
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-200 transition-colors">
                                <Download className="w-5 h-5" />
                                Exporter l'historique
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-[#1A3A6E] font-['Poppins'] mb-6">Historique des transactions</h2>
                        <div className="flow-root">
                            <ul className="-my-4 divide-y divide-gray-100">
                                {transactions.map((transaction, index) => (
                                    <li key={index} className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {transaction.amount > 0 ? <ArrowDown className="w-6 h-6" /> : <ArrowUp className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{transaction.description}</p>
                                                <p className="text-sm text-gray-500">{transaction.date}</p>
                                            </div>
                                        </div>
                                        <p className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
