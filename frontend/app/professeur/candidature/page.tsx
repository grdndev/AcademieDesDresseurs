"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { ChevronDown } from "lucide-react";

const PAYS = ["France", "Belgique", "Suisse", "Luxembourg", "Canada", "Autres"];
const CLASSEMENTS = ["Débutant", "Intermédiaire", "Avancé", "Top 32 Régionaux", "Top 8 Régionaux", "Top 4 Régionaux", "Champion Régional", "Top 32 Nationaux", "Top 8 Nationaux", "Champion National", "Top 8 Worlds"];

const inputClass = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af]";
const labelClass = "block text-xs font-semibold text-[#140759] mb-1.5";

const SPECIALITES = ["Deck building", "Ateliers", "Coaching", "Tournois qualifiés"];
const CONTENUS    = ["Cours", "Guide", "Coaching", "Ateliers"];

export default function CandidatureProfesseurPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [specialites, setSpecialites] = useState<string[]>([]);
    const [contenus,    setContenus]    = useState<string[]>([]);

    function toggleCheck(arr: string[], setArr: (v: string[]) => void, val: string) {
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => router.push("/professeur/confirmation"), 600);
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Navbar />

            <main className="max-w-[760px] mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Candidature Professeur</h1>
                    <p className="text-sm text-[#808896]">
                        Partagez votre expertise Pokémon TCG avec la communauté et aidez les dresseurs à s'améliorer. Votre candidature sera examinée par notre équipe pédagogique dans un délai de 48 heures.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── 1. Informations personnelles ── */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-7 h-7 rounded-full bg-[#01509d] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">1</span>
                            </div>
                            <h2 className="font-['Poppins'] font-bold text-base text-[#140759]">Informations personnelles</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Nom complet *</label>
                                <input required type="text" placeholder="Jean Dupont" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Email *</label>
                                <input required type="email" placeholder="jean@exemple.com" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Pays *</label>
                                <div className="relative">
                                    <select required className={`${inputClass} appearance-none pr-8`} defaultValue="">
                                        <option value="" disabled>Sélectionner votre pays</option>
                                        {PAYS.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Mot de passe *</label>
                                <input required type="password" placeholder="Votre mot de passe" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* ── 2. Expérience Pokémon TCG ── */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-7 h-7 rounded-full bg-[#01509d] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">2</span>
                            </div>
                            <h2 className="font-['Poppins'] font-bold text-base text-[#140759]">Votre expérience Pokémon TCG</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Classement</label>
                                    <div className="relative">
                                        <select className={`${inputClass} appearance-none pr-8`} defaultValue="">
                                            <option value="" disabled>Débutant</option>
                                            {CLASSEMENTS.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808896] pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Palmarès / Niveaux d'expérience</label>
                                    <input type="text" placeholder="Ex: Top 8 Régionaux 2023" className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Spécialité(s)</label>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {SPECIALITES.map(s => (
                                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={specialites.includes(s)}
                                                onChange={() => toggleCheck(specialites, setSpecialites, s)}
                                                className="w-4 h-4 accent-[#01509d]" />
                                            <span className="text-sm text-[#140759]">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Décrivez votre expérience</label>
                                <textarea rows={3} placeholder="Partagez votre parcours, vos résultats et ce qui vous motive à enseigner..."
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <div>
                                <label className={labelClass}>Réseaux / Profil de joueur</label>
                                <input type="text" placeholder="Lien Limitless, Pokémon Players Cup..." className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* ── 3. Contenus à proposer ── */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-7 h-7 rounded-full bg-[#01509d] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">3</span>
                            </div>
                            <h2 className="font-['Poppins'] font-bold text-base text-[#140759]">Contenus que vous souhaitez proposer</h2>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {CONTENUS.map(c => (
                                <label key={c} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={contenus.includes(c)}
                                        onChange={() => toggleCheck(contenus, setContenus, c)}
                                        className="w-4 h-4 accent-[#01509d]" />
                                    <span className="text-sm text-[#140759]">{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── 4. Profils sociaux ── */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-7 h-7 rounded-full bg-[#01509d] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">4</span>
                            </div>
                            <h2 className="font-['Poppins'] font-bold text-base text-[#140759]">
                                Profils sociaux <span className="text-[#808896] font-normal text-xs">(optionnel)</span>
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>TikTok</label>
                                <input type="url" placeholder="https://tiktok.com/@pseudo" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Twitch</label>
                                <input type="url" placeholder="https://twitch.tv/pseudo" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Twitter / X</label>
                                <input type="url" placeholder="https://twitter.com/pseudo" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Discord</label>
                                <input type="text" placeholder="pseudo#1234" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* ── Acceptation + Submit ── */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required checked={accepted} onChange={e => setAccepted(e.target.checked)}
                            className="w-4 h-4 mt-0.5 accent-[#01509d] flex-shrink-0" />
                        <span className="text-xs text-[#4b5563] leading-relaxed">
                            J'accepte les conditions d'utilisation et la politique de confidentialité de l'Académie des Dresseurs.
                        </span>
                    </label>

                    <button type="submit" disabled={loading || !accepted}
                        className="w-full h-12 bg-[#01509d] hover:bg-[#014080] disabled:opacity-50 disabled:cursor-not-allowed text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                        {loading ? "Envoi en cours…" : "Soumettre ma candidature"}
                    </button>

                    <p className="text-center text-xs text-[#808896]">
                        Votre candidature sera examinée dans un délai de 48 heures. Vous recevrez une réponse par email.
                    </p>

                </form>
            </main>
        </div>
    );
}
