# Aura Plan - Design System & UI Guidelines

Bu belge, **Aura Plan** projesinin görsel dilini, tipografisini, renk paletini ve bileşen standartlarını tanımlar. Tasarım felsefemiz **"Modern, Kurumsal ve Ulaşılabilir"** (Modern, Corporate, Approachable) temellerine dayanır.

---

## 1. Tipografi (Typography)

Proje, Google Fonts kütüphanesinden **Nunito** font ailesini kullanmaktadır. Bu font, yuvarlak hatlarıyla modern ve dostane bir his verirken, iş dünyası için yeterli ciddiyeti korur.

**Font Ailesi:** `Nunito` (Sans-serif)
**Kaynak:** `app/layout.tsx`

| Kullanım | Tailwind Sınıfı | Özellikler | Örnek |
| :--- | :--- | :--- | :--- |
| **Ana Başlıklar (H1)** | `text-4xl md:text-6xl font-extrabold tracking-tight` | Çok kalın, sıkı harf aralığı | Landing Page Hero |
| **Alt Başlıklar (H2)** | `text-2xl md:text-3xl font-bold` | Kalın | Dashboard Başlıkları |
| **Bölüm Başlıkları (H3)** | `text-xl font-bold` | Kalın | Kart Başlıkları |
| **Gövde Metni (Body)** | `text-base` veya `text-sm` | Normal (400) veya Medium (500) | Genel İçerik |
| **Etiketler/Badges** | `text-xs font-bold uppercase tracking-wider` | Küçük, kalın, geniş aralıklı | Durum Rozetleri |

---

## 2. Renk Paleti (Color Palette)

Renkler `app/globals.css` içinde CSS değişkenleri olarak tanımlanmıştır ve Tailwind v4 `@theme` yapısı ile entegre edilmiştir.

### Ana Marka Renkleri (Primary Brand)
Güven ve profesyonelliği temsil eden mavi ve lacivert tonları.

| Değişken | Renk Kodu | Tailwind Karşılığı | Kullanım |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#2563EB` | `bg-blue-600` | Ana Butonlar, Linkler, Vurgular |
| `--color-primary-hover` | `#1D4ED8` | `bg-blue-700` | Buton Hover Durumları |
| `--color-foreground` | `#1e293b` | `text-slate-800` | Ana Metin Rengi |

### Nötr Renkler (Neutrals - Slate)
Arayüzün iskeletini oluşturan gri tonları. Soğuk ve temiz bir görünüm için `Slate` skalası kullanılır.

* **Zemin (Background):** `#ffffff` (Beyaz)
* **Yüzey (Surface):** `#f8fafc` (Slate-50) - Dashboard arka planı ve kart içleri.
* **Kenarlık (Border):** `#e2e8f0` (Slate-200) - İnce çizgiler ve ayrımlar.
* **Pasif Metin (Muted):** `#64748b` (Slate-500) - Açıklamalar ve pasif ikonlar.

### Fonksiyonel Renkler (Semantic)
Durum bildirmek için kullanılan renkler.

* 🟢 **Başarı (Success):** `Emerald-500` / `Green-600` (Tamamlanan görevler).
* 🟡 **Dikkat/Ödül (Warning/XP):** `Amber-500` (XP puanları, 'Sürüyor' durumu).
* 🔴 **Hata/Kritik (Danger):** `Red-500` (Silme butonları, 'Kritik' öncelik).

---

## 3. Şekil ve Efektler (Shape & Effects)

Aura Plan, "Soft UI" (Yumuşak Arayüz) prensiplerini benimser. Keskin köşeler yerine yuvarlatılmış hatlar ve yumuşak gölgeler kullanılır.

### Köşe Yuvarlama (Border Radius)
* **Kartlar & Konteynerler:** `rounded-2xl` veya `rounded-3xl` (Landing page gridleri için).
* **Butonlar & Inputlar:** `rounded-xl` (Modern ve dokunmatik dostu).
* **Küçük Rozetler:** `rounded-lg` veya `rounded-full`.

### Gölgeler (Shadows)
Derinlik hissi vermek için difüze (dağınık) ve renkli gölgeler kullanılır.
* **Varsayılan:** `shadow-sm` (Kartlar için).
* **Vurgulu:** `shadow-xl shadow-blue-600/20` (Ana aksiyon butonları - Glow efekti).
* **Hover:** `hover:shadow-md` (Kart üzerine gelince).

### Efektler
* **Glassmorphism:** `backdrop-blur-md bg-white/80` (Navbar ve bazı overlay alanları).
* **Gradients:** `bg-gradient-to-r from-blue-600 to-indigo-600` (Metin vurguları ve Hero alanları).

---

## 4. Bileşen Kütüphanesi (UI Kit)

### Butonlar (Buttons)
* **Primary:** Dolgu renkli, kalın font, hafif gölge.
    * `bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20`
* **Secondary/Outline:** Beyaz zemin, ince kenarlık.
    * `bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50`
* **Ghost:** Sadece ikon veya metin, arka plan yok.
    * `text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg`

### Form Elemanları (Inputs)
Geniş, ferah ve odaklanıldığında belirginleşen alanlar.
* **Normal:** `w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none transition-all`
* **Focus:** `focus:border-blue-500 focus:ring-2 focus:ring-blue-200`

### Kartlar (Cards)
Bilgi göstermek için kullanılan temel yapı taşı.
* **Stil:** `bg-white p-6 rounded-2xl border border-slate-200 shadow-sm`
* **Dashboard Kartları:** Genellikle beyaz zemin üzerine ikon ve istatistik içerir.

### İkonografi
Projede **Iconify** kütüphanesi üzerinden **Heroicons** seti kullanılmaktadır.
* **Stil:** Genellikle `Outline` (ince çizgili) ikonlar kullanılır.
* **Vurgu:** Renkli zemin üzerine beyaz ikon veya renkli ikon (örn: `text-blue-600 bg-blue-50`).

---

## 5. Yerleşim (Layout)

* **Konteyner:** İçeriği ortalamak için `max-w-7xl mx-auto px-6` standardı kullanılır.
* **Grid Sistemi:**
    * Dashboard: `grid-cols-1 md:grid-cols-3` (3 kolonlu yapı).
    * Landing Page: Bento Grid (Esnek, farklı boyutlu kutular).
* **Sidebar:** Masaüstünde sabit (`w-64`), mobilde gizlenebilir.

---

## 6. Örnek Kod Parçacığı (Snippet)

Standart bir "Aura Plan" kartı şöyle görünür:

```tsx
<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
    <Icon icon="heroicons:rocket-launch" className="text-2xl" />
  </div>
  <h3 className="text-lg font-bold text-slate-900">Başlık</h3>
  <p className="text-slate-500 text-sm mt-2">Açıklama metni buraya gelir.</p>
</div>