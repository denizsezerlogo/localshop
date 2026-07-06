# LocalShop – E-Commerce Marketplace (MVP)

Yerel üreticilerin ürünlerini doğrudan müşterilere sattığı online marketplace platformu.

**Stack:** React (Vite) · Node.js · Express · MongoDB

> 🚧 Geliştirme devam ediyor — bu README proje ilerledikçe genişletilecek.

## Durum

- [x] Backend: Express iskeleti (güvenlik middleware'leri, merkezi hata yönetimi)
- [x] Backend: Authentication (JWT, bcrypt, rol bazlı yetkilendirme)
- [x] Backend: Product modülü (seller CRUD + katalog: filtre, arama, sayfalama)
- [x] Backend: Cart modülü (stok kontrollü sepet işlemleri)
- [ ] Backend: Order + FakePay modülleri
- [ ] Frontend: React uygulaması
- [ ] API dokümantasyonu + demo video

## Hızlı Başlangıç (backend)

Gereksinimler: Node.js LTS, lokal MongoDB (`brew services start mongodb-community`)

```bash
cd backend
npm install
cp .env.example .env   # değerleri gerekirse düzenle
npm run dev            # http://localhost:3000
```

Test: `curl http://localhost:3000/api/health`

## API (şu ana kadar)

| Method | Endpoint | Erişim | Açıklama |
|---|---|---|---|
| GET | /api/health | Public | Sağlık kontrolü |
| POST | /api/auth/register | Public | Kayıt (customer/seller) |
| POST | /api/auth/login | Public | Giriş, JWT döner |
| GET | /api/auth/me | Auth | Aktif kullanıcı bilgisi |
| GET | /api/products | Public | Katalog: `?category=` `?search=` `?page=` `?limit=` |
| GET | /api/products/categories | Public | Mevcut kategoriler |
| GET | /api/products/:id | Public | Ürün detayı |
| POST | /api/products | Seller | Ürün ekle |
| PUT | /api/products/:id | Seller (sahibi) | Ürün güncelle (kısmi olabilir) |
| DELETE | /api/products/:id | Seller (sahibi) | Ürün sil |
| GET | /api/products/mine | Seller | Kendi ürünleri |
| GET | /api/cart | Customer | Sepeti getir (toplam server'da hesaplanır) |
| POST | /api/cart/items | Customer | Sepete ürün ekle `{productId, quantity}` |
| PUT | /api/cart/items/:productId | Customer | Adet değiştir `{quantity}` |
| DELETE | /api/cart/items/:productId | Customer | Sepetten çıkar |

Tüm response'lar aynı formattadır: `{ "success": boolean, "data": object|null, "message": string }`
