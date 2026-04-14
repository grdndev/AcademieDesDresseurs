import { ChevronLeft, PlayCircle, Lock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
    const course = {
        title: "Les bases du JCC Pokémon",
        author: "Tonio",
        authorImageUrl: "/res/avatar1.png",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Ce cours complet vous guidera à travers toutes les règles fondamentales du Jeu de Cartes à Collectionner Pokémon. De la construction de votre premier deck aux stratégies de base, vous aurez toutes les clés pour bien démarrer.",
        modules: [
            { title: "Introduction au JCC", duration: "15 min", isCompleted: true, isLocked: false },
            { title: "Les types de cartes", duration: "25 min", isCompleted: true, isLocked: false },
            { title: "Construire son premier deck", duration: "45 min", isCompleted: false, isLocked: false },
            { title: "Le déroulement d'un tour", duration: "30 min", isCompleted: false, isLocked: false },
            { title: "Les conditions spéciales", duration: "20 min", isCompleted: false, isLocked: true },
            { title: "Stratégies avancées", duration: "50 min", isCompleted: false, isLocked: true },
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Link href="/apprendre" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-8">
                    <ChevronLeft className="w-5 h-5" />
                    Retour aux formations
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={course.videoUrl}
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h1 className="text-4xl font-bold text-[#1A3A6E] font-['Poppins'] mb-4">{course.title}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <Image src={course.authorImageUrl} alt={course.author} width={48} height={48} className="rounded-full" />
                            <span className="font-semibold text-lg text-gray-800">Par {course.author}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    </div>

                    {/* Sidebar with modules */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
                        <h2 className="text-2xl font-bold text-[#1A3A6E] font-['Poppins'] mb-6">Contenu du cours</h2>
                        <ul className="space-y-3">
                            {course.modules.map((module, index) => (
                                <li key={index} className={`p-4 rounded-lg flex items-center justify-between transition-colors ${module.isLocked ? 'bg-gray-100' : 'bg-blue-50 hover:bg-blue-100 cursor-pointer'}`}>
                                    <div className="flex items-center gap-4">
                                        {module.isLocked ? <Lock className="w-6 h-6 text-gray-400" /> : <PlayCircle className="w-6 h-6 text-blue-600" />}
                                        <div>
                                            <p className={`font-semibold ${module.isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{module.title}</p>
                                            <span className="text-sm text-gray-500">{module.duration}</span>
                                        </div>
                                    </div>
                                    {module.isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
