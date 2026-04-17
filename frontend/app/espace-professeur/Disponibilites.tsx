"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

type SlotType = "disponible" | "reserve" | "bloque" | "pause";

interface Slot {
    day: number;      // 0=Lun … 6=Dim
    hour: number;     // 8, 9, 10 …
    type: SlotType;
    timeRange: string;
    name?: string;
}

const DAYS  = ["Lun 16", "Mar 17", "Mer 18", "Jeu 19", "Ven 20", "Sam 21", "Dim 22"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15];

const SLOTS: Slot[] = [
    { day: 0, hour: 10, type: "disponible", timeRange: "10:00 - 11:00" },
    { day: 0, hour: 14, type: "disponible", timeRange: "14:00 - 15:00" },
    { day: 1, hour: 11, type: "reserve",    timeRange: "11:00 - 12:00", name: "Thomas E." },
    { day: 1, hour: 14, type: "disponible", timeRange: "14:00 - 15:00" },
    { day: 2, hour: 11, type: "disponible", timeRange: "11:00 - 12:00" },
    { day: 2, hour: 14, type: "pause",      timeRange: "14:00 - 15:00", name: "Pause" },
    { day: 3, hour: 8,  type: "disponible", timeRange: "08:00 - 10:00" },
    { day: 3, hour: 10, type: "bloque",     timeRange: "10:00 - 11:00", name: "Thomas E." },
    { day: 3, hour: 14, type: "disponible", timeRange: "14:00 - 15:00" },
    { day: 4, hour: 8,  type: "reserve",    timeRange: "08:00 - 09:00", name: "Louise M." },
    { day: 4, hour: 11, type: "disponible", timeRange: "11:00 - 12:00" },
    { day: 5, hour: 10, type: "disponible", timeRange: "10:00 - 11:00" },
    { day: 5, hour: 11, type: "disponible", timeRange: "11:00 - 12:00" },
    { day: 5, hour: 14, type: "disponible", timeRange: "14:00 - 15:00" },
];

const SLOT_STYLE: Record<SlotType, string> = {
    disponible: "bg-green-100 border border-green-200 text-green-700",
    reserve:    "bg-orange-100 border border-orange-200 text-orange-700",
    bloque:     "bg-red-100 border border-red-200 text-red-600",
    pause:      "bg-red-50 border border-red-200 text-red-400",
};

const SLOT_LABEL: Record<SlotType, string> = {
    disponible: "Disponible",
    reserve:    "Réservé",
    bloque:     "Bloqué",
    pause:      "Pause",
};

function slotAt(day: number, hour: number): Slot | undefined {
    return SLOTS.find(s => s.day === day && s.hour === hour);
}

export default function Disponibilites() {
    const [month] = useState("Décembre 2024");

    return (
        <div className="space-y-6">

            {/* ── Calendar card ── */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">

                {/* Month header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-4 h-4 text-[#808896]" />
                        </button>
                        <span className="font-['Poppins'] font-bold text-sm text-[#140759]">{month}</span>
                        <button className="w-8 h-8 rounded-lg border border-[#e5e7eb] flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-4 h-4 text-[#808896]" />
                        </button>
                    </div>
                    <button className="flex items-center gap-1.5 h-9 px-4 bg-[#01509d] hover:bg-[#014080] text-white font-['Inter'] font-bold text-xs rounded-xl transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-xs">

                        {/* Day headers */}
                        <thead>
                            <tr className="border-b border-[#e5e7eb]">
                                <th className="w-16 py-3 text-[#808896] font-medium text-center" />
                                {DAYS.map(d => (
                                    <th key={d} className="py-3 text-[#808896] font-semibold text-center">{d}</th>
                                ))}
                            </tr>
                        </thead>

                        {/* Time rows */}
                        <tbody>
                            {HOURS.map(hour => (
                                <tr key={hour} className="border-b border-[#f3f4f6] last:border-0">
                                    <td className="py-3 pr-3 text-right text-[#808896] font-medium align-top pt-3">
                                        {String(hour).padStart(2, "0")}:00
                                    </td>
                                    {DAYS.map((_, di) => {
                                        const slot = slotAt(di, hour);
                                        return (
                                            <td key={di} className="py-1.5 px-1 align-top">
                                                {slot && (
                                                    <div className={`rounded-lg px-2 py-1.5 cursor-pointer hover:opacity-90 transition-opacity ${SLOT_STYLE[slot.type]}`}>
                                                        <p className="font-semibold leading-tight">{SLOT_LABEL[slot.type]}</p>
                                                        <p className="opacity-75 mt-0.5 leading-tight">{slot.timeRange}</p>
                                                        {slot.name && <p className="font-medium mt-0.5 leading-tight">{slot.name}</p>}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Paramètres rapides ── */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="font-['Poppins'] font-bold text-sm text-[#140759] mb-4">Paramètres rapides</h3>
                <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-[#140759] mb-1.5">Durée par défaut</label>
                        <select className="w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                            {["30 minutes", "1 heure", "1h30", "2 heures"].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#140759] mb-1.5">Pause entre sessions</label>
                        <select className="w-full px-4 py-2.5 text-sm text-[#140759] border border-[#e5e7eb] rounded-xl bg-white outline-none focus:border-[#01509d] cursor-pointer">
                            {["5 minutes", "10 minutes", "15 minutes", "30 minutes"].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#140759] mb-1.5">Disponibilités récurrentes</label>
                        <button className="w-full h-[42px] border border-[#e5e7eb] text-[#140759] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                            Configurer
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
