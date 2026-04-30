/** Card pour un guide / cours textuel (gradient coloré ou image + étoiles + "Lire le guide") */

import Image from "next/image";
import { Clock, Star } from "lucide-react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const GRADIENTS = [
    "from-pink-400 to-purple-500",
    "from-orange-400 to-red-500",
    "from-green-400 to-teal-500",
    "from-blue-400 to-indigo-500",
];

interface Props {
    image?: string;
    /** Index dans GRADIENTS quand pas d'image */
    gradientIndex?: number;
    level: string;
    title: string;
    description?: string;
    authorAvatar?: string;
    authorName: string;
    authorRole?: string;
    duration?: string;
    rating?: number;
    views?: number;
    price: number;
    href?: string;
    ctaLabel?: string;
}

export default function GuideCard({
    image, gradientIndex = 0, level, title, description,
    authorAvatar, authorName, authorRole,
    duration, rating, views, price, href, ctaLabel = "Lire le guide ->",
}: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Image / Gradient header */}
            <div className="relative h-36">
                {image ? (
                    <Image src={image} alt={title} fill className="object-cover" unoptimized />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[gradientIndex % GRADIENTS.length]}`} />
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 space-y-2">
                <Badge label={level} />
                <h3 className="font-['Inter'] font-bold text-[#140759] text-sm leading-snug">{title}</h3>
                {description && (
                    <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">{description}</p>
                )}

                {/* Author */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {authorAvatar && (
                            <Image src={authorAvatar} alt={authorName} width={28} height={28} unoptimized />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-700">{authorName}</p>
                        {authorRole && <p className="text-xs text-[#808896]">{authorRole}</p>}
                    </div>
                </div>

                {/* Rating + duration */}
                {(rating || duration) && (
                    <div className="flex items-center gap-3 text-xs text-[#808896]">
                        {rating && (
                            <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {rating}{views ? ` • ${views} vues` : ""}
                            </span>
                        )}
                        {duration && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {duration}
                            </span>
                        )}
                    </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="font-['Poppins'] font-bold text-[#140759] text-lg">{price}€</span>
                    <Button variant="ghost" size="sm" href={href}>{ctaLabel}</Button>
                </div>
            </div>
        </div>
    );
}
