import Link from "next/link";
import { GraduationCap, Twitter, Youtube, Instagram, Twitch } from "lucide-react";

const SOCIAL = [
    { Icon: Twitter,    href: "#" },
    { Icon: Youtube,    href: "#" },
    { Icon: Instagram,  href: "#" },
    { Icon: Twitch,     href: "#" },
];

const PLATFORM_LINKS = [
    { label: "Apprendre",          href: "/apprendre" },
    { label: "Progresser",         href: "/progresser" },
    { label: "S'équiper",          href: "/sequiper" },
    { label: "Devenir Professeur", href: "/professeur" },
];

const INFO_LINKS = [
    { label: "Mentions Légales", href: "/mentions-legales" },
    { label: "CGV / CGU",        href: "/conditions" },
    { label: "Confidentialité",  href: "/confidentialite" },
    { label: "Contact",          href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="bg-[#0d1b3e] text-white/60 py-16">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-[100px]">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-6 h-6 text-white" />
                            <span className="font-['Poppins'] font-bold text-white text-lg">
                                Académie des Dresseurs
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm mb-6">
                            Le hub francophone du Pokémon JCC. De l'apprentissage à la victoire,
                            nous sommes votre allié stratégique.
                        </p>
                        <div className="flex gap-3">
                            {SOCIAL.map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#01509d] flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-4 h-4 text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Plateforme */}
                    <div>
                        <h5 className="text-white font-bold text-sm mb-5">Plateforme</h5>
                        <ul className="space-y-3 text-sm">
                            {PLATFORM_LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informations */}
                    <div>
                        <h5 className="text-white font-bold text-sm mb-5">Informations</h5>
                        <ul className="space-y-3 text-sm">
                            {INFO_LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    <p>© 2026 Académie des Dresseurs. Tous droits réservés.</p>
                    <div className="flex items-center gap-4 font-bold uppercase tracking-widest text-white/30">
                        <span>FRA</span><span>•</span><span>ENG</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
