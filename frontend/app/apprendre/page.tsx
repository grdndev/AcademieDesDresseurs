import Navbar from "../components/Navbar";
import { PlayCircle, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ApprendrePage() {
    const categories = ["Débutant", "Intermédiaire", "Expert", "Parents"];

    const courses = [
        { title: "Bases du JCC Pokémon", type: "Cours Live", duration: "1h30", level: "Débutant", price: "Gratuit", icon: PlayCircle },
        { title: "Analyse de la Méta OBF", type: "Guide PDF", duration: "25 pages", level: "Expert", price: "9.99€", icon: BookOpen },
        { title: "Gestion des Ressources", type: "Replay", duration: "45min", level: "Intermédiaire", price: "14.99€", icon: PlayCircle },
    ];

    return (
        <div className="min-h-screen bg-white font-outfit">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Apprenez les <span className="text-primary italic">Secrets du Jeu</span>
                        </h1>
                        <p className="text-xl text-slate-500">
                            Des cours structurés pour comprendre chaque mécanique, des bases aux stratégies de tournoi.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map(c => (
                            <button key={c} className="px-5 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-primary hover:text-white transition-all">
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {courses.map((course, idx) => (
                        <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group">
                            <div className="h-48 bg-slate-100 relative items-center justify-center flex overflow-hidden">
                                <course.icon className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        {course.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-4 h-4 fill-accent text-accent" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">{course.level}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{course.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Clock className="w-4 h-4" /> {course.duration}
                                    </div>
                                    <div className="font-black text-primary text-base ml-auto">
                                        {course.price}
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group/btn">
                                    Accéder au contenu
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promotion */}
                <div className="bg-accent rounded-[40px] p-12 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black mb-4">Pack Nouveau Dresseur</h2>
                        <p className="text-lg font-medium opacity-80 mb-0">
                            Contient 5 cours fondamentaux + 1 guide PDF + 1 analyse de deck budget. Idéal pour démarrer proprement.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-sm font-bold opacity-50 line-through">49.99€</span>
                            <span className="block text-4xl font-black">29.99€</span>
                        </div>
                        <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                            Acheter le pack
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
