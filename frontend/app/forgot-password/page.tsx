import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <section className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Mot de passe oublié</h1>
        <p className="text-gray-500 mb-6">
          Entrez votre email pour recevoir les instructions de réinitialisation.
        </p>

  <form className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="nom@exemple.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all"
          >
            Envoyer le lien
          </button>
        </form>
      </section>
    </main>
  );
}
