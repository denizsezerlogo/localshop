// Kategoriler sabit, canonical anahtarlardır (veri tutarlılığı için).
// Görünen ad çeviriye tabidir ve frontend sözlüklerinde tutulur;
// API her zaman bu anahtarlarla çalışır (örn. GET /api/products?category=food).
export const CATEGORIES = ['food', 'cosmetics', 'crafts', 'textile', 'home', 'other'];
