import Link from "next/link";
import Navbar from "../../components/Navbar";
import { DollarSign, Users, TrendingUp, Headphones, Shield, Globe, Star, ChevronRight } from "lucide-react";

const AVANTAGES = [
    {
        icon: DollarSign,
        title: "Revenus sur vos contenus",
        desc: "Percevez jusqu'à 70% des revenus générés par vos cours, coachings et guides stratégiques. Paiements mensuels automatiques, sans intermédiaire.",
        detail: "La plateforme prélève 20% sur chaque vente. Les 80% restants reviennent au professeur.",
        color: "bg-yellow-50 text-yellow-600",
    },
    {
        icon: Users,
        title: "Coaching individuel",
        desc: "Gérez votre agenda en ligne, réalisez vos sessions en visio et soyez payé automatiquement. Fixez vos créneaux et vos tarifs librement.",
        detail: "Jusqu'à 500€/mois de revenus de coaching pour les coachs actifs.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: TrendingUp,
        title: "Visibilité plateforme",
        desc: "Votre profil est mis en avant auprès de toute notre communauté de joueurs actifs. Newsletter, réseaux sociaux, page d'accueil.",
        detail: "+12 000 joueurs actifs sur la plateforme chaque mois.",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: Headphones,
        title: "Support technique dédié",
        desc: "Une équipe dédiée vous accompagne pour la création et la mise en ligne de vos contenus. Montage vidéo, intégration, SEO.",
        detail: "Réponse sous 24h garantie pour tous les professeurs validés.",
        color: "bg-purple-50 text-purple-600",
    },
    {
        icon: Shield,
        title: "Certification Académie",
        desc: "Devenez un professeur certifié reconnu par la communauté. Un badge officiel sur votre profil atteste de votre expertise validée.",
        detail: "La certification Académie est reconnue dans les tournois majeurs.",
        color: "bg-red-50 text-red-600",
    },
    {
        icon: Globe,
        title: "Audience internationale",
        desc: "Enseignez à des joueurs du monde entier depuis chez vous. La plateforme est disponible en français, anglais et espagnol.",
        detail: "Joueurs présents dans 14 pays francophones et internationaux.",
        color: "bg-teal-50 text-teal-600",
    },
];

const TEMOIGNAGES = [
    { name: "Thomas R.",  role: "Coach Régional",       img: "/res/avatar1.png", rating: 4.9, students: 312, quote: "L'Académie m'a permis de transformer ma passion en revenus réguliers. Je gagne plus de 800€/mois grâce aux sessions de coaching." },
    { name: "Mathis C.",  role: "Champion National",    img: "/res/avatar2.png", rating: 5.0, students: 184, quote: "En 6 mois, j'ai créé 8 guides stratégiques qui me rapportent des revenus passifs chaque semaine. La plateforme est intuitive et l'équipe est réactive." },
    { name: "Léa D.",     role: "Top 8 Internationaux", img: "/res/avatar3.png", rating: 4.8, students: 97,  quote: "Ce que j'apprécie le plus, c'est la qualité de la communauté. Les élèves sont sérieux, motivés et les retours sont excellents." },
];

export default function ProfesseurAvantagesPage() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main>

                {/* Hero */}
                <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-14 text-center">
                    <h1 className="font-['Poppins'] font-bold text-4xl text-[#140759] mb-4">
                        Tout ce que l&apos;Académie offre à ses professeurs
                    </h1>
                    <p className="text-base text-[#808896] max-w-2xl mx-auto mb-8">
                        Rejoignez une plateforme construite pour valoriser les experts du Pokémon TCG et transformer votre expertise en revenus récurrents.
                    </p>
                    <Link href="/professeur/candidature"
                        className="inline-flex h-12 px-8 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl items-center gap-2 transition-colors">
                        Postuler maintenant <ChevronRight className="w-4 h-4" />
                    </Link>
                </section>

                {/* Avantages grid */}
                <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] pb-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {AVANTAGES.map(({ icon: Icon, title, desc, detail, color }) => (
                            <div key={title} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col gap-4">
                                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-['Inter'] font-bold text-[#140759] mb-2">{title}</h3>
                                    <p className="text-sm text-[#808896] leading-relaxed mb-3">{desc}</p>
                                    <p className="text-xs font-semibold text-[#01509d] bg-[#eef5fb] px-3 py-1.5 rounded-lg">{detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tarifs */}
                <section className="bg-[#e3ecf8] py-16">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                        <div className="text-center mb-10">
                            <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Tarifs &amp; commissions</h2>
                            <p className="text-sm text-[#808896]">Transparence totale sur les conditions financières.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {[
                                { label: "Cours en ligne",       rate: "20%", keep: "80%", color: "bg-[#01509d]" },
                                { label: "Coaching individuel",  rate: "20%", keep: "80%", color: "bg-[#dbb42b]" },
                                { label: "Guides stratégiques",  rate: "20%", keep: "80%", color: "bg-[#140759]" },
                            ].map(({ label, rate, keep, color }) => (
                                <div key={label} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 text-center">
                                    <div className={`w-10 h-10 ${color} rounded-xl mx-auto mb-3`} />
                                    <p className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{label}</p>
                                    <p className="text-xs text-[#808896] mb-3">Commission plateforme : {rate}</p>
                                    <p className="font-['Poppins'] font-bold text-2xl text-[#01509d]">{keep}</p>
                                    <p className="text-xs text-[#808896]">revient au professeur</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-[#808896] mt-6">
                            Exemple : cours à 50€ → le professeur reçoit <span className="font-bold text-[#140759]">40€</span>
                        </p>
                    </div>
                </section>

                {/* Témoignages */}
                <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-16">
                    <div className="text-center mb-10">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Ils enseignent déjà sur l&apos;Académie</h2>
                        <p className="text-sm text-[#808896]">Ce que nos professeurs disent de la plateforme.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {TEMOIGNAGES.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#e5e7eb]">
                                        <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter'] font-bold text-sm text-[#140759]">{t.name}</p>
                                        <p className="text-xs text-[#808896]">{t.role}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-xs text-[#808896]">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        {t.rating}
                                    </div>
                                </div>
                                <p className="text-sm text-[#4b5563] leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                                <p className="text-xs text-[#808896]">{t.students} élèves formés</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-[#140759] to-[#01509d] py-16">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] text-center">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-3">Prêt à rejoindre l&apos;Académie ?</h2>
                        <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">Déposez votre candidature dès aujourd'hui et commencez votre aventure de formateur compétitif.</p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Link href="/professeur/candidature" className="inline-flex h-12 px-8 bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl items-center gap-2 transition-colors">
                                Postuler maintenant
                            </Link>
                            <Link href="/professeur" className="inline-flex h-12 px-8 border border-white/30 text-white font-['Inter'] font-semibold text-sm rounded-xl items-center gap-2 hover:bg-white/10 transition-colors">
                                Retour à la présentation
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
