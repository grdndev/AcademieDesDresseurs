export default function ApprendreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-theme="apprendre">
            <style>{`
                [data-theme="apprendre"] .min-h-screen {
                    background-image: radial-gradient(rgba(1,80,157,0.12) 1.5px, transparent 1.5px) !important;
                    background-size: 22px 22px !important;
                }
            `}</style>
            {children}
        </div>
    );
}
