/** Badges réutilisables. Le label sert de clé pour choisir le style.
 *  Pour un label non reconnu, le badge sera gris neutre. */

const PRESETS: Record<string, string> = {
    // Niveaux
    "Débutant":      "bg-green-50 text-green-700",
    "Intermédiaire": "bg-orange-50 text-orange-600",
    "Avancé":        "bg-blue-50 text-[#01509d]",
    // Formats deck
    "Méta":          "bg-[#01509d] text-white",
    "Standard":      "bg-[#dbb42b] text-[#1a3a6e]",
    "Courant":       "bg-green-600 text-white",
    // Statuts
    "LIVE":          "bg-red-500 text-white",
    "En stock":      "bg-green-50 text-green-700",
    "Rupture":       "bg-red-50 text-red-600",
    "Stock limité":  "bg-orange-50 text-orange-600",
};

interface Props {
    label: string;
    /** Remplace entièrement les classes de couleur */
    colorClass?: string;
    className?: string;
}

export default function Badge({ label, colorClass, className = "" }: Props) {
    const colors = colorClass ?? PRESETS[label] ?? "bg-gray-100 text-gray-600";
    return (
        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${colors} ${className}`}>
            {label}
        </span>
    );
}
