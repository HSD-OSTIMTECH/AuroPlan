# Proje Yönetimi Şeması ve Storage Kurulumu

Bu dosya, `supabase/projects_schema.sql` betiğini uygulamadan önce/sonra hangi tabloların ve bucket kurallarının eklendiğini anlamaya yardımcı olur.

## Storage
- **Bucket:** `project-assets`
- **Path deseni:** `teamId/projectId/<dosya-adı>`
- **Yetki mantığı:** `team_members` tablosu referans alınarak yalnızca ilgili takımın üyeleri dosya okuyabilir; owner/admin rolü olanlar yükleme ve silme yapabilir.
- **Kullanım:** Proje kapak görselleri, dokümanlar ve gelecekteki export dosyaları için aynı bucket kullanılabilir. Dosya metadata kaydı `project_documents` tablosuna yazılır.

## Yeni Tablolar

| Tablo | Amaç | Temel Alanlar |
| --- | --- | --- |
| `projects` | Takım bazlı proje kayıtları | `team_id`, `owner_id`, `name`, `slug`, `status`, `priority`, `start_date`, `due_date`, `metadata` |
| `project_members` | Proje özelindeki rol dağılımı | `project_id`, `user_id`, `role (owner/manager/contributor/viewer)` |
| `project_milestones` | Detaylı planlama için kilometre taşları | `project_id`, `title`, `status`, `due_date`, `order_index` |
| `project_updates` | Notlar, riskler, kararlar gibi kronolojik kayıtlar | `project_id`, `author_id`, `update_type`, `title`, `body`, `highlight` |
| `project_documents` | Storage dosyalarının metadata’sı | `project_id`, `storage_path`, `file_name`, `file_type`, `version`, `description` |

Tüm tablolarda RLS aktiftir. Politika şablonları:
- **Okuma:** `team_members` (veya `project_members`) ile `auth.uid()` eşleştirilir.
- **Yazma:** Yalnızca `owner`/`admin` (takım) ya da `owner`/`manager` (proje) rolleri.

## Uygulama Adımları
1. Supabase SQL Editor'de `supabase/projects_schema.sql` içeriğini çalıştırın.
2. Storage bucket'ın oluştuğunu doğrulayın (`project-assets`), gerekiyorsa versiyonlama/TTL ayarlarını UI'dan yapın.
3. `types/supabase.ts` dosyası projeye import edilerek (örn. `Database` tipi) sorgular tip güvenliğiyle yazılabilir.
