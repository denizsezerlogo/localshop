# LocalShop – E-Commerce Marketplace (MVP)

Yerel üreticilerin ürünlerini doğrudan müşterilere sattığı online marketplace platformu.

**Stack:** React (Vite) · Node.js · Express · MongoDB

> 🚧 Geliştirme devam ediyor — bu README proje ilerledikçe genişletilecek.

## Durum

- [x] Backend: Express iskeleti (güvenlik middleware'leri, merkezi hata yönetimi)
- [x] Backend: Authentication (JWT, bcrypt, rol bazlı yetkilendirme)
- [ ] Backend: Product / Cart / Order / FakePay modülleri
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

Tüm response'lar aynı formattadır: `{ "success": boolean, "data": object|null, "message": string }`
