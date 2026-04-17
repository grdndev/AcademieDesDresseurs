"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const logoImg = "/res/div.png";
const attachmentImg = "/res/attachment-Photoroom 1.png";
const vector1Img = "/res/Vector_1.png";
const vector2Img = "/res/Vector_2.png";

interface PageInfo {
    title: string;
    subtitle: string;
    breadcrumb?: string[];
    ctas?: { label: string; href: string; variant: "yellow" | "blue" }[];
}

const pageTitles: { [key: string]: PageInfo } = {
    "/apprendre": {
        title: "Apprendre le Pokémon TCG, étape par étape",
        subtitle: "Des formations pour tous les niveaux, de débutant à champion.",
        breadcrumb: ["Accueil", "Apprendre"],
    },
    "/progresser/coaching": {
        title: "Coaching individuel",
        subtitle: "Bénéficiez d'un accompagnement personnalisé avec nos coachs certifiés.",
        breadcrumb: ["Accueil", "Progresser", "Coaching individuel"],
    },
    "/progresser/ateliers": {
        title: "Ateliers deck building",
        subtitle: "Construisez et optimisez vos decks avec l'aide d'experts.",
        breadcrumb: ["Accueil", "Progresser", "Ateliers"],
    },
    "/progresser/tournois": {
        title: "Préparation aux tournois",
        subtitle: "Un accompagnement stratégique pour performer en compétition.",
        breadcrumb: ["Accueil", "Progresser", "Tournois"],
    },
    "/progresser": {
        title: "Coaching personnalisé et accompagnement compétitif",
        subtitle: "Atteignez vos objectifs avec les meilleurs entraîneurs.",
        breadcrumb: ["Accueil", "Progresser"],
        ctas: [
            { label: "Réserver un coaching", href: "/progresser/coaching", variant: "yellow" },
            { label: "Découvrir les ateliers", href: "/progresser/ateliers", variant: "blue" },
        ],
    },
    "/apprendre/cours/venir": {
        title: "Cours à venir",
        subtitle: "Retrouvez tous les prochains cours et réservez votre place.",
        breadcrumb: ["Accueil", "Apprendre", "Cours à venir"],
    },
    "/apprendre/cours/revoir": {
        title: "Cours à revoir",
        subtitle: "Revisionnez les sessions passées à votre rythme.",
        breadcrumb: ["Accueil", "Apprendre", "Cours à revoir"],
    },
    "/apprendre/cours": {
        title: "Tous les cours",
        subtitle: "Explorez l'ensemble de notre catalogue de formations.",
        breadcrumb: ["Accueil", "Apprendre", "Cours"],
    },
    "/apprendre/guides": {
        title: "Guides stratégiques",
        subtitle: "Analyses approfondies rédigées par nos experts compétitifs.",
        breadcrumb: ["Accueil", "Apprendre", "Guides"],
    },
    "/sequiper": {
        title: "S'équiper",
        subtitle: "Trouvez les meilleures cartes, decks et accessoires.",
        breadcrumb: ["Accueil", "S'équiper"],
    },
    "/professeur/candidature": {
        title: "Candidature Professeur",
        subtitle: "Rejoignez l'Académie et partagez votre expertise avec la communauté.",
        breadcrumb: ["Accueil", "Devenir Professeur", "Candidature"],
    },
    "/professeur": {
        title: "Partagez votre expertise Pokémon TCG.",
        subtitle: "Rejoignez l'Académie des Dresseurs et enseignez aux joueurs de demain.",
        breadcrumb: ["Accueil", "Devenir Professeur"],
        ctas: [
            { label: "Postuler maintenant", href: "/professeur#candidature", variant: "yellow" },
            { label: "En savoir plus", href: "/professeur#avantages", variant: "blue" },
        ],
    },
    "/wallet": {
        title: "Mon Portefeuille",
        subtitle: "Gérez vos fonds et consultez l'historique de vos transactions.",
        breadcrumb: ["Accueil", "Mon Portefeuille"],
    },
    "/login": {
        title: "Connexion",
        subtitle: "Accédez à votre compte pour continuer votre aventure.",
    },
    "/register": {
        title: "Inscription",
        subtitle: "Rejoignez la plus grande communauté de Dresseurs.",
    },
    "/panier": {
        title: "Votre panier",
        subtitle: "Vérifiez vos articles avant de finaliser votre commande.",
        breadcrumb: ["Accueil", "Panier"],
    },
    "/contact": {
        title: "Contact",
        subtitle: "Une question ? Notre équipe vous répond rapidement.",
        breadcrumb: ["Accueil", "Contact"],
    },
};

const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Apprendre", href: "/apprendre" },
    { name: "Progresser", href: "/progresser" },
    { name: "S'équiper", href: "/sequiper" },
    { name: "Devenir Professeur", href: "/professeur" },
];

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const pageInfo = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1];

    const isActiveLink = (href: string) => pathname === href;

    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    useEffect(() => {
        const raw = localStorage.getItem("mock_user");
        if (raw) setUser(JSON.parse(raw));
    }, []);

    // ── HOME ──────────────────────────────────────────────────────────────────
    if (isHome) {
        return (
            <header className="relative w-full h-[794px] bg-[#6096BA] overflow-hidden text-white">
                {/* Decorative vectors */}
                <Image
                    width={872} height={711}
                    src={vector1Img} alt="" aria-hidden
                    className="absolute -top-2 -left-2 w-[340px] md:w-[540px] lg:w-[872px] h-auto opacity-80"
                    style={{ transform: "rotate(0.32deg)" }}
                    unoptimized priority
                />
                <Image
                    width={873} height={969}
                    src={vector2Img} alt="" aria-hidden
                    className="hidden lg:block absolute top-[443px] left-[1090px] w-[868px] h-auto"
                    unoptimized priority
                />
                <Image
                    width={562} height={457}
                    src={attachmentImg} alt="" aria-hidden
                    className="hidden lg:block absolute top-[265px] left-[1167px] w-[562px] h-auto"
                    unoptimized priority
                />

                {/* Navigation */}
                <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 md:px-[100px] h-[140px]">
                    <Link href="/" className="flex-shrink-0">
                        <Image src={logoImg} alt="Académie des Dresseurs" width={84} height={81} className="rounded-lg" priority />
                    </Link>
                    <div className="hidden md:flex items-center gap-[37px]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-['Inter'] text-[18px] font-medium tracking-[-0.5px] transition-colors hover:text-white/80 ${isActiveLink(link.href) ? "font-semibold" : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href={user.role === "professeur" ? "/espace-professeur" : "/espace-joueur"}
                                    className="flex items-center gap-2 h-[48px] px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-[#dbb42b] flex items-center justify-center">
                                        <span className="text-[#140759] font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="font-['Inter'] font-semibold text-sm text-white">{user.name}</span>
                                </Link>
                                <button onClick={() => { localStorage.removeItem("mock_user"); setUser(null); }}
                                    className="h-[48px] px-4 border border-white/30 rounded-lg text-white/70 text-sm hover:text-white transition-colors">
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="box-border w-[124px] h-[52px] flex items-center justify-center font-['Inter'] text-[18px] font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-[#274C78] transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-[115px] h-[48px] flex items-center justify-center font-['Inter'] text-[18px] font-semibold bg-[#DBB42B] rounded-lg shadow-lg hover:bg-yellow-500 transition-colors"
                                >
                                    S&apos;inscrire
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Badge */}
                <div className="absolute top-[214px] left-[242px] w-[315px] h-[42px] bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] font-medium text-[14px] tracking-[-0.5px]">La référence francophone Pokémon TCG</span>
                </div>

                {/* H1 */}
                <div className="absolute top-[265px] left-[242px] w-[604px]">
                    <h1 className="font-['Poppins'] font-bold text-[72px] leading-[84px] tracking-[-0.5px]">
                        Devenez un<br />Dresseur d&apos;Élite.
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="absolute top-[456px] left-[242px] w-[729px]">
                    <p className="font-['Inter'] font-medium text-[24px] leading-[33px] tracking-[-0.5px]">
                        L&apos;unique plateforme qui combine{" "}
                        <span className="underline decoration-[#E1BC2E] decoration-[3px] underline-offset-[5px]">Apprentissage</span>,{" "}
                        <span className="underline decoration-[#A3CEF1] decoration-[3px] underline-offset-[5px]">Coaching</span> et{" "}
                        <span className="underline decoration-[#8BBF00] decoration-[3px] underline-offset-[5px]">Boutique Expert</span>.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="absolute top-[596px] left-[242px] flex items-center gap-6">
                    <Link
                        href="/apprendre"
                        className="w-[254px] h-[60px] bg-[#DBB42B] rounded-xl flex items-center justify-center font-['Inter'] font-bold text-[20px] text-[#1A3A6E] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-yellow-400 transition-colors"
                    >
                        Explorer les cours
                    </Link>
                    <Link
                        href="/sequiper"
                        className="w-[236px] h-[64px] bg-[#01509D] border-2 border-[#A3CEF1] rounded-xl flex items-center justify-center font-['Inter'] font-bold text-[20px] text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#014080] transition-colors"
                    >
                        Voir la boutique
                    </Link>
                </div>
            </header>
        );
    }

    // ── INNER PAGES ───────────────────────────────────────────────────────────
    const baseSegment = pathname.split("/").filter(Boolean)[0] || "";
    const derivedTitle = pageInfo?.title || (baseSegment ? baseSegment.charAt(0).toUpperCase() + baseSegment.slice(1) : "Page");
    const derivedSubtitle = pageInfo?.subtitle || "";
    const breadcrumb = pageInfo?.breadcrumb;
    const ctas = pageInfo?.ctas;

    return (
        <header className="relative w-full bg-[#6096BA] overflow-hidden text-white">
            {/* Decorative vectors */}
            <Image
                width={872} height={711}
                src={vector1Img} alt="" aria-hidden
                className="absolute -top-2 -left-2 w-[340px] md:w-[540px] lg:w-[872px] h-auto opacity-80"
                style={{ transform: "rotate(0.32deg)" }}
                unoptimized priority
            />
            <Image
                width={873} height={969}
                src={vector2Img} alt="" aria-hidden
                className="hidden lg:block absolute top-32 right-0 w-[500px] lg:w-[873px] h-auto"
                unoptimized priority
            />
            <Image
                width={562} height={457}
                src={attachmentImg} alt="" aria-hidden
                className="hidden lg:block absolute top-10 right-8 w-[300px] lg:w-[500px] h-auto"
                unoptimized priority
            />

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-[100px] h-[81px]">
                <Link href="/" className="flex-shrink-0">
                    <Image src={logoImg} alt="Académie des Dresseurs" width={64} height={64} className="rounded-lg" priority />
                </Link>
                <div className="hidden md:flex items-center gap-[37px]">
                    {navLinks.filter(l => l.href !== "/").map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`font-['Inter'] text-[18px] font-medium tracking-[-0.5px] transition-colors hover:text-white/80 ${isActiveLink(link.href) ? "font-semibold" : ""}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href={user.role === "professeur" ? "/espace-professeur" : "/espace-joueur"}
                                className="flex items-center gap-2 h-[48px] px-4 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors">
                                <div className="w-7 h-7 rounded-full bg-[#dbb42b] flex items-center justify-center">
                                    <span className="text-[#140759] font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="font-['Inter'] font-semibold text-sm text-white">{user.name}</span>
                            </Link>
                            <button onClick={() => { localStorage.removeItem("mock_user"); setUser(null); }}
                                className="h-[48px] px-4 border border-white/30 rounded-lg text-white/70 text-sm hover:text-white transition-colors">
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="box-border px-6 h-[52px] flex items-center justify-center font-['Inter'] text-[18px] font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-[#274C78] transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 h-[48px] flex items-center justify-center font-['Inter'] text-[18px] font-semibold bg-[#DBB42B] rounded-lg shadow-lg hover:bg-yellow-500 transition-colors"
                            >
                                S&apos;inscrire
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Page hero content */}
            <div className="relative z-10 px-6 md:px-[100px] pt-10 pb-14">
                {/* Breadcrumb */}
                {breadcrumb && (
                    <div className="mb-4 font-['Inter'] text-[16px] text-[#dbeafe]">
                        {breadcrumb.map((crumb, i) => (
                            <span key={i}>
                                {i > 0 && <span className="mx-2 opacity-60">&gt;</span>}
                                {i < breadcrumb.length - 1 ? (
                                    <Link href={i === 0 ? "/" : "#"} className="hover:text-white transition-colors">{crumb}</Link>
                                ) : (
                                    <span>{crumb}</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="font-['Poppins'] font-bold text-[72px] leading-[84px] tracking-[-0.5px] max-w-[900px]">
                    {derivedTitle}
                </h1>

                {/* Subtitle */}
                {derivedSubtitle && (
                    <p className="mt-4 font-['Inter'] font-normal text-[24px] leading-[33px] text-[#dbeafe] max-w-[700px]">
                        {derivedSubtitle}
                    </p>
                )}

                {/* Optional CTAs */}
                {ctas && ctas.length > 0 && (
                    <div className="flex items-center gap-6 mt-8">
                        {ctas.map((cta) => (
                            <Link
                                key={cta.href}
                                href={cta.href}
                                className={
                                    cta.variant === "yellow"
                                        ? "w-[254px] h-[60px] bg-[#DBB42B] rounded-xl flex items-center justify-center font-['Inter'] font-bold text-[20px] text-[#1A3A6E] hover:bg-yellow-400 transition-colors"
                                        : "w-[236px] h-[64px] bg-[#01509D] border-2 border-[#A3CEF1] rounded-xl flex items-center justify-center font-['Inter'] font-bold text-[20px] text-white hover:bg-[#014080] transition-colors"
                                }
                            >
                                {cta.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
