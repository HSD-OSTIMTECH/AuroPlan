# AuroPlan

> Açık-kaynak kimlikli, ekip içi görev takip ve mikro öğrenme akışları için hazırlanmış Next.js tabanlı üretkenlik platformu.

AuroPlan; kişi veya takım tabanlı projelerinizi, Kanban panolarını, kilometre taşlarını ve knowledge base'i aynı panelde toplayan Supabase destekli bir görev takip sistemidir. Kod tabanı App Router mimarisi üzerine kurulduğu için SSR ve edge senaryolarında ölçeklenebilir.

## Proje Özeti

- `app/(site)` altında landing page, `app/(auth)` altında Supabase kimlik doğrulaması ve `app/(dashboard)` altında asıl uygulama deneyimi bulunur.
- Dashboard; görev, proje, takım, takvim, profil ve mikro öğrenme modüllerine ayrılır ve tüm ekranlar Supabase veritabanından dinamik veri çeker.
- `DETAILED_MVP_PLAN.md` ve `DESIGN_SYSTEM.md` dokümanları ürün kararları ile UI dilini belgeler; açık-kaynak misyonu doğrultusunda süreç şeffaf tutulur.
- Repoyu forklayıp kendi organizasyonunuzda barındırabilir, README'deki adımları izleyerek dakikalar içinde local ortamda çalıştırabilirsiniz.

## Öne Çıkan Özellikler

### Görev Yönetimi ve Kanban

- `app/(dashboard)/dashboard/tasks/page.tsx` Supabase'deki `tasks` tablosunu **todo / in_progress / done** durumlarına göre gruplandırarak üç kolonlu Kanban oluşturur.
- `components/tasks/NewTaskModal.tsx` istemci tarafında formu açar, `dashboard/tasks/action.ts` içindeki Next.js server action'u ile kayıt oluşturur ve `revalidatePath` ile görünümü günceller.
- Görev kartları `types/supabase.ts` içinden gelen tiplerle `priority`, `description`, `assigned_to` gibi alanları güvende tutar.

### Proje Alanları

- `app/(dashboard)/dashboard/projects/page.tsx` aynı kullanıcıya ait **kişisel workspace** ve **takım workspace**'lerini sekmeli arayüzde toplar, istatistik kartları ile toplam/aktif proje sayısını sunar.
- `components/projects/*` dosyaları kapak görseli, kilometre taşları, güncellemeler, doküman yükleme ve üye davet modallarını kapsar. Dokümanlar `uploadProjectFile` server action'ı üzerinden Supabase Storage'taki `project-files` bucket'ına yüklenir.
- Supabase şeması `supabase/projects_schema.sql` dosyasında yer alır; `projects`, `project_members`, `project_milestones`, `project_updates` ve `project_documents` tablolarını tanımlar.

### Takım Operasyonları

- `app/(dashboard)/layout.tsx` aktif kullanıcının takımını çekip `components/dashboard/Sidebar` bileşenine aktarır. Sidebar workspace seçimi, pro rozetleri ve alt menüyü yönetir.
- `app/(dashboard)/dashboard/team` ile `components/teams/CreateTeamForm.tsx` takım oluşturur ve `team_members` tablosu üzerinden owner/admin/member rolleri atar.

### Takvim ve Zaman Çizelgesi

- `components/calendar/CalendarView.tsx` ve `TimelineView.tsx` görev, proje ve etkinlikleri `date-fns` yardımıyla aylık görünümde hesaplar ve renk kodlarıyla listeler.
- `EventDetailsModal` gün içindeki öğelerin ayrıntılarını açan tıklanabilir kartlar sağlar; `CalendarItem` tipi metadata sayesinde hangi takıma ya da projeye ait olduğunu bilir.

### Mikro Öğrenme Merkezi

- `app/(dashboard)/dashboard/learn/page.tsx` XP tabanlı gamification kartı, takım-özel ve herkese açık içerik sekmeleri ile `micro_learnings` tablosunu kullanır.
- `LearningCard`, `UploadForm` ve `CompleteButton` bileşenleri markdown/PDF içerikleri gösterip `user_progress` tablosu ile tamamlama durumlarını takip eder.

## Teknik Mimari

- **Çerçeve:** Next.js 16 (App Router) + React 19 + TypeScript 5.
- **Stil ve UI:** Tailwind CSS 4, `clsx`, `tailwind-merge`, Iconify ve `components/ui`, `components/dashboard`, `components/projects` gibi özel bileşen setleri.
- **Veri Katmanı:** Supabase (PostgreSQL, Auth, Storage). `utils/supabase/server.ts` cookie paylaşımı ile SSR client oluşturur, `utils/supabase/client.ts` tarayıcı tarafını destekler.
- **Server Actions:** Görev, proje, öğrenme ve takım modülleri `"use server"` action'ları ile form submit akışını yönetir; `revalidatePath` ve `redirect` kullanarak deneyimi taze tutar.
- **Middleware:** `middleware.ts` korunmuş dashboard rotalarına girmeden Supabase oturumunu doğrular.
- **Tip Güvenliği:** `types/supabase.ts` ve `types/calendar.ts` veri modellerini TypeScript ile belgeler, sorguların tamamını tür güvenli yapar.

## Veri Modeli Özeti

| Tablo                                                                           | Amaç                                                                              |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `profiles`                                                                      | Kullanıcı profil alanları, avatar, XP, level.                                     |
| `teams` / `team_members`                                                        | Workspace'ler ve rol bazlı üyelikler.                                             |
| `tasks`                                                                         | Durum, öncelik, görev sahibi alanlarıyla kişi veya takım görevleri.               |
| `projects`                                                                      | Temel proje bilgileri, tarih aralığı, durum/öncelik ve opsiyonel metadata.        |
| `project_members`, `project_milestones`, `project_updates`, `project_documents` | Proje içi roller, kilometre taşları, kronolojik güncellemeler ve dosya kayıtları. |
| `micro_learnings`, `user_progress`                                              | Mikro öğrenme kartları ve kullanıcı tamamlama kayıtları (XP hesaplaması için).    |

Tüm tablolar Row Level Security aktif olacak şekilde tasarlanmıştır; detaylar için `supabase/projects_schema.sql` dosyasına bakabilirsiniz.

## Dizin Özeti

```
app/
  (site)/            -> Landing page
  (auth)/            -> Login & Signup + server actions
  (dashboard)/       -> Dashboard layout ve tüm modüller
components/
  dashboard/, tasks/, projects/, calendar/, learn/ ...
supabase/
  PROJECT_SCHEMA.md, projects_schema.sql
types/
  supabase.ts, calendar.ts
utils/
  supabase/ (server & client yardımcıları)
public/
  Images/ ve Logos/ altında tanıtım varlıkları
```

## Geliştirme Ortamı

1. **Bağımlılıkları kurun**
   ```bash
   pnpm install
   ```
2. **Ortam değişkenlerini hazırlayın**  
   `.env.example` dosyasını `.env.local` olarak kopyalayıp aşağıdaki anahtarları doldurun:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (opsiyonel ama storage işlemlerinde faydalı)
3. **Supabase şemasını uygulayın**  
   `supabase/projects_schema.sql` içeriğini Supabase SQL Editor'de çalıştırın, `project-files` bucket'ını oluşturun.
4. **Geliştirme sunucusunu başlatın**
   ```bash
   pnpm dev
   # http://localhost:3000 -> landing
   # http://localhost:3000/dashboard -> yetkili kullanıcı paneli
   ```
5. **Kod kalitesini doğrulayın**
   ```bash
   pnpm lint
   ```

## Katkı ve Yol Haritası

AuroPlan açık-kaynak bir görev takip ve bilgi paylaşım platformudur. Yeni özellikler, hata düzeltmeleri veya Supabase şeması iyileştirmeleri için pull request gönderebilirsiniz. Başlamadan önce:

- `DESIGN_SYSTEM.md` ve `DETAILED_MVP_PLAN.md` dosyalarındaki UX ve yol haritası notlarını inceleyin.
- Veri modelinde yaptığınız değişiklikleri `supabase/` altındaki SQL dosyalarına mutlaka işleyin.
- Tartışmaları depo üzerinden yürütüp açık-kaynak topluluğuna geribildirim verin.

> AuroPlan; ekiplerin çalışmalarını şeffaf, takip edilebilir ve öğrenme odaklı şekilde ilerletebilmesi için tasarlandı. Kendi senaryonuza göre uyarlayın, geribildiriminizi paylaşın ve açık-kaynak görev takip sisteminin büyümesine destek olun!
