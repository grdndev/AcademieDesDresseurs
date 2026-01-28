import Navbar from "../components/Navbar";
import { TrendingUp, UserCheck, Award, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProgresserPage() {
    const steps = [
        { title: "Coaching Individuel", desc: "Des sessions 1:1 avec des dresseurs Pro.", icon: UserCheck, color: "bg-blue-100 text-blue-600" },
        { title: "Ateliers Deck Building", desc: "Optimisez vos listes pour la méta.", icon: TrendingUp, color: "bg-yellow-100 text-yellow-600" },
        { title: "Préparation Tournois", desc: "Préparez vos Regionals et Internationals.", icon: Award, color: "bg-green-100 text-green-600" },
    ];

    return (
        <div className="min-h-screen bg-background font-outfit">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Passez au <span className="text-primary">niveau supérieur</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Un accompagnement sur-mesure pour transformer vos défaites en victoires stratégiques.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all group">
                            <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <step.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-500 mb-8">{step.desc}</p>
                            <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                                Réserver une session
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-primary rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold mb-4">Besoin d'un programme personnalisé ?</h2>
                            <p className="text-blue-100 text-lg">
                                Nos experts vous aident à définir vos objectifs et à choisir le professeur le mieux adapté à votre style de jeu.
                            </p>
                        </div>
                        <button className="px-10 py-5 bg-accent text-slate-900 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform whitespace-nowrap">
                            Contacter un conseiller
                        </button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </main>
        </div>
    );
}
