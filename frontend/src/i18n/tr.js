// Türkçe arayüz sözlüğü. en.js ile birebir aynı anahtarları içerir.
// Parametreli metinler template fonksiyonudur: t.STOCK_LAST(3)
export const tr = {
  // Genel
  LOADING: 'Yükleniyor…',
  GENERIC_ERROR: 'Bir şeyler ters gitti, lütfen tekrar deneyin',
  ERROR_FALLBACK: 'Bir şeyler ters gitti.',
  RETRY: 'Tekrar dene',
  FOOTER_TAGLINE: 'LocalShop — yerel üreticilerden doğrudan alışveriş',

  // Yükleme durumları
  LOADING_PRODUCTS: 'Ürünler yükleniyor…',
  LOADING_PRODUCT: 'Ürün yükleniyor…',
  LOADING_ORDERS: 'Siparişler yükleniyor…',
  LOADING_ORDER: 'Sipariş yükleniyor…',
  LOADING_CART: 'Sepet yükleniyor…',

  // Meşgul buton durumları
  BUSY_LOGIN: 'Giriş yapılıyor…',
  BUSY_REGISTER: 'Kayıt yapılıyor…',
  BUSY_SAVING: 'Kaydediliyor…',
  BUSY_ADDING: 'Ekleniyor…',
  BUSY_CHECKOUT: 'Sipariş oluşturuluyor…',
  BUSY_PAYING: 'Ödeme işleniyor…',

  // Navigasyon
  NAV_PRODUCTS: 'Ürünler',
  NAV_CART: 'Sepet',
  NAV_ORDERS: 'Siparişlerim',
  NAV_SELLER_PANEL: 'Satıcı Paneli',
  NAV_LOGIN: 'Giriş',
  NAV_REGISTER: 'Kayıt Ol',
  NAV_LOGOUT: 'Çıkış',

  // Auth
  LOGIN_TITLE: 'Giriş Yap',
  REGISTER_TITLE: 'Kayıt Ol',
  FIELD_NAME: 'Ad Soyad',
  FIELD_EMAIL: 'Email',
  FIELD_PASSWORD: 'Parola',
  FIELD_ROLE: 'Hesap türü',
  PH_NAME: 'Adınız Soyadınız',
  PH_EMAIL: 'ornek@mail.com',
  PH_PASSWORD_LOGIN: '••••••',
  PH_PASSWORD_REGISTER: 'En az 6 karakter',
  ROLE_CUSTOMER: 'Müşteri',
  ROLE_CUSTOMER_DESC: 'Ürünleri keşfet ve satın al',
  ROLE_SELLER: 'Satıcı',
  ROLE_SELLER_DESC: 'Ürünlerini sat',
  BTN_LOGIN: 'Giriş Yap',
  BTN_REGISTER: 'Kayıt Ol',
  AUTH_NO_ACCOUNT: 'Hesabın yok mu?',
  LINK_REGISTER: 'Kayıt ol',
  AUTH_HAVE_ACCOUNT: 'Zaten hesabın var mı?',
  LINK_LOGIN: 'Giriş yap',

  // Katalog
  PAGE_PRODUCTS: 'Ürünler',
  PRODUCT_COUNT: (count) => `${count} ürün`,
  PH_SEARCH: 'Ürün ara… (örn. bal)',
  ARIA_SEARCH: 'Ürün ara',
  ARIA_CATEGORY: 'Kategori filtresi',
  FILTER_ALL: 'Tüm kategoriler',
  SELLER_PREFIX: (name) => `Satıcı: ${name}`,
  STOCK_OUT: 'Tükendi',
  STOCK_OUT_DETAIL: 'Bu ürün tükendi',
  STOCK_LAST: (count) => `Son ${count} adet`,
  STOCK_AVAILABLE: (count) => `Stok: ${count} adet`,
  EMPTY_PRODUCTS_TITLE: 'Ürün bulunamadı',
  EMPTY_PRODUCTS_HINT: 'Arama veya filtre kriterlerini değiştirmeyi deneyin.',
  SELLER_CANNOT_SHOP: 'Satıcı hesabıyla alışveriş yapılamaz.',

  // Sayfalama
  PAGE_OF: (page, pages) => `Sayfa ${page} / ${pages}`,
  BTN_PREV: '← Önceki',
  BTN_NEXT: 'Sonraki →',

  // Ürün detay
  BACK_TO_PRODUCTS: '← Ürünlere dön',
  FIELD_QTY: 'Adet',
  BTN_ADD_CART: 'Sepete Ekle',
  CART_ITEM_ADDED: 'Ürün sepete eklendi.',
  LINK_GO_CART: 'Sepete git →',

  // Sepet
  PAGE_CART: 'Sepetim',
  UNIT_PRICE: (price) => `${price} / adet`,
  BTN_REMOVE: 'Kaldır',
  TOTAL_PREFIX: (total) => `Toplam: ${total}`,
  BTN_CHECKOUT: 'Siparişi Tamamla',
  EMPTY_CART_TITLE: 'Sepetiniz boş',
  EMPTY_CART_HINT: 'Ürünleri keşfedip sepetinize ekleyin.',
  BTN_BROWSE: 'Ürünlere göz at',

  // Siparişler
  PAGE_ORDERS: 'Siparişlerim',
  ORDER_NO: (code) => `Sipariş #${code}`,
  BTN_PAY: 'Ödemeye Geç',
  BTN_PAY_RETRY: 'Ödemeyi Tekrar Dene',
  EMPTY_ORDERS_TITLE: 'Henüz siparişiniz yok',
  EMPTY_ORDERS_HINT: 'İlk siparişinizi vermek için ürünlere göz atın.',

  // Ödeme
  PAGE_PAYMENT: 'Ödeme',
  TEST_CARDS_TITLE: 'Test kartları',
  TEST_CARDS_SUCCESS: 'başarılı',
  TEST_CARDS_FAIL: 'başarısız',
  FIELD_CARD_NUMBER: 'Kart Numarası',
  FIELD_CARD_HOLDER: 'Kart Sahibi',
  FIELD_EXPIRY: 'Son Kullanma (AA/YY)',
  FIELD_CVV: 'CVV',
  PH_CARD_HOLDER: 'Ad Soyad',
  BTN_PAY_AMOUNT: (amount) => `${amount} Öde`,
  ORDER_SUMMARY: 'Sipariş Özeti',
  TOTAL_LABEL: 'Toplam',
  PAYMENT_SUCCESS_TITLE: 'Ödeme Başarılı 🎉',
  PAYMENT_SUCCESS_DETAIL: (orderCode) => `Sipariş #${orderCode} için ödemeniz alındı.`,
  PAYMENT_FAILED_RETRY: (message) => `${message} — kartınızı kontrol edip tekrar deneyebilirsiniz.`,
  ORDER_NOT_PAYABLE_TITLE: 'Bu sipariş ödenemez',
  ORDER_NOT_PAYABLE_HINT: 'Sipariş ödemeye uygun durumda değil.',
  BTN_GO_ORDERS: 'Siparişlerime Git',
  BTN_BACK_ORDERS: 'Siparişlerime dön',

  // Satıcı paneli
  PAGE_SELLER: 'Satıcı Paneli',
  BTN_NEW_PRODUCT: '+ Yeni Ürün',
  TAB_PRODUCTS: 'Ürünlerim',
  TAB_ORDERS: 'Gelen Siparişler',
  TH_PRODUCT: 'Ürün',
  TH_CATEGORY: 'Kategori',
  TH_PRICE: 'Fiyat',
  TH_STOCK: 'Stok',
  TH_ACTIONS: 'İşlemler',
  BTN_EDIT: 'Düzenle',
  BTN_DELETE: 'Sil',
  DELETE_PRODUCT_CONFIRM: (name) => `'${name}' silinsin mi? Bu işlem geri alınamaz.`,
  EMPTY_SELLER_PRODUCTS_TITLE: 'Henüz ürününüz yok',
  EMPTY_SELLER_PRODUCTS_HINT: 'İlk ürününüzü ekleyerek satışa başlayın.',
  BTN_ADD_FIRST: 'Ürün Ekle',
  EMPTY_SELLER_ORDERS_TITLE: 'Henüz sipariş yok',
  EMPTY_SELLER_ORDERS_HINT: 'Ürünleriniz sipariş aldığında burada listelenir.',
  CUSTOMER_PREFIX: (name) => `Müşteri: ${name}`,
  BTN_SHIP: 'Kargoya Ver',
  BTN_DELIVER: 'Teslim Edildi Olarak İşaretle',

  // Ürün formu
  FIELD_PRODUCT_NAME: 'Ürün adı',
  PH_PRODUCT_NAME: 'Örn. Organik Çiçek Balı',
  FIELD_DESCRIPTION: 'Açıklama',
  PH_DESCRIPTION: 'Ürünü kısaca tanıtın',
  FIELD_PRICE: 'Fiyat (₺)',
  FIELD_STOCK: 'Stok',
  FIELD_CATEGORY: 'Kategori',
  PH_CATEGORY: 'Örn. food, cosmetics, crafts',
  VAL_PRODUCT_NAME: 'Ürün adı en az 2 karakter olmalı',
  VAL_DESC_REQUIRED: 'Açıklama zorunludur',
  VAL_PRICE: 'Geçerli bir fiyat girin (0 veya üzeri)',
  VAL_STOCK: 'Stok 0 veya daha büyük bir tam sayı olmalı',
  VAL_CATEGORY: 'Kategori en az 2 karakter olmalı',

  // Ürün ekleme / düzenleme
  PAGE_ADD_PRODUCT: 'Yeni Ürün Ekle',
  BTN_SUBMIT_ADD: 'Ürünü Ekle',
  PAGE_EDIT_PRODUCT: 'Ürünü Düzenle',
  BTN_SUBMIT_EDIT: 'Değişiklikleri Kaydet',
  BACK_TO_SELLER: '← Satıcı paneline dön',

  // 404
  NOT_FOUND_TITLE: 'Sayfa bulunamadı',
  NOT_FOUND_HINT: 'Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.',
  BTN_BACK_PRODUCTS: 'Ürünlere dön',

  // Sipariş durumu etiketleri
  STATUS: {
    PENDING_PAYMENT: 'Ödeme Bekliyor',
    PAID: 'Ödendi',
    PAYMENT_FAILED: 'Ödeme Başarısız',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
  },
};
