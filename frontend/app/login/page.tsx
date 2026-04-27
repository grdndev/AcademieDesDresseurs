"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const role = email.includes("admin") ? "admin"
            : email.includes("prof") ? "professeur"
            : "joueur";
        localStorage.setItem("mock_user", JSON.stringify({
            name: email.split("@")[0],
            email,
            role,
        }));
        if (role === "admin") router.push("/admin");
        else if (role === "professeur") router.push("/espace-professeur");
        else router.push("/espace-joueur");
    }
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900">Bon retour !</h1>
                    <p className="text-gray-500 mt-2">Accédez à votre espace dresseur</p>
                </div>

                {/* Card */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="nom@exemple.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-700">Mot de passe</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">Oublié ?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group">
                            Se connecter
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                        <p className="text-center text-sm text-gray-500">
                            Pas encore de compte ?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Créer un compte
                            </Link>
                        </p>
                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                            <p className="font-semibold text-gray-600">Comptes de démo :</p>
                            <p>• <span className="font-mono">joueur@demo.fr</span> → Espace Joueur</p>
                            <p>• <span className="font-mono">prof@demo.fr</span> → Espace Professeur</p>
                            <p>• <span className="font-mono">admin@demo.fr</span> → Dashboard Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
