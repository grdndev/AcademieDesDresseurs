/** Sidebar d'achat : prix barré, CTA, note sécurité, liste de features */

import { Lock, CheckCircle } from "lucide-react";
import Button from "./ui/Button";

interface Props {
    price: number;
    originalPrice?: number;
    ctaLabel?: string;
    onCta?: () => void;
    ctaHref?: string;
    disabled?: boolean;
    securityNote?: string;
    features?: string[];
}

export default function PriceCard({
    price,
    originalPrice,
    ctaLabel = "Acheter l'accès",
    onCta,
    ctaHref,
    disabled,
    securityNote = "Accès sécurisé – Lien envoyé par email",
    features = [],
}: Props) {
    return (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 space-y-5">
            {/* Prix */}
            <div className="flex items-baseline gap-3">
                <span className="font-['Poppins'] font-bold text-5xl text-[#140759]">{price}€</span>
                {originalPrice && (
                    <span className="text-[#9ca3af] line-through text-xl">{originalPrice}€</span>
                )}
            </div>

            {/* CTA */}
            <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={onCta}
                href={ctaHref}
                disabled={disabled}
            >
                {ctaLabel}
            </Button>

            {/* Note sécurité */}
            <p className="flex items-center justify-center gap-2 text-xs text-[#9ca3af]">
                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                {securityNote}
            </p>

            {/* Features */}
            {features.length > 0 && (
                <ul className="space-y-3 pt-2 border-t border-[#e5e7eb]">
                    {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-[#4b5563]">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
