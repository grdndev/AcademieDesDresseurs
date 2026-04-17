import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "yellow" | "outline" | "green" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
    primary: "bg-[#01509d] hover:bg-[#014080] text-white",
    yellow:  "bg-[#dbb42b] hover:bg-[#c9a120] text-[#140759]",
    outline: "border border-[#01509d] text-[#01509d] hover:bg-[#01509d]/5 bg-transparent",
    green:   "bg-[#16a34a] hover:bg-[#15803d] text-white",
    ghost:   "text-[#01509d] hover:bg-[#01509d]/10 bg-transparent",
};

const SIZES: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-13 px-8 text-base",
};

interface Props {
    variant?: Variant;
    size?: Size;
    href?: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
}

export default function Button({
    variant = "primary",
    size = "md",
    href,
    disabled,
    onClick,
    className = "",
    children,
    type = "button",
    fullWidth,
}: Props) {
    const base = [
        "inline-flex items-center justify-center gap-2",
        "font-['Inter'] font-bold rounded-xl transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        className,
    ].join(" ");

    if (href && !disabled) {
        return <Link href={href} className={base}>{children}</Link>;
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={base}>
            {children}
        </button>
    );
}
