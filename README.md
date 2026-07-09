# LocalShop – E-Commerce Marketplace (MVP)

Yerel üreticilerin ürünlerini doğrudan müşterilere sattığı online marketplace platformu.

**Stack:** React 19 (Vite) · Node.js · Express 5 · MongoDB (Mongoose)

**Demo Video:** _[link eklenecek]_

## Özellikler

- İki rol: **customer** (katalog, sepet, sipariş, ödeme) ve **seller** (ürün yönetimi, gelen siparişler, kargo durumu)
- JWT tabanlı kimlik doğrulama, rol bazlı yetkilendirme
- Katalog: arama, kategori filtresi, sayfalama; stok bilgisi
- Satıcı başına bölünen siparişler, kurallı durum akışı, FakePay ödeme simülasyonu
- Çoklu dil: arayüz **ve** API mesajları TR/EN (Navbar'dan değiştirilebilir)
- 44 senaryoluk entegrasyon test paketi

## Mimari

```
┌─────────────────────┐   HTTP/JSON    ┌──────────────────────────┐   Mongoose   ┌─────────┐
│   React SPA (Vite)  │ ─────────────▶ │     Express REST API     │ ───────────▶ │ MongoDB │
│                     │ ◀───────────── │                          │ ◀─────────── │         │
│  api/ (axios,       │  Accept-Lang.  │  routes → controllers →  │              └─────────┘
│  JWT interceptor)   │                │  services → models       │
│  context/ (Auth,    │                │                          │
│  Cart, Language)    │                │  FakePay (iç servis,     │
└─────────────────────┘                │  kart bilgisi saklamaz)  │
                                       └──────────────────────────┘
```

Backend **katmanlı mimari** kullanır: route yalnızca yönlendirir, controller HTTP'yi yönetir ve istek dilinde cevap üretir, service iş kurallarını içerir (stok rezervasyonu, sipariş bölme, ödeme), model veriyi tanımlar. Hatalar merkezi `errorHandler`'da tek formatta toplanır; servisler hazır metin değil mesaj anahtarı fırlatır.

### Klasör Yapısı

```
localshop/
├── backend/
│   ├── src/
│   │   ├── config/        # DB bağlantısı
│   │   ├── constants/     # kategori anahtarları, tr/en mesaj katalogları
│   │   ├── controllers/   # HTTP ↔ servis eşleme (ince katman)
│   │   ├── i18n/          # Accept-Language çözümü, t() çeviri yardımcısı
│   │   ├── middleware/    # auth, locale, rate limit, validate, error
│   │   ├── models/        # Mongoose şemaları (User, Product, Cart, Order)
│   │   ├── routes/        # endpoint tanımları
│   │   ├── services/      # iş kuralları (auth, product, cart, order, payment, stock, fakePay)
│   │   ├── validators/    # express-validator kuralları
│   │   ├── utils/         # ApiError, response helper
│   │   ├── app.js         # express app (middleware zinciri)
│   │   └── server.js      # giriş noktası (env doğrulama + dinleme)
│   ├── scripts/seed.js    # örnek veri
│   └── tests/             # Vitest + Supertest entegrasyon testleri
├── frontend/
│   └── src/
│       ├── api/           # axios client + kaynak bazlı servisler
│       ├── components/    # Navbar, ProductCard, StatusBadge, ProductForm, …
│       ├── constants/     # kategori anahtarları
│       ├── context/       # AuthContext, CartContext
│       ├── hooks/         # useFetch (data/loading/error kalıbı)
│       ├── i18n/          # LanguageContext + tr/en sözlükleri
│       ├── pages/         # 11 sayfa (Login, Register, ProductList, …, Payment)
│       ├── styles/        # saf CSS design system (custom properties)
│       └── utils/         # fiyat/tarih formatlama
└── docs/                  # Postman collection, demo video senaryosu
```

## Kullanılan Teknolojiler

| Katman | Teknoloji | Amaç |
|---|---|---|
| Frontend | React 19, Vite 7, React Router 7 | SPA, route yönetimi |
| Frontend | Axios | API service layer (JWT + Accept-Language interceptor) |
| Frontend | Saf CSS | Design system (custom properties, responsive) |
| Backend | Node.js, Express 5 | REST API |
| Backend | Mongoose 9 | MongoDB ODM, şema validasyonu |
| Güvenlik | bcryptjs, jsonwebtoken | Parola hash (12 round), JWT oturum |
| Güvenlik | helmet, cors, express-rate-limit, express-validator | HTTP başlıkları, origin kontrolü, brute-force önlemi, girdi doğrulama |
| Test | Vitest, Supertest | Entegrasyon testleri (gerçek MongoDB, ayrı test DB'si) |

## Kurulum

Gereksinimler: **Node.js 18+** (LTS önerilir) ve lokal **MongoDB** (macOS: `brew services start mongodb-community`)

```bash
git clone <repo-url> && cd localshop

# Backend
cd backend
npm install
cp .env.example .env        # JWT_SECRET için: openssl rand -hex 32
npm run seed                # örnek kullanıcı + ürün (opsiyonel, mevcut veriyi siler)
npm run dev                 # http://localhost:3000

# Frontend (ikinci terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Seed hesapları (parola: `sifre123`):
seller → `ayse@localshop.dev`, `mehmet@localshop.dev` · customer → `deniz@localshop.dev`, `elif@localshop.dev`

## Testler

Backend entegrasyon testleri gerçek bir lokal MongoDB'ye karşı, **ayrı bir test veritabanında** (`localshop_test`) çalışır — geliştirme verinize dokunmaz.

```bash
cd backend
npm test
```

Kapsam: auth akışı, ürün CRUD + sahiplik kontrolleri, sepet stok kuralları, satıcı bazlı sipariş bölme, ödeme anında stok rezervasyonu/iadesi, eşzamanlı ödeme yarışında stok tutarlılığı, sipariş durum geçiş kuralları ve i18n katalog bütünlüğü.

## API Dokümantasyonu

**Postman Collection:** [`docs/localshop.postman_collection.json`](docs/localshop.postman_collection.json) — Postman → Import ile açın. Login istekleri token'ları, ürün/sipariş oluşturma id'leri collection değişkenlerine otomatik yazar; collection açıklamasındaki akış sırasını izlemek yeterli.

Tüm response'lar aynı formattadır: `{ "success": boolean, "data": object|null, "message": string }` — `message`, isteğin `Accept-Language` başlığına göre TR/EN döner.

| Method | Endpoint | Erişim | Açıklama |
|---|---|---|---|
| GET | /api/health | Public | Sağlık kontrolü |
| POST | /api/auth/register | Public | Kayıt (customer/seller) |
| POST | /api/auth/login | Public | Giriş, JWT döner |
| GET | /api/auth/me | Auth | Aktif kullanıcı bilgisi |
| GET | /api/products | Public | Katalog: `?category=` `?search=` `?page=` `?limit=` |
| GET | /api/products/categories | Public | Kullanımda olan kategoriler |
| GET | /api/products/:id | Public | Ürün detayı |
| POST | /api/products | Seller | Ürün ekle |
| PUT | /api/products/:id | Seller (sahibi) | Ürün güncelle (kısmi olabilir) |
| DELETE | /api/products/:id | Seller (sahibi) | Ürün sil |
| GET | /api/products/mine | Seller | Kendi ürünleri |
| GET | /api/cart | Customer | Sepeti getir (toplam server'da hesaplanır) |
| POST | /api/cart/items | Customer | Sepete ürün ekle `{productId, quantity}` |
| PUT | /api/cart/items/:productId | Customer | Adet değiştir `{quantity}` |
| DELETE | /api/cart/items/:productId | Customer | Sepetten çıkar |
| POST | /api/orders | Customer | Sepetten sipariş oluştur — satıcı başına bir sipariş (`PENDING_PAYMENT`) |
| GET | /api/orders | Customer | Sipariş geçmişi |
| GET | /api/orders/:id | Customer (sahibi) | Sipariş detayı |
| GET | /api/orders/seller | Seller | Ürünlerini içeren siparişler |
| PUT | /api/orders/:id/status | Seller | Durum güncelle (`SHIPPED` / `DELIVERED`) |
| POST | /api/payments/pay | Customer | FakePay ödeme `{orderId, cardNumber, cardHolder, expiry, cvv}` |

## Sipariş Durum Akışı

`PENDING_PAYMENT` → (ödeme) → `PAID` → `SHIPPED` → `DELIVERED`
Ödeme reddedilirse: `PAYMENT_FAILED` (tekrar denenebilir)

## Test Kartları (FakePay)

| Kart | Sonuç |
|---|---|
| `4242 4242 4242 4242` | Başarılı ödeme |
| `4000 0000 0000 0000` | Başarısız ödeme |

Kart bilgileri hiçbir koşulda veritabanına yazılmaz; siparişte yalnızca işlem referansı (`transactionId`) tutulur.

## Tasarım Kararları

- **Satıcı başına sipariş:** Checkout'ta sepet satıcıya göre gruplanır ve satıcı başına ayrı sipariş oluşturulur. Böylece her siparişin tek `status`'u ve tek ödeme akışı olur; hiçbir satıcı başka bir satıcının kalemlerinin durumunu değiştiremez.
- **Ödeme anında stok rezervasyonu:** Stok, sipariş oluşturulurken yalnızca kontrol edilir; atomik rezervasyon (koşullu `$inc`) ödeme sırasında yapılır, reddedilen ödemede anında iade edilir. Yarım bırakılan siparişler stok kilitleyemez.
- **Snapshot'lı sipariş kalemleri:** Sipariş, ürünün adını/fiyatını kopyalar; ürün sonradan değişse veya silinse bile sipariş kaydı bozulmaz.
- **FakePay soyutlaması:** Ödeme sağlayıcısı ayrı bir servis modülüdür; gerçek sağlayıcıya geçişte yalnızca bu modül değişir.
- **Sabit kategori anahtarları:** Kategoriler serbest metin değil, canonical anahtarlardır (`food`, `cosmetics`, …). Veri tutarlı kalır (aynı kategorinin "Gıda"/"food" diye bölünmesi imkânsız), görünen ad ise arayüz diline göre çevrilir. API her zaman anahtarla çalışır: `?category=food`.
- **Katmanlı mimari:** `routes → controllers → services → models`; iş kuralları service katmanında toplanır, controller'lar incedir.
- **Oturum modeli:** Stateless JWT, varsayılan ömür 1 gün (`JWT_EXPIRES_IN`). Süre dolunca istemci 401 alır ve otomatik çıkış yapılır. Çıkış işlemi token'ı istemciden siler; stateless JWT'de sunucu tarafı iptal (revocation) yoktur — üretim için kısa ömürlü access token + refresh token deseni önerilir.
- **Çoklu dil (i18n):** API, `Accept-Language` başlığına göre TR/EN mesaj döner. Servis katmanı hazır metin değil mesaj anahtarı + parametre fırlatır; çeviri en dış katmanda (errorHandler/controller) yapılır. Frontend'de dil Navbar'dan değiştirilir, seçim kalıcıdır ve axios her isteğe `Accept-Language` ekler — arayüz ve API mesajları her zaman aynı dilde. Kataloglar: `backend/src/constants/locales/` ve `frontend/src/i18n/`.
- **Token saklama (MVP trade-off):** JWT localStorage'da tutulur; XSS'e karşı üretimde httpOnly cookie tabanlı oturum tercih edilmelidir.
