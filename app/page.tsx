import Link from "next/link";
import { Icon } from "@iconify/react";

export default function LandingPage() {
  return (
    // Fragment (<>...</>) veya div kullanabiliriz, layout zaten sarmalıyor.
    <div className="bg-background">
      {/* --- Hero Section --- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Sol: Metin */}
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-muted text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              v1.0 Yayında
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-[1.15]">
              İş akışınızı <br />
              <span className="text-muted">mükemmelleştirin.</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-lg">
              Aura Plan, takımların karmaşadan kurtulup hedeflere odaklanmasını
              sağlar. Görev yönetimi ve sürekli gelişimi tek bir platformda
              birleştirin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 text-base font-bold bg-accent text-accent-foreground rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
              >
                Hemen Başlayın
              </Link>
              <button className="px-8 py-4 text-base font-bold text-foreground bg-background border border-border rounded-xl hover:bg-surface transition-colors flex items-center justify-center gap-2">
                <Icon icon="heroicons:play" />
                Nasıl Çalışır?
              </button>
            </div>

            <div className="pt-8 flex items-center gap-4 text-sm text-muted font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] overflow-hidden"
                  >
                    <Icon
                      icon="heroicons:user"
                      className="text-muted-foreground/50"
                    />
                  </div>
                ))}
              </div>
              <p>+2.000 profesyonel tarafından kullanılıyor.</p>
            </div>
          </div>

          {/* Sağ: Görsel (Kurumsal Dashboard Temsili) */}
          <div className="relative">
            <div className="absolute -inset-4 bg-surface rounded-[2rem] -rotate-2 -z-10 border border-border/50"></div>
            <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden aspect-[4/3] flex flex-col">
              {/* Fake Browser Header */}
              <div className="h-10 bg-surface border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 p-8 bg-surface/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-accent rounded-2xl mx-auto flex items-center justify-center">
                    <Icon icon="heroicons:squares-2x2" className="text-3xl" />
                  </div>
                  <h3 className="text-foreground font-bold text-xl">
                    Dashboard Önizlemesi
                  </h3>
                  <p className="text-muted text-sm">
                    Giriş yaptıktan sonra burası aktif olacak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Value Proposition (Grid) --- */}
      <section
        id="solutions"
        className="py-24 bg-surface border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Verimliliği yeniden tanımlayın
            </h2>
            <p className="text-muted">
              Geleneksel yapılacaklar listelerinden sıyrılın. Aura Plan, modern
              iş ihtiyaçları için tasarlandı.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Kart 1 */}
            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300 group">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon icon="heroicons:list-bullet" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Sistemli Görevler
              </h3>
              <p className="text-muted leading-relaxed">
                Görevleri projelere bölün, alt görevler oluşturun ve Kanban
                panosu ile görselleştirin.
              </p>
            </div>

            {/* Kart 2 */}
            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300 group">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon icon="heroicons:user-group" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Takım Senkronizasyonu
              </h3>
              <p className="text-muted leading-relaxed">
                Takım arkadaşlarınızı atayın, yorum yapın ve dosya paylaşın.
                E-posta trafiğini azaltın.
              </p>
            </div>

            {/* Kart 3 */}
            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300 group">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon icon="heroicons:academic-cap" className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Entegre Gelişim
              </h3>
              <p className="text-muted leading-relaxed">
                İş arasında kısa, etkili mikro öğrenme içerikleriyle ekibinizin
                yetkinliklerini artırın.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
