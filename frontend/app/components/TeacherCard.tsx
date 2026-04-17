/** Bloc "Votre professeur" : avatar, nom, badge vérifié, bio, tags, lien cours */

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Button from "./ui/Button";

interface Props {
    name: string;
    avatar?: string;
    verified?: boolean;
    bio: string;
    tags?: string[];
    coursesHref?: string;
}

export default function TeacherCard({ name, avatar, verified = false, bio, tags = [], coursesHref }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="font-['Inter'] font-bold text-lg text-[#140759] mb-4">Votre professeur</h2>

            <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden">
                    {avatar && (
                        <Image src={avatar} alt={name} width={80} height={80} className="object-cover w-full h-full" unoptimized />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-['Inter'] font-bold text-[#140759]">{name}</p>
                    {verified && (
                        <p className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Professeur vérifié
                        </p>
                    )}
                    <p className="text-sm text-[#4b5563] leading-relaxed mt-2">{bio}</p>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
                    {tags.map((t) => (
                        <span key={t} className="text-xs font-semibold text-[#01509d]">{t}</span>
                    ))}
                </div>
            )}

            {coursesHref && (
                <div className="mt-4">
                    <Button variant="outline" size="sm" href={coursesHref}>Voir tous ses cours</Button>
                </div>
            )}
        </div>
    );
}
