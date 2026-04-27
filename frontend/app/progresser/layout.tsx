export default function ProgresserLayout({ children }: { children: React.ReactNode }) {
    // Tile 160×160 — 10 shape types matching the Navbar GeometricPattern
    // All in %2301509d (blue) very low opacity, outline/filled mix
    const shapes = [
        // Losange
        `<polygon points='14,18 18,10 22,18 18,26' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.16'/>`,
        `<polygon points='110,100 114,92 118,100 114,108' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.12'/>`,
        // Petit triangle rempli
        `<polygon points='140,12 136,22 144,22' fill='%2301509d' opacity='0.10'/>`,
        `<polygon points='56,136 52,146 60,146' fill='%2301509d' opacity='0.09'/>`,
        `<polygon points='8,80 4,90 12,90' fill='%2301509d' opacity='0.08'/>`,
        // Rectangle outline rotated
        `<rect x='64' y='14' width='22' height='12' rx='2' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.14' transform='rotate(10 75 20)'/>`,
        `<rect x='120' y='60' width='18' height='10' rx='2' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.11' transform='rotate(-7 129 65)'/>`,
        // Petit carré rempli
        `<rect x='30' y='52' width='6' height='6' fill='%2301509d' opacity='0.11'/>`,
        `<rect x='100' y='140' width='5' height='5' fill='%2301509d' opacity='0.09'/>`,
        `<rect x='148' y='80' width='6' height='6' fill='%2301509d' opacity='0.10'/>`,
        // Petit cercle rempli
        `<circle cx='70' cy='110' r='3.5' fill='%2301509d' opacity='0.11'/>`,
        `<circle cx='140' cy='148' r='3' fill='%2301509d' opacity='0.09'/>`,
        `<circle cx='18' cy='130' r='3' fill='%2301509d' opacity='0.08'/>`,
        // Hexagone outline
        `<polygon points='92,8 98,4 104,8 104,16 98,20 92,16' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.13'/>`,
        `<polygon points='40,86 46,82 52,86 52,94 46,98 40,94' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.10'/>`,
        // Éclair filled
        `<polygon points='76,42 72,52 76,52 70,64 82,52 78,52 82,42' fill='%2301509d' opacity='0.09'/>`,
        `<polygon points='130,100 126,110 130,110 124,122 136,110 132,110 136,100' fill='%2301509d' opacity='0.08'/>`,
        // Demi-cercle outline
        `<path d='M 6,60 A 14,14,0,0,1,34,60' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.12'/>`,
        `<path d='M 112,128 A 12,12,0,0,1,136,128' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.10'/>`,
        // Angle droit
        `<path d='M 8,38 L 8,28 L 18,28' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.13'/>`,
        `<path d='M 124,40 L 124,30 L 134,30' fill='none' stroke='%2301509d' stroke-width='1.2' opacity='0.10'/>`,
        // Petit trait
        `<line x1='48' y1='12' x2='58' y2='12' stroke='%2301509d' stroke-width='1.2' opacity='0.14'/>`,
        `<line x1='82' y1='130' x2='92' y2='133' stroke='%2301509d' stroke-width='1.2' opacity='0.11'/>`,
        `<line x1='150' y1='110' x2='158' y2='110' stroke='%2301509d' stroke-width='1.2' opacity='0.10'/>`,
    ].join(" ");

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>${shapes}</svg>`;
    const uri = `url("data:image/svg+xml,${svg.replace(/\n\s*/g, " ")}")`;

    return (
        <div data-theme="progresser">
            <style>{`
                [data-theme="progresser"] .min-h-screen {
                    background-image: ${uri} !important;
                    background-size: 160px 160px !important;
                }
            `}</style>
            {children}
        </div>
    );
}
