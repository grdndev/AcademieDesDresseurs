import Navbar from "../components/Navbar";

export default function SEquiperLayout({ children }: { children: React.ReactNode }) {
    // Real Pokémon TCG type symbol shapes at r≈35, on 400×320 tile
    // Using base64-encoded SVG for reliable CSS background rendering
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320">
  <g transform="translate(68,80)">
    <path d="M 0,35 C -22,20 -23,-1 -14,-16 C -7,-26 0,-20 0,-20 C 0,-35 11,-28 13,-16 C 20,-4 15,20 0,35 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
  <g transform="translate(200,65)">
    <path d="M 14,-35 L -10,4 L 8,4 L -14,35 L 30,4 L 12,4 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
  <g transform="translate(335,80)">
    <path d="M 0,35 C -24,18 -24,-9 -12,-21 L 0,-36 L 12,-21 C 24,-9 24,18 0,35 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
  <g transform="translate(68,240)">
    <path d="M -6,-35 A 35,35,0,1,1,-6,35 A 23,23,0,1,0,-6,-35 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
  <g transform="translate(200,250)">
    <path d="M 0,-35 L 8,-8 L 35,0 L 8,8 L 0,35 L -8,8 L -35,0 L -8,-8 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
  <g transform="translate(335,242)">
    <path d="M 0,-35 L 9,-16 L 30,-19 L 17,0 L 30,19 L 9,16 L 0,35 L -9,16 L -30,19 L -17,0 L -30,-19 L -9,-16 Z" fill="#D1D5DB" opacity="0.55" fill-rule="evenodd"/>
  </g>
</svg>`;

    const b64 = Buffer.from(svgContent).toString("base64");
    const uri = `url("data:image/svg+xml;base64,${b64}")`;

    return (
        <div data-theme="sequiper">
            <style>{`
                [data-theme="sequiper"] .min-h-screen {
                    background-image: ${uri} !important;
                    background-size: 400px 320px !important;
                }
            `}</style>
            <Navbar />
            {children}
        </div>
    );
}
