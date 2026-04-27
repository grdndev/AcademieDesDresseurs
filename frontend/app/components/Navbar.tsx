"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ─── Theme patterns ─── */

type Theme = "dots" | "geometric" | "energy" | "none";

function getTheme(pathname: string): Theme {
    if (pathname.startsWith("/apprendre")) return "dots";
    if (pathname.startsWith("/progresser")) return "geometric";
    if (pathname.startsWith("/sequiper")) return "energy";
    return "none";
}

function DotsPattern() {
    // CSS radial-gradient grid — same technique as the body pattern, white dots on blue
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1.2px, transparent 1.2px)",
                backgroundSize: "20px 20px",
            }}
            aria-hidden
        />
    );
}

function GeometricPattern() {
    // ~70 shapes; viewBox 1440×400; shapes ≤8px; ~180px column spacing
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {/* ── Losange outline ~8px ── */}
            <polygon points="44,46 48,40 52,46 48,52"     fill="none" stroke="white" strokeWidth="0.9" opacity="0.22"/>
            <polygon points="224,136 228,130 232,136 228,142" fill="none" stroke="white" strokeWidth="0.9" opacity="0.18"/>
            <polygon points="404,56 408,50 412,56 408,62"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.20"/>
            <polygon points="584,246 588,240 592,246 588,252" fill="none" stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <polygon points="764,106 768,100 772,106 768,112" fill="none" stroke="white" strokeWidth="0.9" opacity="0.19"/>
            <polygon points="944,316 948,310 952,316 948,322" fill="none" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            <polygon points="1124,76 1128,70 1132,76 1128,82" fill="none" stroke="white" strokeWidth="0.9" opacity="0.18"/>
            <polygon points="1304,196 1308,190 1312,196 1308,202" fill="none" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            {/* ── Triangle rempli ~8px ── */}
            <polygon points="136,34 132,42 140,42"        fill="white" opacity="0.18"/>
            <polygon points="316,284 312,292 320,292"     fill="white" opacity="0.16"/>
            <polygon points="496,124 492,132 500,132"     fill="white" opacity="0.17"/>
            <polygon points="676,344 672,352 680,352"     fill="white" opacity="0.14"/>
            <polygon points="856,54 852,62 860,62"        fill="white" opacity="0.16"/>
            <polygon points="1036,214 1032,222 1040,222"  fill="white" opacity="0.15"/>
            <polygon points="1216,104 1212,112 1220,112"  fill="white" opacity="0.13"/>
            <polygon points="1396,274 1392,282 1400,282"  fill="white" opacity="0.14"/>
            {/* ── Rectangle outline rotated ~10×5 ── */}
            <rect x="82"   y="153" width="10" height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.19" transform="rotate(14 87 156)"/>
            <rect x="262"  y="63"  width="9"  height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.17" transform="rotate(-9 267 66)"/>
            <rect x="442"  y="233" width="10" height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.18" transform="rotate(18 447 236)"/>
            <rect x="622"  y="143" width="9"  height="4" fill="none" stroke="white" strokeWidth="0.9" opacity="0.15" transform="rotate(-12 627 145)"/>
            <rect x="802"  y="313" width="10" height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.16" transform="rotate(10 807 316)"/>
            <rect x="982"  y="83"  width="9"  height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.14" transform="rotate(-15 987 86)"/>
            <rect x="1162" y="253" width="10" height="5" fill="none" stroke="white" strokeWidth="0.9" opacity="0.15" transform="rotate(8 1167 256)"/>
            <rect x="1342" y="133" width="9"  height="4" fill="none" stroke="white" strokeWidth="0.9" opacity="0.13" transform="rotate(-10 1347 135)"/>
            {/* ── Carré rempli 4×4px ── */}
            <rect x="170" y="196" width="4" height="4" fill="white" opacity="0.18"/>
            <rect x="350" y="106" width="4" height="4" fill="white" opacity="0.16"/>
            <rect x="530" y="366" width="4" height="4" fill="white" opacity="0.15"/>
            <rect x="710" y="166" width="4" height="4" fill="white" opacity="0.17"/>
            <rect x="890" y="256" width="4" height="4" fill="white" opacity="0.14"/>
            <rect x="1070" y="46"  width="4" height="4" fill="white" opacity="0.16"/>
            <rect x="1250" y="336" width="4" height="4" fill="white" opacity="0.13"/>
            <rect x="1430" y="206" width="4" height="4" fill="white" opacity="0.14"/>
            {/* ── Cercle rempli r=2 ── */}
            <circle cx="100"  cy="276" r="2" fill="white" opacity="0.18"/>
            <circle cx="280"  cy="46"  r="2" fill="white" opacity="0.16"/>
            <circle cx="460"  cy="176" r="2" fill="white" opacity="0.17"/>
            <circle cx="640"  cy="356" r="2" fill="white" opacity="0.15"/>
            <circle cx="820"  cy="136" r="2" fill="white" opacity="0.16"/>
            <circle cx="1000" cy="296" r="2" fill="white" opacity="0.14"/>
            <circle cx="1180" cy="76"  r="2" fill="white" opacity="0.15"/>
            <circle cx="1360" cy="236" r="2" fill="white" opacity="0.13"/>
            {/* ── Hexagone outline ~10px ── */}
            <polygon points="190,116 193,111 196,116 196,121 193,126 190,121"       fill="none" stroke="white" strokeWidth="0.9" opacity="0.19"/>
            <polygon points="370,226 373,221 376,226 376,231 373,236 370,231"       fill="none" stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <polygon points="550,76 553,71 556,76 556,81 553,86 550,81"             fill="none" stroke="white" strokeWidth="0.9" opacity="0.18"/>
            <polygon points="730,296 733,291 736,296 736,301 733,306 730,301"       fill="none" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <polygon points="910,176 913,171 916,176 916,181 913,186 910,181"       fill="none" stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <polygon points="1090,346 1093,341 1096,346 1096,351 1093,356 1090,351" fill="none" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            <polygon points="1270,56 1273,51 1276,56 1276,61 1273,66 1270,61"       fill="none" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            {/* ── Éclair ~15px tall ── */}
            <polygon points="60,174 57,181 60,181 55,189 65,182 62,182 65,174"   fill="white" opacity="0.17"/>
            <polygon points="240,314 237,321 240,321 235,329 245,322 242,322 245,314" fill="white" opacity="0.15"/>
            <polygon points="420,94 417,101 420,101 415,109 425,102 422,102 425,94" fill="white" opacity="0.16"/>
            <polygon points="600,264 597,271 600,271 595,279 605,272 602,272 605,264" fill="white" opacity="0.14"/>
            <polygon points="780,44 777,51 780,51 775,59 785,52 782,52 785,44"   fill="white" opacity="0.15"/>
            <polygon points="960,214 957,221 960,221 955,229 965,222 962,222 965,214" fill="white" opacity="0.13"/>
            <polygon points="1140,144 1137,151 1140,151 1135,159 1145,152 1142,152 1145,144" fill="white" opacity="0.14"/>
            <polygon points="1320,354 1317,361 1320,361 1315,369 1325,362 1322,362 1325,354" fill="white" opacity="0.12"/>
            {/* ── Demi-cercle r=6 ── */}
            <path d="M 25,236 A 6,6,0,0,1,37,236"   fill="none" stroke="white" strokeWidth="0.9" opacity="0.18"/>
            <path d="M 205,86 A 6,6,0,0,1,217,86"   fill="none" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            <path d="M 485,336 A 5,5,0,0,1,495,336" fill="none" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <path d="M 665,156 A 6,6,0,0,1,677,156" fill="none" stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <path d="M 845,376 A 5,5,0,0,1,855,376" fill="none" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            <path d="M 1025,116 A 6,6,0,0,1,1037,116" fill="none" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <path d="M 1205,286 A 5,5,0,0,1,1215,286" fill="none" stroke="white" strokeWidth="0.9" opacity="0.13"/>
            <path d="M 1385,46 A 6,6,0,0,1,1397,46"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            {/* ── Angle droit ~9px ── */}
            <path d="M 148,356 L 148,347 L 157,347"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.18"/>
            <path d="M 328,196 L 328,187 L 337,187"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            <path d="M 508,286 L 508,277 L 517,277"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <path d="M 688,46 L 688,37 L 697,37"     fill="none" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <path d="M 868,206 L 868,197 L 877,197"  fill="none" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            <path d="M 1048,376 L 1048,367 L 1057,367" fill="none" stroke="white" strokeWidth="0.9" opacity="0.13"/>
            <path d="M 1228,136 L 1228,127 L 1237,127" fill="none" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            <path d="M 1408,306 L 1408,297 L 1417,297" fill="none" stroke="white" strokeWidth="0.9" opacity="0.12"/>
            {/* ── Trait ~9px ── */}
            <line x1="116" y1="16"  x2="125" y2="16"  stroke="white" strokeWidth="0.9" opacity="0.17"/>
            <line x1="296" y1="166" x2="305" y2="170" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <line x1="476" y1="386" x2="485" y2="386" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            <line x1="656" y1="96"  x2="665" y2="100" stroke="white" strokeWidth="0.9" opacity="0.16"/>
            <line x1="836" y1="326" x2="845" y2="326" stroke="white" strokeWidth="0.9" opacity="0.14"/>
            <line x1="1016" y1="56"  x2="1025" y2="60" stroke="white" strokeWidth="0.9" opacity="0.15"/>
            <line x1="1196" y1="216" x2="1205" y2="216" stroke="white" strokeWidth="0.9" opacity="0.13"/>
            <line x1="1376" y1="376" x2="1385" y2="380" stroke="white" strokeWidth="0.9" opacity="0.12"/>
        </svg>
    );
}

function EnergyPattern() {
    // Real Pokémon TCG type symbol shapes — white, low opacity, pixel-sized (r≈26px)
    // viewBox 1440×400 so 1 unit = 1px
    // Scaled to r≈16px (down from r≈26) for subtle navbar overlay
    const symbols: { d: string; tx: number; ty: number }[] = [
        // Feu
        { d: "M 0,16 C -10,9 -11,-1 -6,-7 C -4,-12 0,-9 0,-9 C 0,-16 5,-14 6,-7 C 9,-2 7,9 0,16 Z", tx: 80,   ty: 90  },
        // Éclair
        { d: "M 6,-16 L -4,2 L 4,2 L -6,16 L 14,2 L 6,2 Z",                                         tx: 260,  ty: 60  },
        // Eau
        { d: "M 0,16 C -11,8 -11,-4 -6,-10 L 0,-16 L 6,-10 C 11,-4 11,8 0,16 Z",                    tx: 460,  ty: 100 },
        // Psy 4-star
        { d: "M 0,-16 L 4,-4 L 16,0 L 4,4 L 0,16 L -4,4 L -16,0 L -4,-4 Z",                         tx: 660,  ty: 70  },
        // Métal hexagon
        { d: "M 0,-16 L 8,-12 L 14,-6 L 16,0 L 14,6 L 8,12 L 0,16 L -8,12 L -14,6 L -16,0 L -14,-6 L -8,-12 Z", tx: 860, ty: 95 },
        // Ténèbre crescent
        { d: "M -3,-16 A 16,16,0,1,1,-3,16 A 10,10,0,1,0,-3,-16 Z",                                  tx: 1060, ty: 65  },
        // Fée 6-star
        { d: "M 0,-16 L 4,-7 L 14,-9 L 8,0 L 14,9 L 4,7 L 0,16 L -4,7 L -14,9 L -8,0 L -14,-9 L -4,-7 Z", tx: 1260, ty: 90 },
        // Normal ring
        { d: "M 0,-16 A 16,16,0,1,0,0,16 A 16,16,0,1,0,0,-16 Z M 0,-8 A 8,8,0,1,0,0,8 A 8,8,0,1,0,0,-8 Z", tx: 1410, ty: 70 },
        // Combat 8-star
        { d: "M 0,-16 L 3,-5 L 14,-11 L 6,-1 L 16,5 L 5,5 L 3,16 L 0,7 L -3,16 L -5,5 L -16,5 L -6,-1 L -14,-11 L -3,-5 Z", tx: 160, ty: 300 },
        // Feu 2nd
        { d: "M 0,16 C -10,9 -11,-1 -6,-7 C -4,-12 0,-9 0,-9 C 0,-16 5,-14 6,-7 C 9,-2 7,9 0,16 Z", tx: 380,  ty: 280 },
        // Eau 2nd
        { d: "M 0,16 C -11,8 -11,-4 -6,-10 L 0,-16 L 6,-10 C 11,-4 11,8 0,16 Z",                    tx: 580,  ty: 310 },
        // Psy 2nd
        { d: "M 0,-16 L 4,-4 L 16,0 L 4,4 L 0,16 L -4,4 L -16,0 L -4,-4 Z",                         tx: 780,  ty: 290 },
        // Ténèbre 2nd
        { d: "M -3,-16 A 16,16,0,1,1,-3,16 A 10,10,0,1,0,-3,-16 Z",                                  tx: 980,  ty: 320 },
        // Métal 2nd
        { d: "M 0,-16 L 8,-12 L 14,-6 L 16,0 L 14,6 L 8,12 L 0,16 L -8,12 L -14,6 L -16,0 L -14,-6 L -8,-12 Z", tx: 1180, ty: 290 },
        // Fée 2nd
        { d: "M 0,-16 L 4,-7 L 14,-9 L 8,0 L 14,9 L 4,7 L 0,16 L -4,7 L -14,9 L -8,0 L -14,-9 L -4,-7 Z", tx: 1380, ty: 310 },
    ];
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {symbols.map(({ d, tx, ty }, i) => (
                <path key={i} d={d} fill="white" fillOpacity="0.14" fillRule="evenodd"
                    transform={`translate(${tx},${ty})`} />
            ))}
        </svg>
    );
}

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
    "/professeur/avantages": {
        title: "Avantages Professeur",
        subtitle: "Tout ce que l'Académie offre à ses formateurs certifiés.",
        breadcrumb: ["Accueil", "Devenir Professeur", "Avantages"],
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
            { label: "Postuler maintenant", href: "/professeur/candidature", variant: "yellow" },
            { label: "En savoir plus", href: "/professeur/avantages", variant: "blue" },
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
                {/* Dot pattern overlay */}
                <DotsPattern />

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
                                className={`font-['Inter'] text-[22px] font-medium tracking-[-0.5px] transition-colors hover:text-white/80 ${isActiveLink(link.href) ? "font-semibold" : ""}`}
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
                        <span className="underline decoration-[#2563EB] decoration-[3px] underline-offset-[5px]">Coaching</span> et{" "}
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
    const theme = getTheme(pathname);
    const showVectors = theme !== "none" || pathname.startsWith("/professeur");

    return (
        <header className="relative w-full min-h-[450px] bg-[#6096BA] overflow-hidden text-white">
            {/* Decorative vectors — hidden for neutral pages */}
            {showVectors && <>
                <Image
                    width={872} height={711}
                    src={vector1Img} alt="" aria-hidden
                    className="absolute -top-2 -left-2 w-[240px] md:w-[360px] lg:w-[520px] h-auto opacity-55"
                    style={{ transform: "rotate(0.32deg)" }}
                    unoptimized priority
                />
                {/* Vector2: fills the full right side of the header */}
                <Image
                    width={873} height={969}
                    src={vector2Img} alt="" aria-hidden
                    className="hidden lg:block absolute top-0 right-0 h-full w-auto"
                    unoptimized priority
                />
                <Image
                    width={562} height={457}
                    src={attachmentImg} alt="" aria-hidden
                    className="hidden lg:block absolute top-10 right-8 w-[300px] lg:w-[480px] h-auto"
                    unoptimized priority
                />
            </>}

            {/* Theme pattern overlay */}
            {theme === "dots"       && <DotsPattern />}
            {theme === "geometric"  && <GeometricPattern />}
            {theme === "energy"     && <EnergyPattern />}

            {/* Navigation — same dimensions as home */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-[100px] h-[140px]">
                <Link href="/" className="flex-shrink-0">
                    <Image src={logoImg} alt="Académie des Dresseurs" width={84} height={81} className="rounded-lg" priority />
                </Link>
                <div className="hidden md:flex items-center gap-[37px]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`font-['Inter'] text-[20px] font-medium tracking-[-0.5px] transition-colors hover:text-white/80 ${isActiveLink(link.href) ? "font-semibold" : ""}`}
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
