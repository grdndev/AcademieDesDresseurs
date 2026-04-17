/** Card pour un atelier / coaching vidéo (thumbnail + LIVE badge + réserver) */

import Image from "next/image";
import { Clock } from "lucide-react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface Props {
    image: string;
    isLive?: boolean;
    date?: string;
    level: string;
    title: string;
    authorAvatar?: string;
    authorName: string;
    authorRole?: string;
    duration: string;
    price: number;
    href?: string;
    onReserve?: () => void;
}

export default function CourseCard({
    image, isLive, date, level, title,
    authorAvatar, authorName, authorRole,
    duration, price, href, onReserve,
}: Props) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-44">
                <Image src={image} alt={title} fill className="object-cover" unoptimized />
                {isLive && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        LIVE
                    </span>
                )}
                {date && (
                    <span className="absolute top-3 right-3 bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {date}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <Badge label={level} />
                <h3 className="font-['Inter'] font-bold text-[#140759] text-sm leading-snug">{title}</h3>

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

                {/* Footer row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1 text-xs text-[#808896]">
                        <Clock className="w-3.5 h-3.5" /> {duration}
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="font-['Poppins'] font-bold text-[#140759]">{price}€</span>
                        <Button variant="primary" size="sm" href={href} onClick={onReserve}>
                            Réserver
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
