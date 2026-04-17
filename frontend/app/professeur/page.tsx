import Link from "next/link";
import Navbar from "../components/Navbar";
import { DollarSign, Share2, Users, TrendingUp, Headphones, Star } from "lucide-react";

const POURQUOI = [
    { icon: DollarSign, title: "Monétisez votre expertise",      desc: "Générez des revenus récurrents en partageant vos connaissances avec des milliers de joueurs francophones." },
    { icon: Share2,     title: "Partagez vos stratégies",        desc: "Publiez cours, guides et sessions de coaching pour transmettre votre passion du Pokémon TCG compétitif." },
    { icon: Users,      title: "Construisez votre communauté",   desc: "Développez votre audience et fidélisez vos élèves grâce aux outils intégrés de l'Académie." },
];

const COMMENT = [
    { n: 1, title: "Soumettre votre candidature", desc: "Remplissez le formulaire en ligne avec votre expérience, palmarès et motivations." },
    { n: 2, title: "Validation par l'Académie",   desc: "Notre équipe pédagogique évalue votre profil et vous contacte sous 48h." },
    { n: 3, title: "Publier vos contenus",         desc: "Créez et diffusez vos cours, guides et sessions de coaching dès validation." },
];

const AVANTAGES = [
    { icon: DollarSign,  title: "Revenus sur vos contenus",   desc: "Percevez jusqu'à 70% des revenus générés par vos cours, coachings et guides stratégiques." },
    { icon: Users,       title: "Coaching individuel",         desc: "Gérez votre agenda en ligne, réalisez vos sessions en visio et soyez payé automatiquement." },
    { icon: TrendingUp,  title: "Visibilité plateforme",       desc: "Votre profil est mis en avant auprès de toute notre communauté de joueurs actifs." },
    { icon: Headphones,  title: "Support technique",           desc: "Une équipe dédiée vous accompagne pour la création et la mise en ligne de vos contenus." },
];

const PROFESSEURS = [
    { name: "Thomas R.",  role: "Coach Régional",    img: "/res/avatar1.png", rating: 4.9, students: 312 },
    { name: "Mathis C.",  role: "Champion National",  img: "/res/avatar2.png", rating: 5.0, students: 184 },
    { name: "Léa D.",     role: "Top 8 Internationaux", img: "/res/avatar3.png", rating: 4.8, students: 97 },
];

export default function ProfesseurPage() {
    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar /> 

            <main>

                {/* ── Pourquoi devenir Professeur ? ── */}
                <section className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-14">
                    <div className="text-center mb-10">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Pourquoi devenir Professeur ?</h2>
                        <p className="text-sm text-[#808896]">Rejoignez une plateforme construite pour valoriser les experts du Pokémon TCG.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {POURQUOI.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#eef5fb] flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-[#01509d]" />
                                </div>
                                <div>
                                    <h3 className="font-['Inter'] font-bold text-[#140759] mb-1">{title}</h3>
                                    <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Comment ça fonctionne ── */}
                <section className="bg-[#e3ecf8] py-14">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                        <div className="text-center mb-10">
                            <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Comment ça fonctionne ?</h2>
                            <p className="text-sm text-[#808896]">3 étapes pour rejoindre l'académie et commencer à transmettre votre passion.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {COMMENT.map(({ n, title, desc }) => (
                                <div key={n} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                                    <div className="w-10 h-10 rounded-full bg-[#01509d] flex items-center justify-center mb-4">
                                        <span className="font-['Poppins'] font-bold text-white text-sm">{n}</span>
                                    </div>
                                    <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{title}</h3>
                                    <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Avantages professeur ── */}
                <section id="avantages" className="max-w-[1280px] mx-auto px-6 lg:px-[100px] py-14">
                    <div className="text-center mb-10">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Avantages professeur</h2>
                        <p className="text-sm text-[#808896]">Choisissez le format qui correspond à votre expertise et à vos ambitions.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {AVANTAGES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#eef5fb] flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-[#01509d]" />
                                </div>
                                <div>
                                    <h3 className="font-['Inter'] font-bold text-sm text-[#140759] mb-1">{title}</h3>
                                    <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Professeurs en vedette */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-8">
                        <h3 className="font-['Poppins'] font-bold text-lg text-[#140759] mb-6 text-center">Ils enseignent déjà sur l'Académie</h3>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {PROFESSEURS.map((p) => (
                                <div key={p.name} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e5e7eb]">
                                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter'] font-bold text-sm text-[#140759]">{p.name}</p>
                                        <p className="text-xs text-[#808896]">{p.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[#808896]">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span>{p.rating}</span>
                                        <span>·</span>
                                        <span>{p.students} élèves</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA candidature ── */}
                <section id="candidature" className="bg-gradient-to-r from-[#140759] to-[#01509d] py-16">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px] text-center">
                        <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-3">Prêt à rejoindre l'Académie ?</h2>
                        <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">Déposez votre candidature dès aujourd'hui et commencez votre aventure de formateur compétitif.</p>
                        <Link href="/professeur/candidature" className="inline-flex h-12 px-8 bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759] font-['Inter'] font-bold text-sm rounded-xl items-center gap-2 transition-colors">
                            Postuler maintenant
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
