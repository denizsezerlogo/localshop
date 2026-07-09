// Türkçe mesaj kataloğu.
// en.js ile birebir aynı anahtarları içerir (tests/i18n.test.js bu eşitliği doğrular).
// Parametreli mesajlar template fonksiyonudur. VAL_* anahtarları validator mesajlarıdır.
export const tr = {
  // Genel
  SERVER_ERROR: 'Sunucu hatası',
  NOT_FOUND_ROUTE: (method, url) => `Bulunamadı: ${method} ${url}`,
  DUPLICATE_RECORD: 'Bu kayıt zaten mevcut',
  INVALID_ID: 'Geçersiz id formatı',
  RATE_LIMITED: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin',
  RATE_LIMITED_AUTH: 'Çok fazla deneme yapıldı, lütfen 15 dakika sonra tekrar deneyin',
  RATE_LIMITED_PAYMENT: 'Çok fazla ödeme denemesi yapıldı, lütfen daha sonra tekrar deneyin',

  // Auth
  AUTH_REQUIRED: 'Giriş yapmanız gerekiyor',
  AUTH_INVALID_TOKEN: 'Geçersiz token, lütfen tekrar giriş yapın',
  AUTH_TOKEN_EXPIRED: 'Oturum süresi doldu, lütfen tekrar giriş yapın',
  AUTH_USER_GONE: "Bu token'a ait kullanıcı artık mevcut değil",
  AUTH_FORBIDDEN: 'Bu işlem için yetkiniz yok',
  AUTH_EMAIL_TAKEN: 'Bu email ile kayıtlı bir kullanıcı zaten var',
  AUTH_BAD_CREDENTIALS: 'Email veya parola hatalı',
  AUTH_REGISTERED: 'Kayıt başarılı',
  AUTH_LOGGED_IN: 'Giriş başarılı',

  // Product
  PRODUCT_NOT_FOUND: 'Ürün bulunamadı',
  PRODUCT_NOT_OWNER: 'Bu ürün üzerinde işlem yapma yetkiniz yok',
  PRODUCT_CREATED: 'Ürün eklendi',
  PRODUCT_UPDATED: 'Ürün güncellendi',
  PRODUCT_DELETED: 'Ürün silindi',

  // Cart
  CART_EMPTY: 'Sepetiniz boş',
  CART_ITEM_NOT_FOUND: 'Ürün sepette bulunamadı',
  CART_ITEM_ADDED: 'Ürün sepete eklendi',
  CART_ITEM_UPDATED: 'Adet güncellendi',
  CART_ITEM_REMOVED: 'Ürün sepetten çıkarıldı',
  CART_MAX_STOCK: (name, stock) => `Yetersiz stok: '${name}' için en fazla ${stock} adet ekleyebilirsiniz`,
  CART_MAX_STOCK_UPDATE: (name, stock) => `Yetersiz stok: '${name}' için en fazla ${stock} adet seçebilirsiniz`,

  // Order
  ORDER_NOT_FOUND: 'Sipariş bulunamadı',
  ORDER_FORBIDDEN: 'Bu siparişi görüntüleme yetkiniz yok',
  ORDER_CREATED: (count) =>
    count > 1
      ? `Sepetiniz ${count} farklı satıcının ürünlerini içerdiği için ${count} ayrı sipariş oluşturuldu, ödeme bekleniyor`
      : 'Sipariş oluşturuldu, ödeme bekleniyor',
  ORDER_NO_SELLER_ITEMS: 'Bu siparişte size ait ürün bulunmuyor',
  ORDER_BAD_TRANSITION: (from, to) => `'${from}' durumundan '${to}' durumuna geçilemez`,
  ORDER_STATUS_UPDATED: 'Sipariş durumu güncellendi',
  ORDER_STOCK_LEFT: (name, left) => `Yetersiz stok: '${name}' için ${left} adet kaldı`,
  ORDER_STOCK_RACE: (name) => `Yetersiz stok: '${name}' bu sırada tükendi`,

  // Payment
  PAYMENT_NOT_YOURS: 'Bu sipariş size ait değil',
  PAYMENT_NOT_PAYABLE: 'Bu sipariş ödemeye uygun durumda değil',
  PAYMENT_SUCCESS: 'Ödeme başarılı',
  PAYMENT_FAILED: (reason) => `Ödeme başarısız: ${reason}`,
  PAYMENT_DECLINED: 'Kart reddedildi',

  // Validator mesajları
  VAL_NAME_LENGTH: 'İsim 2-60 karakter olmalı',
  VAL_EMAIL: 'Geçerli bir email girin',
  VAL_PASSWORD_MIN: 'Parola en az 6 karakter olmalı',
  VAL_PASSWORD_REQUIRED: 'Parola zorunludur',
  VAL_ROLE: 'Rol customer veya seller olabilir',
  VAL_PRODUCT_ID: "Geçersiz ürün id'si",
  VAL_ORDER_ID: "Geçersiz sipariş id'si",
  VAL_PAGE: 'page 1 veya daha büyük olmalı',
  VAL_LIMIT: 'limit 1-50 arası olmalı',
  VAL_SEARCH_MAX: 'Arama en fazla 100 karakter olabilir',
  VAL_PRODUCT_NAME: 'Ürün adı 2-120 karakter olmalı',
  VAL_PRODUCT_DESC: 'Açıklama 1-2000 karakter olmalı',
  VAL_PRICE: 'Fiyat 0 veya daha büyük bir sayı olmalı',
  VAL_STOCK: 'Stok 0 veya daha büyük bir tam sayı olmalı',
  VAL_CATEGORY: 'Kategori 2-60 karakter olmalı',
  VAL_QUANTITY: 'Adet 1-999 arası bir tam sayı olmalı',
  VAL_ORDER_STATUS: 'Durum yalnızca SHIPPED veya DELIVERED olabilir',
  VAL_CARD_NUMBER: 'Kart numarası 13-19 haneli olmalı',
  VAL_CARD_HOLDER: 'Kart sahibi adı 2-60 karakter olmalı',
  VAL_EXPIRY_FORMAT: 'Son kullanma tarihi AA/YY formatında olmalı',
  VAL_EXPIRY_PAST: 'Kartın süresi dolmuş',
  VAL_CVV: 'CVV 3-4 haneli olmalı',
};
