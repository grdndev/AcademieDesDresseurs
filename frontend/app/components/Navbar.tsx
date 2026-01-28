"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Apprendre", href: "/apprendre" },
        { name: "Progresser", href: "/progresser" },
        { name: "S'équiper", href: "/sequiper" },
        { name: "Devenir Professeur", href: "/professeur" },
    ];

    return (
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        Académie des Dresseurs
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-gray-500'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                        Connexion
                    </Link>
                    <Link href="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all font-outfit">
                        S'inscrire
                    </Link>
                </div>
            </div>
        </nav>
    );
}
