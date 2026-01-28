import Navbar from "./components/Navbar";
import { GraduationCap, TrendingUp, ShoppingBag, ArrowRight, Play, BookOpen, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-outfit text-foreground bg-background">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-20 pb-32 bg-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary-lightblue/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 text-primary text-sm font-bold mb-8 border border-blue-100 shadow-sm transition-all hover:bg-blue-100">
              <Star className="w-4 h-4 fill-primary" />
              <span>La référence francophone Pokémon TCG</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-slate-900 leading-[1.1]">
              Devenez un <br />
              <span className="text-primary">Dresseur d'Élite</span>
            </h1>

            <p className="mt-4 text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium">
              L'unique plateforme qui combine <span className="text-slate-900 font-bold underline decoration-accent decoration-4">Apprentissage</span>, <span className="text-slate-900 font-bold underline decoration-primary decoration-4">Coaching</span> et <span className="text-slate-900 font-bold underline decoration-green-500 decoration-4">Boutique Expert</span>.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/apprendre" className="group px-10 py-5 text-white bg-primary hover:bg-primary-dark rounded-2xl font-black shadow-2xl shadow-primary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                Explorer les cours
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/sequiper" className="px-10 py-5 text-slate-700 bg-white hover:bg-gray-50 border-2 border-slate-100 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-lg shadow-sm">
                Voir la boutique
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 pt-12 text-slate-400">
              <div><span className="block text-3xl font-black text-slate-900">+50</span> Professeurs</div>
              <div><span className="block text-3xl font-black text-slate-900">24/7</span> Coaching</div>
              <div><span className="block text-3xl font-black text-slate-900">+5k</span> Cartes</div>
              <div><span className="block text-3xl font-black text-slate-900">98%</span> Succès</div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-[#F9FAEE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Un écosystème conçu pour gagner.</h2>
                <p className="text-xl text-slate-500">Choisissez votre voie et commencez votre ascension.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Apprendre */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Apprendre</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Des masterclass, des guides et des replays stratégiques pour assimiler les bases et les mécaniques complexes.
                </p>
                <Link href="/apprendre" className="inline-flex items-center gap-3 font-black text-primary text-lg group-hover:gap-5 transition-all">
                  Découvrir les cours <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Progresser */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-accent group-hover:text-slate-900 transition-all transform group-hover:-rotate-6">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Progresser</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Accompagnement individuel par les meilleurs mondiaux. Ateliers de deck-building et préparation tournois.
                </p>
                <Link href="/progresser" className="inline-flex items-center gap-3 font-black text-yellow-600 text-lg group-hover:gap-5 transition-all">
                  Trouver un coach <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* S'équiper */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">S'équiper</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Boutique de cartes à l'unité, decks préconstruits et accessoires. Conversion automatique de vos listes en panier.
                </p>
                <Link href="/sequiper" className="inline-flex items-center gap-3 font-black text-green-600 text-lg group-hover:gap-5 transition-all">
                  Ouvrir la boutique <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Video CTA */}
        <section className="py-24 bg-white relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[50px] overflow-hidden group shadow-3xl bg-slate-900 aspect-video flex items-center justify-center cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-primary fill-primary ml-1" />
              </div>
              <div className="absolute bottom-10 left-10 right-10 z-10">
                <h4 className="text-white text-2xl font-black opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">Le concept de l'Académie en 60 secondes</h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-12">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <span className="text-2xl font-black text-white block mb-6 leading-tight">L'Académie des Dresseurs</span>
              <p className="text-lg max-w-sm mb-8 leading-relaxed">
                Le hub francophone du Pokémon JCC. De l'apprentissage à la victoire, nous sommes votre allié stratégique.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-primary transition-colors cursor-pointer"></div>)}
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Plateforme</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="/apprendre" className="hover:text-white">Apprendre</Link></li>
                <li><Link href="/progresser" className="hover:text-white">Progresser</Link></li>
                <li><Link href="/sequiper" className="hover:text-white">S'équiper</Link></li>
                <li><Link href="/professeur" className="hover:text-white">Devenir Professeur</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Informations</h5>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="hover:text-white">Mentions Légales</Link></li>
                <li><Link href="#" className="hover:text-white">CGV / CGU</Link></li>
                <li><Link href="#" className="hover:text-white">Confidentialité</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">© 2026 Académie des Dresseurs. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-600">
              <span>FRA</span>
              <span>•</span>
              <span>ENG</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
