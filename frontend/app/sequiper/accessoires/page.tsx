import { Box } from "lucide-react";
import Link from "next/link";

export default function AccessoiresPage() {
    return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link href="/sequiper" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                    <Box className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Retour à la page s&apos;équiper</h3>
                </div>
            </Link>
        </div>
    </main>
    );
}
