import Navbar from "../components/Navbar";
import Header from "../components/SEquiperHeader";

export default function SEquiperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F9FAEE] font-outfit">
      <Navbar />
      <Header />
        {children}
    </div>
  );
}
