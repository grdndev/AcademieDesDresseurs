"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    current: number;
    total: number;
    onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: Props) {
    if (total <= 1) return null;

    // Pages avec ellipsis si > 7 pages
    const pages: (number | "...")[] = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push("...");
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push("...");
        pages.push(total);
    }

    const arrowBtn = (disabled: boolean, onClick: () => void, icon: React.ReactNode) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-10 h-10 rounded-xl border border-[#e5e7eb] bg-white flex items-center justify-center text-gray-500 hover:border-[#01509d] hover:text-[#01509d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
            {icon}
        </button>
    );

    return (
        <div className="flex items-center gap-2">
            {arrowBtn(current === 1, () => onChange(current - 1), <ChevronLeft className="w-4 h-4" />)}

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p as number)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                            p === current
                                ? "bg-[#01509d] text-white border border-[#01509d]"
                                : "bg-white border border-[#e5e7eb] text-gray-600 hover:border-[#01509d] hover:text-[#01509d]"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            {arrowBtn(current === total, () => onChange(current + 1), <ChevronRight className="w-4 h-4" />)}
        </div>
    );
}
