import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
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
                            <li><Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link></li>
                            <li><Link href="/conditions" className="hover:text-white">CGV / CGU</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
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
    )
}

export default Footer
