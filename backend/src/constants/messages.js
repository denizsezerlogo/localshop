// Kullanıcıya dönen tüm İŞ MESAJLARI tek yerde toplanır — Android'deki strings.xml'in karşılığı.
// Avantajları: tutarlı dil, tek noktadan değişiklik, mesaj tekrarının önlenmesi ve
// ileride çoklu dil (i18n) desteğine geçişe hazır yapı (bu modül locale dosyalarıyla değiştirilir).
//
// Bilinçli tercih: express-validator kural mesajları validator dosyalarında bırakıldı;
// alan kuralıyla mesajı birlikte okunur ve birlikte değişir. Reuse edilen iş mesajları buradadır.
//
// Parametreli mesajlar template fonksiyonu olarak tanımlanır: MSG.ORDER_STOCK_LEFT('Bal', 3)

export const MSG = {
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
  ORDER_CREATED: 'Sipariş oluşturuldu, ödeme bekleniyor',
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
};
