import Navbar from "../components/Navbar";
import { Users, GraduationCap, DollarSign, ShieldCheck, ArrowRight } from "lucide-react";

export default function ProfesseurPage() {
    const benefits = [
        { title: "Visibilité", desc: "Touchez une communauté de milliers de joueurs francophones.", icon: Users },
        { title: "Revenus", desc: "Monétisez votre expertise avec des commissions avantageuses.", icon: DollarSign },
        { title: "Plateforme Logicielle", desc: "Outils de gestion d'agenda et de visio intégrés.", icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-white font-outfit">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Partagez votre savoir, <br />
                            <span className="text-primary-lightblue italic">transmettez votre passion.</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                            L'Académie recrute ses futurs professeurs. Profitez d'un cadre structuré pour coacher, créer des guides et animer des cours.
                        </p>
                        <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform">
                            Déposer ma candidature
                        </button>
                    </div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                </section>

                {/* Benefits */}
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900">Pourquoi devenir Professeur à l'Académie ?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {benefits.map((b, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-20 h-20 bg-gray-50 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <b.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{b.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requirements / FAQ mini */}
                <section className="bg-gray-50 py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
                        <h2 className="text-3xl font-black mb-10 text-center">Processus de sélection</h2>
                        <div className="space-y-8">
                            {[
                                "Étape 1 : Formulaire de candidature (Expérience, Palmarès, Motivations).",
                                "Étape 2 : Entretien avec nos directeurs pédagogiques.",
                                "Étape 3 : Validation technique et création de votre profil.",
                                "Étape 4 : Début de vos premières sessions encadrées."
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                                    <p className="font-bold text-slate-700">{step}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <button className="flex items-center gap-2 mx-auto text-primary font-bold hover:underline">
                                Consulter la FAQ complète <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
