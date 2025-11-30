import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Arkaplan Işık Efektleri */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob"></div>
          <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 hover:border-blue-300 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Aura Plan v1.0 Yayında
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            İşlerinizi Yönetmenin <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              En Akıllı Yolu
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Takımınızın potansiyelini ortaya çıkarın. Görev yönetimi, mikro
            öğrenme ve performans takibini tek bir platformda birleştirdik.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-1 flex items-center gap-2"
            >
              Ücretsiz Başlayın
              <Icon icon="heroicons:arrow-right" />
            </Link>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
              <Icon
                icon="heroicons:play-circle"
                className="text-xl text-slate-400"
              />
              Demo İzle
            </button>
          </div>

          {/* --- DASHBOARD MOCKUP GÖRSELİ --- */}
          <div className="relative mx-auto max-w-6xl">
            {/* Dekoratif Arkalar */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>

            <div className="relative bg-slate-900 p-2 rounded-2xl shadow-2xl ring-1 ring-slate-900/5">
              {/* Buraya PUBLIC klasörüne attığınız görsel gelecek */}
              {/* ÖNEMLİ: public/dashboard-preview.png dosyasını oluşturun */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-800">
                {/* Eğer görsel henüz yoksa bu placeholder görünür, varsa Image componenti çalışır */}
                <Image
                  src="/dashboard-preview.png" // Dosya adını buraya yazın
                  alt="Aura Plan Dashboard Arayüzü"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Fallback (Resim yüklenmezse diye) */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-50 -z-10">
                  <div className="text-center">
                    <Icon
                      icon="heroicons:photo"
                      className="text-4xl mx-auto mb-2 opacity-50"
                    />
                    <p>Dashboard Görseli Buraya Gelecek</p>
                    <p className="text-xs">(public/dashboard-preview.png)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge (Opsiyonel Süs) */}
            <div className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Icon icon="heroicons:check" className="text-xl" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">
                    Görev Tamamlandı
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    Web Sitesi Tasarımı
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 mb-8 tracking-widest">
            Dünya çapında 2.000+ yenilikçi takımın tercihi
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-50 hover:opacity-100 transition-opacity duration-500">
            {/* Logolar (Iconify ile) */}
            <Icon icon="logos:microsoft" className="text-2xl md:text-3xl" />
            <Icon icon="logos:google" className="text-2xl md:text-3xl" />
            <Icon icon="logos:spotify" className="text-2xl md:text-3xl" />
            <Icon icon="logos:amazon" className="text-2xl md:text-3xl" />
            <Icon icon="logos:slack" className="text-2xl md:text-3xl" />
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">
              Özellikler
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Takımınızın İhtiyaç Duyduğu Her Şey
            </h3>
            <p className="text-slate-500 text-lg">
              Karmaşık araçlardan kurtulun. Aura Plan, modern iş akışları için
              özenle tasarlanmış modüller sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* KUTU 1: GÖREV YÖNETİMİ (Geniş) */}
            <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/20">
                  <Icon icon="heroicons:squares-2x2" className="text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Kanban & Görev Panoları
                </h4>
                <p className="text-slate-500 max-w-sm">
                  Sürükle-bırak özelliği ile işlerinizi organize edin. Kimin ne
                  üzerinde çalıştığını anlık görün.
                </p>
              </div>
              {/* Görsel Temsili */}
              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-white rounded-tl-2xl border-t border-l border-slate-200 shadow-xl translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 h-20 rounded-lg border border-slate-100"></div>
                  <div className="bg-blue-50 h-24 rounded-lg border border-blue-100"></div>
                  <div className="bg-slate-50 h-24 rounded-lg border border-slate-100"></div>
                </div>
              </div>
            </div>

            {/* KUTU 2: MİKRO ÖĞRENME (Dikey) */}
            <div className="md:row-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 relative overflow-hidden text-white group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/20">
                  <Icon icon="heroicons:sparkles" className="text-2xl" />
                </div>
                <h4 className="text-xl font-bold mb-2">Sürekli Gelişim</h4>
                <p className="text-slate-400">
                  İş akışını bölmeden, 5 dakikalık kartlarla ekibinizi eğitin.
                </p>
                <div className="mt-8 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        XP
                      </div>
                      <div className="h-2 bg-white/10 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>

            {/* KUTU 3: ANALİTİK */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 group hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Icon icon="heroicons:chart-bar" className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Detaylı Raporlar
              </h4>
              <p className="text-slate-500 text-sm">
                Takım performansını verilerle ölçün.
              </p>
              <div className="mt-6 flex items-end gap-1 h-16">
                <div className="w-1/4 bg-green-100 rounded-t h-[40%] group-hover:h-[60%] transition-all"></div>
                <div className="w-1/4 bg-green-200 rounded-t h-[60%] group-hover:h-[80%] transition-all"></div>
                <div className="w-1/4 bg-green-500 rounded-t h-[80%] group-hover:h-[100%] transition-all"></div>
                <div className="w-1/4 bg-green-300 rounded-t h-[50%] group-hover:h-[70%] transition-all"></div>
              </div>
            </div>

            {/* KUTU 4: TAKIM (Geniş) */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-100 flex flex-col md:flex-row items-center gap-8 group">
              <div className="flex-1">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-600/20">
                  <Icon icon="heroicons:users" className="text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Takımınızla Senkronize Olun
                </h4>
                <p className="text-slate-600 text-sm mb-6">
                  Dosya paylaşımı, yorumlar ve anlık bildirimler ile iletişim
                  kopukluğunu önleyin.
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500"
                    >
                      U{i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-xs font-bold text-slate-900 shadow-sm">
                    +5
                  </div>
                </div>
              </div>
              {/* Dekoratif Chat Balonları */}
              <div className="flex-1 space-y-3 w-full max-w-xs">
                <div className="bg-white p-3 rounded-t-xl rounded-br-xl shadow-sm border border-slate-100 text-xs text-slate-600 ml-auto">
                  Tasarım revizeleri hazır mı?
                </div>
                <div className="bg-indigo-600 p-3 rounded-t-xl rounded-bl-xl shadow-md text-xs text-white">
                  Evet, sisteme yükledim! 🚀
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATISTICS --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">
              10k+
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Aktif Kullanıcı
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-2">
              1M+
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Tamamlanan Görev
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-2">
              %35
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Verimlilik Artışı
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-green-400 mb-2">
              4.9
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Kullanıcı Puanı
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Aura Plan ücretsiz mi?",
                a: "Evet, bireysel kullanım ve küçük takımlar (3 kişiye kadar) için sonsuza kadar ücretsiz bir planımız var.",
              },
              {
                q: "Takım arkadaşlarımı nasıl davet edebilirim?",
                a: "Dashboard üzerinden 'Takım Ayarları' menüsüne giderek e-posta adresi ile davetiye gönderebilirsiniz.",
              },
              {
                q: "Verilerim güvende mi?",
                a: "Kesinlikle. Verileriniz endüstri standardı şifreleme yöntemleri ile korunmakta ve düzenli olarak yedeklenmektedir.",
              },
              {
                q: "Mobil uygulamanız var mı?",
                a: "Şu an için mobil uyumlu web arayüzümüz (PWA) ile tüm cihazlardan erişebilirsiniz. Native uygulamamız yakında geliyor.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-slate-200 open:border-blue-200 overflow-hidden transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-slate-800 hover:text-blue-600 transition-colors list-none outline-none">
                  {item.q}
                  <Icon
                    icon="heroicons:chevron-down"
                    className="group-open:rotate-180 transition-transform duration-300"
                  />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Çalışma şeklinizi bugün değiştirin.
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Aura Plan ile projelerinizi zamanında teslim edin, ekibinizi mutlu
              edin ve kendinizi geliştirin.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-lg"
            >
              Hemen Ücretsiz Katılın
            </Link>
            <p className="mt-6 text-sm text-blue-200 opacity-80">
              Kredi kartı gerekmez • 14 gün Pro deneme
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
