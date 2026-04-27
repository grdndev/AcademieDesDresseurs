import Navbar from "./components/Navbar";
import { BookOpen, TrendingUp, ShoppingBag, Users, Play } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "+90",  label: "Professeurs" },
  { value: "24/7", label: "Coaching" },
  { value: "+9K",  label: "Cartes" },
  { value: "98%",  label: "Succès" },
];

const PARCOURS = [
  {
    icon: BookOpen,
    iconBg: "bg-[#01509d]/10",
    iconColor: "text-[#01509d]",
    title: "Débutant",
    desc: "Des masterclass, des guides et des replays stratégiques pour assimiler les bases et les mécaniques complexes.",
    cta: "Découvrir les cours",
    href: "/apprendre",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-yellow-400/10",
    iconColor: "text-yellow-600",
    title: "Joueur Avancé",
    desc: "Accompagnement individuel par les meilleurs mondiaux. Ateliers de deck-building et préparation tournois.",
    cta: "Trouver un coach",
    href: "/progresser",
  },
  {
    icon: Users,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
    title: "Parent",
    desc: "Boutique de cartes à l'unité, decks préconstruits et accessoires. Conversion automatique de vos listes en panier.",
    cta: "Ouvrir la boutique",
    href: "/sequiper",
  },
  {
    icon: ShoppingBag,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    title: "Collectionneur",
    desc: "Boutique de cartes à l'unité, decks préconstruits et accessoires. Conversion automatique de vos listes en panier.",
    cta: "Ouvrir la boutique",
    href: "/sequiper",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> 

      <main className="grow">
        {/* Stats */}
        <section className="bg-white py-14">
          <div className="max-w-[1088px] mx-auto px-6 lg:px-[100px]">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center py-4 md:py-0 border-r border-gray-100 last:border-r-0"
                >
                  <span className="font-['Poppins'] font-bold text-4xl text-[#140759]">{s.value}</span>
                  <span className="font-['Poppins'] font-semibold text-base text-[#9ca3af] mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video */}
        <section className="bg-[#f8f7f4] py-20">
          <div className="max-w-[1088px] mx-auto px-6 lg:px-[100px]">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center cursor-pointer group shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('/res/video_placeholder.png')" }} />
              <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-[#01509d] fill-[#01509d] ml-1" />
              </div>
            </div>
          </div>
        </section>

        {/* Trouver votre parcours */}
        <section className="bg-[#bed2e9] py-20">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-[60px]">
            <div className="mb-12">
              <h2 className="font-['Poppins'] font-bold text-[40px] leading-tight text-[#140759]">
                Trouver votre parcours
              </h2>
              <p className="font-['Inter'] text-base text-[#4b5563] mt-2">
                Choisissez votre voie et commencez votre ascension.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PARCOURS.map((p) => (
                <div key={p.title} className="bg-[#fdfcfe] rounded-3xl p-8 flex flex-col gap-5 min-h-[420px]">
                  <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center`}>
                    <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-['Poppins'] font-semibold text-2xl text-[#140759] mb-2">{p.title}</h3>
                    <p className="font-['Inter'] text-sm text-[#808896] leading-relaxed">{p.desc}</p>
                  </div>
                  <Link
                    href={p.href}
                    className="w-full h-11 bg-[#01509d] rounded-xl flex items-center justify-center font-['Inter'] font-semibold text-sm text-white hover:bg-[#014080] transition-colors mt-auto"
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
