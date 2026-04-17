import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link"; // used in SERVICES hrefs
import { CheckCircle2, Users, Award, CreditCard, HeadphonesIcon, Star } from "lucide-react";

/* ─── Data ─── */
const SERVICES = [
    {
        image: "/res/course1.png",
        title: "Coaching individuel",
        desc: "Des sessions personnalisées avec un coach certifié pour analyser votre jeu et progresser rapidement.",
        checks: ["Session 1 personnalisée", "Analyse de votre gameplay", "Retours constructifs détaillés", "Objectifs compétitifs clairs"],
        cta: "Réserver une séance",
        href: "/progresser/coaching",
    },
    {
        image: "/res/course2.png",
        title: "Ateliers deck building",
        desc: "Construisez et optimisez vos decks avec l'aide d'experts pour dominer la méta actuelle.",
        checks: ["Analyse de la méta en cours", "Construction de liste optimisée", "Gestion du budget efficace", "Stratégies de sideboard"],
        cta: "S'inscrire",
        href: "/progresser/ateliers",
    },
    {
        image: "/res/course3.png",
        title: "Préparation aux tournois",
        desc: "Préparez-vous pour les Régionaux et Internationaux avec un programme intensif sur mesure.",
        checks: ["Programme sur 4 à 8 semaines", "Simulation de tournois, score de 11 rondes", "Gestion du stress compétitif", "Stratégies spécifiques par tournoi"],
        cta: "Réserver",
        href: "/progresser/tournois",
    },
];

const STEPS = [
    { n: 1, title: "Analyse de votre niveau",            desc: "Évaluation complète de vos compétences actuelles et identification de vos axes d'amélioration prioritaires." },
    { n: 2, title: "Plan d'amélioration personnalisée",   desc: "Création d'un programme sur-mesure adapté à vos objectifs, votre niveau et votre emploi du temps." },
    { n: 3, title: "Optimisation compétitive",            desc: "Mise en pratique intensive avec suivi régulier pour maximiser vos performances en tournoi." },
];

const PROFS = [
    { name: "Marc Dubois",   role: "Spécialiste TCG",   avatar: "/res/avatar1.png", rating: 4.9 },
    { name: "Sarah Martin",  role: "Trainer certifié",  avatar: "/res/avatar2.png", rating: 4.8 },
    { name: "Alex Chen",     role: "Maître Champion",   avatar: "/res/avatar3.png", rating: 4.9 },
    { name: "Emma Wilson",   role: "Top 4 profit",      avatar: "/res/avatar1.png", rating: 4.7 },
];

const FEATURES = [
    { icon: Users,           title: "Sessions en groupe",         desc: "Apprenez et progressez aux côtés d'autres joueurs passionnés." },
    { icon: Award,           title: "Professeurs certifiés",      desc: "Coaches validés et suivis par notre équipe pédagogique." },
    { icon: CreditCard,      title: "Paiement sécurisé",          desc: "Transactions protégées, remboursement garanti sous 7 jours." },
    { icon: HeadphonesIcon,  title: "Accompagnement personnalisé",desc: "Un suivi individuel tout au long de votre parcours." },
];

export default function ProgresserPage() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            {/* ── 3 Service cards ── */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-14">
                <div className="grid md:grid-cols-3 gap-6">
                    {SERVICES.map(({ image, title, desc, checks, cta, href }) => (
                        <div key={title} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="relative h-44 flex-shrink-0">
                                <Image src={image} alt={title} fill className="object-cover" unoptimized />
                            </div>
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-['Poppins'] font-bold text-base text-[#140759] mb-2">{title}</h3>
                                <p className="text-xs text-[#808896] leading-relaxed mb-4">{desc}</p>
                                <ul className="space-y-2 mb-5">
                                    {checks.map(c => (
                                        <li key={c} className="flex items-start gap-2 text-xs text-[#140759]">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#01509d] flex-shrink-0 mt-0.5" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={href}
                                    className="mt-auto w-full h-10 flex items-center justify-center bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors">
                                    {cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Un accompagnement structuré ── */}
            <section className="bg-white py-16">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                    <div className="text-center mb-10">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Un accompagnement structuré</h2>
                        <p className="text-sm text-[#808896] max-w-xl mx-auto">
                            Notre méthode éprouvée pour vous faire progresser efficacement vers l'excellence compétitive.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map(({ n, title, desc }) => (
                            <div key={n} className="bg-[#f9fafb] rounded-2xl p-6 border border-[#e5e7eb]">
                                <div className="w-10 h-10 rounded-full bg-[#01509d] flex items-center justify-center mb-4">
                                    <span className="font-['Poppins'] font-bold text-white text-sm">{n}</span>
                                </div>
                                <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-2">{title}</h3>
                                <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Des professeurs validés ── */}
            <section className="bg-[#140759] py-16">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                    <div className="text-center mb-10">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-2">Des professeurs validés par l'Académie</h2>
                        <p className="text-sm text-white/60">Nos coaches sont des joueurs professionnels reconnus dans la communauté compétitive.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {PROFS.map(({ name, role, avatar, rating }) => (
                            <div key={name} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden mx-auto mb-3">
                                    <Image src={avatar} alt={name} width={64} height={64} className="object-cover" unoptimized />
                                </div>
                                <p className="font-['Inter'] font-bold text-sm text-white">{name}</p>
                                <p className="text-xs text-white/60 mb-3">{role}</p>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-[#dbb42b] fill-[#dbb42b]" />
                                    <span className="text-xs font-bold text-white">{rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="bg-[#e3ecf8] py-16">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#eef5fb] flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-5 h-5 text-[#01509d]" />
                                </div>
                                <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{title}</h3>
                                <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
