import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded-md grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
            <Image
              src="/Logos/JustLogo.jpg"
              alt="Aura Plan Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-primary font-bold text-lg">Aura Plan</span>
        </div>
        <div className="text-sm text-muted font-medium">
          &copy; {new Date().getFullYear()} Aura Plan Tüm hakları
          saklıdır.
        </div>
      </div>
    </footer>
  );
}
