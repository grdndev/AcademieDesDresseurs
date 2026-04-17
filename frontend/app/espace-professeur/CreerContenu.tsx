"use client";

import { useState } from "react";
import {
    GraduationCap, Users, BookMarked, Upload, Plus, Trash2, Edit2,
    GripVertical, CheckCircle, Eye, CreditCard, Star,
    Bold, Italic, Underline, Heading1, Heading2, Heading3,
    ImagePlus, Link, Quote, Code, Search, ShieldCheck, Rocket,
} from "lucide-react";

/* ─── Types ─── */
interface Lesson { id: number; title: string; duration: string }
interface Module { id: number; title: string; lessons: Lesson[] }

/* ─── Shared styles ─── */
const inputClass   = "w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] focus:ring-2 focus:ring-[#01509d]/10 transition-colors placeholder:text-[#9ca3af]";
const sectionTitle = "font-['Poppins'] font-bold text-base text-[#01509d] mb-5";
const labelClass   = "block text-xs font-semibold text-[#140759] mb-1.5";
const req          = <span className="text-red-500 ml-0.5">*</span>;

function SectionCard({ children }: { children: React.ReactNode }) {
    return <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">{children}</div>;
}

function UploadZone() {
    return (
        <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#01509d]/40 transition-colors bg-[#f9fafb]">
            <Upload className="w-8 h-8 text-[#808896]" />
            <p className="text-sm font-semibold text-[#140759]">Cliquez pour télécharger ou glissez votre image ici</p>
            <p className="text-xs text-[#808896]">PNG, JPG jusqu&apos;à 5MB</p>
        </div>
    );
}

const CONTENT_TYPES = [
    { id: "cours"    as const, label: "Cours",               icon: GraduationCap },
    { id: "coaching" as const, label: "Coaching Individuel", icon: Users },
    { id: "guide"    as const, label: "Guide",               icon: BookMarked },
];

const COACHING_TYPES = [
    { id: "individuel", icon: Users,      iconColor: "text-[#01509d]",  iconBg: "bg-[#eef5fb]", title: "Coaching individuel", desc: "Session personnalisée 1-1 avec un élève" },
    { id: "deck",       icon: CreditCard, iconColor: "text-purple-600", iconBg: "bg-purple-50",  title: "Deck Building",       desc: "Aide à la création et optimisation de deck" },
    { id: "tournoi",    icon: Star,       iconColor: "text-yellow-600", iconBg: "bg-yellow-50",  title: "Préparation tournoi", desc: "Stratégie, analyse et entraînement compétitif" },
];

const TOOLBAR_GROUPS = [
    [
        { icon: Bold,      label: "Gras" },
        { icon: Italic,    label: "Italique" },
        { icon: Underline, label: "Souligné" },
    ],
    [
        { icon: Heading1, label: "Titre 1" },
        { icon: Heading2, label: "Titre 2" },
        { icon: Heading3, label: "Titre 3" },
    ],
    [
        { icon: ImagePlus, label: "Image" },
        { icon: Link,      label: "Lien" },
        { icon: Quote,     label: "Citation" },
        { icon: Code,      label: "Code" },
    ],
];

const ETAPES_SOUMISSION = [
    { icon: Search,     step: "1", title: "Vérification du contenu",    desc: "Notre équipe examine la qualité et la cohérence de votre contenu sous 48h ouvrées." },
    { icon: ShieldCheck,step: "2", title: "Validation pédagogique",     desc: "Nos directeurs pédagogiques valident l'approche et la structure de votre formation." },
    { icon: Rocket,     step: "3", title: "Publication",                desc: "Votre contenu sera mis en ligne et visible par tous les joueurs de l'Académie." },
];

const TYPE_LABELS: Record<string, string> = { cours: "Cours", coaching: "Coaching Individuel", guide: "Guide" };

/* ─── Main component ─── */
export default function CreerContenu({ setTab }: { setTab?: (t: string) => void }) {
    const [contentType,  setContentType]  = useState<"cours" | "coaching" | "guide">("cours");
    const [coachingType, setCoachingType] = useState("individuel");
    const [title,        setTitle]        = useState("");
    const [submitted,    setSubmitted]    = useState(false);
    const [modules, setModules] = useState<Module[]>([
        { id: 1, title: "Introduction au TCG Pokémon", lessons: [
            { id: 1, title: "Les bases du jeu",     duration: "15 min" },
            { id: 2, title: "Comprendre les types", duration: "20 min" },
        ]},
        { id: 2, title: "Analyse du métagame", lessons: [] },
    ]);

    function addModule() {
        setModules(p => [...p, { id: Date.now(), title: "Nouveau module", lessons: [] }]);
    }
    function removeModule(id: number) {
        setModules(p => p.filter(m => m.id !== id));
    }
    function updateModuleTitle(id: number, t: string) {
        setModules(p => p.map(m => m.id === id ? { ...m, title: t } : m));
    }
    function addLesson(moduleId: number) {
        setModules(p => p.map(m => m.id === moduleId
            ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: "Nouvelle leçon", duration: "15 min" }] }
            : m));
    }
    function removeLesson(moduleId: number, lessonId: number) {
        setModules(p => p.map(m => m.id === moduleId
            ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
            : m));
    }

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalMins    = modules.reduce((acc, m) =>
        acc + m.lessons.reduce((a, l) => { const n = parseInt(l.duration); return a + (isNaN(n) ? 0 : n); }, 0), 0);

    /* ── Submission success screen ── */
    if (submitted) {
        return (
            <div className="space-y-6 max-w-[640px] mx-auto py-6">

                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="font-['Poppins'] font-bold text-2xl text-[#140759] mb-2">Contenu soumis avec succès</h1>
                    <p className="text-sm text-[#808896]">Votre contenu a été envoyé à notre équipe pour validation.</p>
                </div>

                {/* Prochaines étapes */}
                <SectionCard>
                    <h3 className={sectionTitle}>Prochaines étapes</h3>
                    <div className="space-y-5">
                        {ETAPES_SOUMISSION.map(({ icon: Icon, step, title: t, desc }) => (
                            <div key={step} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#eef5fb] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-[#01509d]" />
                                </div>
                                <div>
                                    <p className="font-['Inter'] font-semibold text-sm text-[#140759] mb-0.5">{t}</p>
                                    <p className="text-xs text-[#808896] leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Récapitulatif */}
                <SectionCard>
                    <h3 className={sectionTitle}>Récapitulatif du contenu</h3>
                    <div className="space-y-1">
                        {[
                            { label: "Titre",        value: title || "Sans titre" },
                            { label: "Type",         value: TYPE_LABELS[contentType] },
                            ...(contentType !== "guide" ? [
                                { label: "Modules",  value: String(modules.length) },
                                { label: "Leçons",   value: String(totalLessons) },
                                { label: "Durée",    value: `${totalMins} min` },
                            ] : []),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between py-2.5 border-b border-[#f3f4f6] last:border-0 text-sm">
                                <span className="text-[#808896]">{label}</span>
                                <span className="font-semibold text-[#140759]">{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="text-[#808896]">Statut</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-50 text-yellow-700 font-semibold text-xs rounded-full border border-yellow-200">
                                En cours de vérification
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* CTA */}
                <button
                    onClick={() => setTab?.("dashboard")}
                    className="w-full h-12 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors"
                >
                    Retour au tableau de bord
                </button>

            </div>
        );
    }

    /* ── Creation form ── */
    return (
        <div className="space-y-6">

            {/* ── Type de contenu ── */}
            <SectionCard>
                <h3 className={sectionTitle}>Type de contenu</h3>
                <div className="grid grid-cols-3 gap-3">
                    {CONTENT_TYPES.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setContentType(id)}
                            className={`flex items-center justify-center gap-2 h-11 rounded-xl border-2 font-['Inter'] font-semibold text-sm transition-colors ${contentType === id ? "border-[#01509d] bg-[#eef5fb] text-[#01509d]" : "border-[#e5e7eb] text-[#808896] hover:border-[#01509d]/40 hover:text-[#140759]"}`}>
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* ── Informations générales ── */}
            <SectionCard>
                <h3 className={sectionTitle}>Informations générales</h3>
                <div className="space-y-5">

                    <div>
                        <label className={labelClass}>
                            {contentType === "guide" ? "Titre du guide" : "Titre de la formation"} {req}
                        </label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder={contentType === "guide" ? "Ex: Maîtrise du métagame compétitif" : "Ex: Maîtriser le métagame compétitif"}
                            className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Description {req}</label>
                        <textarea rows={4} placeholder="Décrivez votre formation et ses objectifs..."
                            className={`${inputClass} resize-none`} />
                    </div>

                    {contentType === "guide" ? (
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Niveau</label>
                                <select className={`${inputClass} cursor-pointer`}>
                                    {["Débutant", "Intermédiaire", "Compétitif"].map(n => <option key={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Catégorie</label>
                                <select className={`${inputClass} cursor-pointer`}>
                                    {["Analyse méta", "Construction de deck", "Stratégie", "Règles du jeu"].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Temps de lecture estimé (minutes)</label>
                                <input type="number" placeholder="15" className={inputClass} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Niveau</label>
                                <select className={`${inputClass} cursor-pointer`}>
                                    {["Débutant", "Intermédiaire", "Compétitif"].map(n => <option key={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Prix (€) {req}</label>
                                <input type="number" placeholder="29" className={inputClass} />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Image de couverture {req}</label>
                        <UploadZone />
                    </div>
                </div>
            </SectionCard>

            {/* ── Coaching: type selector ── */}
            {contentType === "coaching" && (
                <SectionCard>
                    <h3 className={sectionTitle}>Choisissez le type de coaching</h3>
                    <p className="text-xs text-[#808896] -mt-3 mb-4">Définissez le format de votre accompagnement</p>

                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#fef3c7] border border-yellow-300 rounded-xl text-xs text-[#92400e] mb-4">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                        <span><strong>Recommandé —</strong> Le coaching le plus populaire ·{" "}
                            <span className="underline cursor-pointer">Pourquoi lequel ?</span>
                        </span>
                    </div>

                    <div className="space-y-3">
                        {COACHING_TYPES.map(({ id, icon: Icon, iconColor, iconBg, title: t, desc }) => (
                            <button key={id} onClick={() => setCoachingType(id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${coachingType === id ? "border-[#01509d] bg-[#eef5fb]" : "border-[#e5e7eb] hover:border-[#01509d]/40"}`}>
                                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div>
                                    <p className="font-['Inter'] font-semibold text-sm text-[#140759]">{t}</p>
                                    <p className="text-xs text-[#808896]">{desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Cours + Coaching: Modules ── */}
            {contentType !== "guide" && (
                <SectionCard>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className={`${sectionTitle} mb-0`}>Modules de la formation</h3>
                        <button onClick={addModule}
                            className="flex items-center gap-1.5 h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Ajouter un module
                        </button>
                    </div>

                    <div className="space-y-4">
                        {modules.map((mod, idx) => (
                            <div key={mod.id} className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                                <div className="flex items-center gap-3 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                                    <GripVertical className="w-4 h-4 text-[#808896] cursor-grab flex-shrink-0" />
                                    <div className="w-6 h-6 rounded-full bg-[#01509d] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <input type="text" value={mod.title}
                                        onChange={e => updateModuleTitle(mod.id, e.target.value)}
                                        className="flex-1 text-sm font-semibold text-[#140759] bg-transparent outline-none border-b border-transparent focus:border-[#01509d]" />
                                    <button onClick={() => removeModule(mod.id)}
                                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0">
                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                </div>

                                <div className="px-4 py-2">
                                    {mod.lessons.map(lesson => (
                                        <div key={lesson.id} className="flex items-center gap-3 py-2.5 border-b border-[#f3f4f6] last:border-0">
                                            <div className="w-5 h-5 rounded-full bg-[#01509d] flex items-center justify-center flex-shrink-0">
                                                <span className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                            <span className="flex-1 text-sm text-[#140759]">{lesson.title}</span>
                                            <span className="text-xs text-[#808896]">{lesson.duration}</span>
                                            <div className="flex items-center gap-1">
                                                <button className="w-6 h-6 rounded hover:bg-[#eef5fb] flex items-center justify-center transition-colors">
                                                    <Edit2 className="w-3 h-3 text-[#01509d]" />
                                                </button>
                                                <button onClick={() => removeLesson(mod.id, lesson.id)}
                                                    className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center transition-colors">
                                                    <Trash2 className="w-3 h-3 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addLesson(mod.id)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#01509d] font-semibold hover:bg-[#f9fafb] rounded-lg transition-colors mt-1">
                                        <Plus className="w-3.5 h-3.5" /> Ajouter une leçon
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Guide: rich text editor ── */}
            {contentType === "guide" && (
                <SectionCard>
                    <h3 className={sectionTitle}>Contenu du guide</h3>

                    <div className="flex items-center gap-1 p-2 border border-[#e5e7eb] rounded-t-xl bg-[#f9fafb] flex-wrap">
                        {TOOLBAR_GROUPS.map((group, gi) => (
                            <span key={gi} className="flex items-center gap-1">
                                {gi > 0 && <span className="w-px h-5 bg-[#e5e7eb] mx-0.5" />}
                                {group.map(({ icon: Icon, label }) => (
                                    <button key={label} title={label}
                                        className="w-8 h-8 rounded-lg hover:bg-[#e5e7eb] flex items-center justify-center transition-colors text-[#140759]">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </span>
                        ))}
                    </div>

                    <textarea rows={12}
                        placeholder="Commencez à écrire votre guide ici... Vous pouvez structurer votre contenu avec des titres, listes, images et éléments didactiques."
                        className="w-full px-4 py-3 text-sm text-[#140759] border border-t-0 border-[#e5e7eb] rounded-b-xl bg-white outline-none focus:border-[#01509d] transition-colors placeholder:text-[#9ca3af] resize-none" />

                    <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Enregistrement automatique activé</span>
                    </div>
                </SectionCard>
            )}

            {/* ── Cours + Coaching: Objectifs & Aperçu side-by-side ── */}
            {contentType !== "guide" && (
                <div className="grid sm:grid-cols-2 gap-6">
                    <SectionCard>
                        <h3 className={sectionTitle}>Objectifs d&apos;apprentissage</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Objectifs de la formation</label>
                                <textarea rows={4} placeholder="Listez les objectifs principaux..."
                                    className={`${inputClass} resize-none`} />
                            </div>
                            <div>
                                <label className={labelClass}>Compétences acquises</label>
                                <textarea rows={4} placeholder="Quelles compétences vos élèves développeront-ils ?"
                                    className={`${inputClass} resize-none`} />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <h3 className={sectionTitle}>Aperçu de la formation</h3>
                        <div className="space-y-1">
                            {[
                                { label: "Modules",      value: String(modules.length) },
                                { label: "Leçons",       value: String(totalLessons) },
                                { label: "Durée totale", value: `${totalMins} min` },
                                { label: "Statut",       value: "brouillon" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between py-2.5 border-b border-[#f3f4f6] last:border-0 text-sm">
                                    <span className="text-[#808896]">{label}</span>
                                    <span className="font-semibold text-[#140759]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* ── Guide: Aperçu ── */}
            {contentType === "guide" && (
                <SectionCard>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className={`${sectionTitle} mb-1`}>Aperçu</h3>
                            <p className="text-xs text-[#808896]">
                                Visualisez comment votre guide apparaît sur la plateforme avant de le publier.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 h-10 px-5 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0">
                            <Eye className="w-4 h-4" /> Aperçu du guide
                        </button>
                    </div>
                </SectionCard>
            )}

            {/* ── Footer ── */}
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Brouillon enregistré automatiquement</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 h-10 px-5 border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                        Enregistrer brouillon
                    </button>
                    <button
                        onClick={() => setSubmitted(true)}
                        className="flex items-center gap-2 h-10 px-5 bg-green-500 hover:bg-green-600 text-white font-['Inter'] font-bold text-sm rounded-xl transition-colors">
                        <CheckCircle className="w-4 h-4" /> Soumettre pour validation
                    </button>
                </div>
            </div>

        </div>
    );
}
