// Kullanıcıya gösterilen geri bildirim mesajları tek yerde toplanır
// (backend'deki src/constants/messages.js ile aynı yaklaşım — i18n'e hazır).
// Buton ve form etiketleri gibi ekrana sıkı bağlı UI metinleri bileşenlerinde bırakıldı;
// yükleme, hata, boş durum, onay ve bilgilendirme mesajları buradadır.
// Parametreli mesajlar template fonksiyonudur: MSG.STOCK_LAST(3)

export const MSG = {
  // Genel
  GENERIC_ERROR: 'Bir şeyler ters gitti, lütfen tekrar deneyin',
  ERROR_FALLBACK: 'Bir şeyler ters gitti.',
  RETRY: 'Tekrar dene',
  LOADING: 'Yükleniyor…',

  // Yükleme durumları
  LOADING_PRODUCTS: 'Ürünler yükleniyor…',
  LOADING_PRODUCT: 'Ürün yükleniyor…',
  LOADING_ORDERS: 'Siparişler yükleniyor…',
  LOADING_ORDER: 'Sipariş yükleniyor…',

  // Meşgul buton durumları
  BUSY_LOGIN: 'Giriş yapılıyor…',
  BUSY_REGISTER: 'Kayıt yapılıyor…',
  BUSY_SAVING: 'Kaydediliyor…',
  BUSY_ADDING: 'Ekleniyor…',
  BUSY_CHECKOUT: 'Sipariş oluşturuluyor…',
  BUSY_PAYING: 'Ödeme işleniyor…',

  // Katalog
  EMPTY_PRODUCTS_TITLE: 'Ürün bulunamadı',
  EMPTY_PRODUCTS_HINT: 'Arama veya filtre kriterlerini değiştirmeyi deneyin.',
  STOCK_OUT: 'Tükendi',
  STOCK_OUT_DETAIL: 'Bu ürün tükendi',
  STOCK_LAST: (count) => `Son ${count} adet`,
  STOCK_AVAILABLE: (count) => `Stok: ${count} adet`,
  SELLER_CANNOT_SHOP: 'Satıcı hesabıyla alışveriş yapılamaz.',

  // Sepet
  CART_ITEM_ADDED: 'Ürün sepete eklendi.',
  EMPTY_CART_TITLE: 'Sepetiniz boş',
  EMPTY_CART_HINT: 'Ürünleri keşfedip sepetinize ekleyin.',

  // Siparişler
  EMPTY_ORDERS_TITLE: 'Henüz siparişiniz yok',
  EMPTY_ORDERS_HINT: 'İlk siparişinizi vermek için ürünlere göz atın.',

  // Ödeme
  PAYMENT_SUCCESS_TITLE: 'Ödeme Başarılı 🎉',
  PAYMENT_SUCCESS_DETAIL: (orderCode) => `Sipariş #${orderCode} için ödemeniz alındı.`,
  PAYMENT_FAILED_RETRY: (message) => `${message} — kartınızı kontrol edip tekrar deneyebilirsiniz.`,
  ORDER_NOT_PAYABLE_TITLE: 'Bu sipariş ödenemez',
  ORDER_NOT_PAYABLE_HINT: 'Sipariş ödemeye uygun durumda değil.',

  // Satıcı paneli
  EMPTY_SELLER_PRODUCTS_TITLE: 'Henüz ürününüz yok',
  EMPTY_SELLER_PRODUCTS_HINT: 'İlk ürününüzü ekleyerek satışa başlayın.',
  EMPTY_SELLER_ORDERS_TITLE: 'Henüz sipariş yok',
  EMPTY_SELLER_ORDERS_HINT: 'Ürünleriniz sipariş aldığında burada listelenir.',
  DELETE_PRODUCT_CONFIRM: (name) => `'${name}' silinsin mi? Bu işlem geri alınamaz.`,

  // 404
  NOT_FOUND_TITLE: 'Sayfa bulunamadı',
  NOT_FOUND_HINT: 'Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.',
};

// Sipariş durumu etiketleri (StatusBadge)
export const STATUS_LABELS = {
  PENDING_PAYMENT: 'Ödeme Bekliyor',
  PAID: 'Ödendi',
  PAYMENT_FAILED: 'Ödeme Başarısız',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim Edildi',
};
