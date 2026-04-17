import Link from "next/link";
import Navbar from "../../components/Navbar";
import { CheckCircle, Search, UserCheck, Rocket, Info } from "lucide-react";

const ETAPES = [
    { icon: Search,    step: "1", title: "Analyse de votre candidature", desc: "Notre équipe pédagogique examine votre profil sous 48h ouvrées." },
    { icon: UserCheck, step: "2", title: "Validation de l'Espace Académie",  desc: "Vous recevrez un email pour confirmer votre accès au tableau de bord professeur." },
    { icon: Rocket,    step: "3", title: "Activations de votre compte",   desc: "Commencez à créer vos cours, guides et sessions de coaching en toute autonomie." },
];

export default function ConfirmationCandidaturePage() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main className="max-w-[600px] mx-auto px-6 py-16">

                {/* Checkmark */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Candidature envoyée</h1>
                    <p className="text-sm text-[#808896]">Merci pour votre candidature. Notre équipe va examiner votre profil.</p>
                </div>

                {/* Prochaines étapes */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 mb-5">
                    <h2 className="font-['Poppins'] font-bold text-base text-[#140759] mb-5">Prochaines étapes</h2>

                    <div className="space-y-5">
                        {ETAPES.map(({ icon: Icon, step, title, desc }) => (
                            <div key={step} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#eef5fb] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-[#01509d]" />
                                </div>
                                <div>
                                    <p className="font-['Inter'] font-semibold text-sm text-[#140759] mb-0.5">{title}</p>
                                    <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note info */}
                <div className="flex items-start gap-3 p-4 bg-[#eef5fb] border border-[#01509d]/20 rounded-2xl mb-8 text-xs text-[#4b5563]">
                    <Info className="w-4 h-4 text-[#01509d] flex-shrink-0 mt-0.5" />
                    <p>Si votre candidature est acceptée, vous recevrez un lien pour accéder à la plateforme de gestion de vos cours au sein de l'Académie.</p>
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                    <Link href="/" className="flex-1 h-11 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                        Retour à l&apos;accueil
                    </Link>
                    <Link href="/espace-joueur" className="flex-1 h-11 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl flex items-center justify-center transition-colors">
                        Voir ma candidature
                    </Link>
                </div>

            </main>
        </div>
    );
}
