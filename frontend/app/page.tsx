import Navbar from "./components/Navbar";
import { GraduationCap, TrendingUp, ShoppingBag, ArrowRight, Play, BookOpen, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-outfit text-foreground bg-background">
      <Navbar />

      <main className="grow bg-white">
        {/* Quick Stats */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="border-r border-gray-200 last:border-r-0">
                <span className="text-5xl font-bold text-[#1A3A6E] font-['Poppins']">50+</span>
                <p className="mt-2 text-lg text-[#6B7280] font-medium">Professeurs</p>
              </div>
              <div className="border-r border-gray-200 last:border-r-0">
                <span className="text-5xl font-bold text-[#1A3A6E] font-['Poppins']">24/7</span>
                <p className="mt-2 text-lg text-[#6B7280] font-medium">Coaching</p>
              </div>
              <div className="border-r border-gray-200 last:border-r-0">
                <span className="text-5xl font-bold text-[#1A3A6E] font-['Poppins']">5k+</span>
                <p className="mt-2 text-lg text-[#6B7280] font-medium">Cartes</p>
              </div>
              <div>
                <span className="text-5xl font-bold text-[#1A3A6E] font-['Poppins']">98%</span>
                <p className="mt-2 text-lg text-[#6B7280] font-medium">Succès</p>
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

        {/* Parcours Section (Trouver votre parcours) */}
        <section className="py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Trouver votre parcours</h2>
                <p className="text-xl text-slate-500">Choisissez votre voie et commencez votre ascension.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Débutant */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Débutant</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Pour bien commencer et maîtriser les bases du jeu.
                </p>
                <Link href="/apprendre?filter=debutant" className="inline-flex items-center gap-3 font-black text-primary text-lg group-hover:gap-5 transition-all">
                  Je commence <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Joueur Avancé */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-accent group-hover:text-slate-900 transition-all transform group-hover:-rotate-6">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Joueur Avancé</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Pour les compétiteurs qui visent la performance.
                </p>
                <Link href="/progresser?filter=avance" className="inline-flex items-center gap-3 font-black text-yellow-600 text-lg group-hover:gap-5 transition-all">
                  Je commence <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Parent */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <Star className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Parent</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Pour accompagner votre enfant dans sa passion.
                </p>
                <Link href="/apprendre?filter=parent" className="inline-flex items-center gap-3 font-black text-red-600 text-lg group-hover:gap-5 transition-all">
                  Je commence <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Collectionneur */}
              <div className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="mb-10 w-20 h-20 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900">Collectionneur</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Pour trouver les cartes rares et gérer votre collection.
                </p>
                <Link href="/sequiper?filter=collectionneur" className="inline-flex items-center gap-3 font-black text-green-600 text-lg group-hover:gap-5 transition-all">
                  Je commence <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* duplicate removed - single Video CTA kept above Parcours */}
      </main>

  {/* Footer removed per reference - footer component lives in components/Footer.tsx if needed elsewhere */}
    </div>
  );
}
