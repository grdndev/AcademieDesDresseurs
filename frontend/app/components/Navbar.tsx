"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const logoImg = "/res/div.png";
const attachmentImg = "/res/attachment-Photoroom 1.png";
const vector1Img = "/res/Vector_1.png";
const vector2Img = "/res/Vector_2.png";

const pageTitles: { [key: string]: { title: string; subtitle: string } } = {
    "/apprendre": {
        title: "Formations",
        subtitle: "Développez vos compétences et devenez un Dresseur d'élite.",
    },
    "/progresser": {
        title: "Progresser",
        subtitle: "Trouvez un coach et atteignez vos objectifs.",
    },
    "/sequiper": {
        title: "S'équiper",
        subtitle: "Trouvez les meilleures cartes et accessoires.",
    },
    "/professeur": {
        title: "Devenir Professeur",
        subtitle: "Partagez votre savoir et rejoignez notre équipe.",
    },
    "/wallet": {
        title: "Mon Portefeuille",
        subtitle: "Gérez vos fonds et consultez l'historique de vos transactions.",
    },
    "/login": {
        title: "Connexion",
        subtitle: "Accédez à votre compte pour continuer votre aventure.",
    },
    "/register": {
        title: "Inscription",
        subtitle: "Rejoignez la plus grande communauté de Dresseurs.",
    },
};

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const pageInfo = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1];

    const navLinks = [
        { name: "Accueil", href: "/" },
        { name: "Apprendre", href: "/apprendre" },
        { name: "Progresser", href: "/progresser" },
        { name: "S'équiper", href: "/sequiper" },
        { name: "Devenir Professeur", href: "/professeur" },
    ];

    const isActiveLink = (href: string) => pathname === href;

    if (isHome) {
        return (
            <header className="relative w-full h-[794px] bg-[#6096BA] overflow-hidden text-white font-['Inter']">
                {/* Decorative vectors - responsive: hide on small screens and scale responsibly */}
            <Image
                src={vector1Img}
                alt=""
                aria-hidden
                className="hidden md:block absolute -top-2 -left-2 w-55 md:w-120 lg:w-217 h-auto"
                style={{ transform: 'rotate(0.32deg)' }}
                unoptimized
                priority
            />
            <Image
                src={vector2Img}
                alt=""
                aria-hidden
                className="hidden lg:block absolute top-[443px] left-[1090px] w-[400px] lg:w-[868px] h-auto object-contain"
                // Prevent any transform/scale from applying to this decorative vector
                style={{ transform: 'none', objectFit: 'contain' }}
                unoptimized
                priority
            />
                <Image
                    src={attachmentImg}
                    alt=""
                    aria-hidden
                    className="hidden lg:block absolute top-[265px] left-[1167px] w-[280px] lg:w-[562px] h-auto object-contain"
                    unoptimized
                    priority
                />

                {/* Navigation */}
                <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 md:px-[100px] py-4 h-[140px]">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src={logoImg}
                            alt="Académie des Dresseurs"
                            width={84}
                            height={81}
                            className="rounded-lg"
                            priority
                        />
                    </Link>
                    <div className="flex items-center gap-[37px] text-[18px] font-medium tracking-[-0.5px]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors hover:text-gray-200 ${isActiveLink(link.href) ? 'font-semibold' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-[16px]">
                        <Link href="/login" className="box-border w-[124px] h-[52px] flex items-center justify-center text-[18px] font-semibold border-2 border-white rounded-lg transition-colors hover:bg-white hover:text-[#274C78]">
                            Connexion
                        </Link>
                        <Link href="/register" className="w-[115.7px] h-[48px] flex items-center justify-center text-[18px] font-semibold bg-[#DBB42C] text-white rounded-lg shadow-lg transition-colors hover:bg-yellow-500">
                            S’inscrire
                        </Link>
                    </div>
                </nav>

                {/* Hero Content (keep desktop positions; center on small screens) */}
                <div className="absolute top-[214px] left-1/2 -translate-x-1/2 lg:left-[calc(50%-315.02px/2-560.49px)] lg:translate-x-0 w-[315px] sm:w-[420px] h-[42px] bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                    <span className="font-medium text-[14px] leading-[20px] tracking-[-0.5px] px-4 text-center">La référence francophone Pokémon TCG</span>
                </div>

                <div className="absolute top-[265px] left-1/2 -translate-x-1/2 lg:left-[calc(50%-604px/2-416px)] lg:translate-x-0 w-[280px] sm:w-[604px] lg:w-[604px]">
                    <h1 className="font-['Poppins'] font-bold text-[72px] leading-[84px] tracking-[-0.5px]">
                        Devenez un Dresseur d&apos;Élite.
                    </h1>
                </div>

                <div className="absolute top-[456px] left-1/2 -translate-x-1/2 lg:left-[calc(50%-729px/2-353.5px)] lg:translate-x-0 w-[300px] sm:w-[729px]">
                    <p className="font-medium text-[24px] leading-[33px] tracking-[-0.5px]">
                        L&apos;unique plateforme qui combine Apprentissage, Coaching et Boutique Expert.
                    </p>
                </div>

                {/* Action Buttons (desktop left, center & stack on small screens) */}
                <div className="absolute top-[596px] left-1/2 -translate-x-1/2 lg:left-[242px] lg:translate-x-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-[24px] w-[90%] sm:w-auto max-w-[720px]">
                     <Link href="/apprendre?variant=2" className="w-full sm:w-[253.83px] h-[60px] bg-[#DBB42B] rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25),_inset_0px_-4px_4px_rgba(0,0,0,0.5),_inset_0px_4px_4px_rgba(255,255,255,0.5)] flex items-center justify-center text-[#1A3A6E] font-bold text-[20px] tracking-[-0.5px]">
                        Explorer les cours
                    </Link>
                    <Link href="/sequiper" className="box-border w-full sm:w-[236.44px] h-[64px] bg-[#01509D] border-2 border-[#A3CEF1] rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25),_inset_0px_-4px_4px_rgba(0,0,0,0.5),_inset_0px_4px_4px_rgba(255,255,255,0.5)] flex items-center justify-center text-white font-bold text-[20px] tracking-[-0.5px]">
                        Voir la boutique
                    </Link>
                </div>
            </header>
        );
    }

    // Header for other pages: keep the blue background and decorative vectors,
    // show the page title/subtitle centrally similar to the home hero.
    const baseSegment = pathname.split("/").filter(Boolean)[0] || "";
    const derivedTitle = pageInfo?.title || (baseSegment ? baseSegment.charAt(0).toUpperCase() + baseSegment.slice(1) : "Page");
    const derivedSubtitle = pageInfo?.subtitle || "";
    return (
        <header className="relative w-full bg-[#6096BA] overflow-hidden text-white font-['Inter']">
            {/* Decorative vectors - same as home, shown responsively */}
            <Image
                src={vector1Img}
                alt=""
                aria-hidden
                className="hidden md:block absolute -top-2 -left-2 w-55 md:w-120 lg:w-217 h-auto"
                style={{ transform: 'rotate(0.32deg)' }}
                unoptimized
                priority
            />
            <Image
                src={vector2Img}
                alt=""
                aria-hidden
                className="hidden lg:block absolute top-55 right-0 w-100 lg:w-217 h-auto object-contain"
                style={{ transform: 'none', objectFit: 'contain' }}
                unoptimized
                priority
            />
            <Image
                src={attachmentImg}
                alt=""
                aria-hidden
                className="hidden lg:block absolute top-30 right-8 w-70 lg:w-140.5 h-auto object-contain"
                unoptimized
                priority
            />

            {/* Navigation (top) */}
            <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 md:px-25 py-4">
                <Link href="/" className="shrink-0 flex items-center gap-2">
                    <Image
                        src={logoImg}
                        alt="Académie des Dresseurs"
                        width={64}
                        height={64}
                        className="rounded-lg"
                        priority
                    />
                    <span className="hidden md:inline text-xl font-bold">Académie des Dresseurs</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-gray-200 ${isActiveLink(link.href) ? 'font-semibold' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-white/90 hover:bg-white/20 rounded-xl transition-all">
                        Connexion
                    </Link>
                    <Link href="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-[#DBB42C] rounded-full shadow-lg shadow-black/20 hover:opacity-95 transition-all">
                        S&apos;inscrire
                    </Link>
                </div>
            </nav>

            {/* Page title area - follow reference alignment (center or left) */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-18 md:pt-44 md:pb-24 lg:pt-48 lg:pb-28 text-left">
                <div className="max-w-4xl">
                    <h1 className="font-['Poppins'] font-extrabold text-[54px] md:text-[72px] lg:text-[88px] leading-[1.05] tracking-[-0.5px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                        {derivedTitle}
                    </h1>
                    {derivedSubtitle && (
                        <p className="mt-5 text-xl md:text-2xl text-white/95 max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                            {derivedSubtitle}
                        </p>
                    )}
                </div>
            </div>
        </header>
    );
}
