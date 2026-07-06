// Demo/test verisi oluşturur: npm run seed
// DİKKAT: Mevcut tüm veriyi siler!
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model.js';
import { Product } from '../src/models/product.model.js';
import { Cart } from '../src/models/cart.model.js';
import { Order } from '../src/models/order.model.js';

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI bulunamadı — .env dosyasını kontrol edin');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log(`Bağlandı: ${mongoose.connection.name}`);

await Promise.all([User.deleteMany({}), Product.deleteMany({}), Cart.deleteMany({}), Order.deleteMany({})]);
console.log('Mevcut veriler temizlendi');

// User.create() tek tek save() çalıştırır → parolalar hash'lenir
const [ayse, mehmet] = await User.create([
  { name: 'Ayşe Yılmaz', email: 'ayse@localshop.dev', password: 'sifre123', role: 'seller' },
  { name: 'Mehmet Demir', email: 'mehmet@localshop.dev', password: 'sifre123', role: 'seller' },
]);
await User.create([
  { name: 'Deniz Sezer', email: 'deniz@localshop.dev', password: 'sifre123', role: 'customer' },
  { name: 'Elif Kaya', email: 'elif@localshop.dev', password: 'sifre123', role: 'customer' },
]);

await Product.create([
  { name: 'Organik Çiçek Balı', description: 'Yüksek yayladan, katkısız 500g çiçek balı.', price: 250, stock: 20, category: 'food', sellerId: ayse._id },
  { name: 'Soğuk Sıkım Zeytinyağı', description: 'Erken hasat, soğuk sıkım 1L zeytinyağı.', price: 320, stock: 15, category: 'food', sellerId: ayse._id },
  { name: 'Köy Cevizi', description: 'Bu sezon hasadı, kabuklu 1kg ceviz.', price: 180, stock: 30, category: 'food', sellerId: ayse._id },
  { name: 'Kuru Kayısı', description: 'Malatya kayısısı, gün kurusu 500g.', price: 140, stock: 25, category: 'food', sellerId: ayse._id },
  { name: 'Keçi Peyniri', description: 'Tam yağlı, olgunlaştırılmış 350g keçi peyniri.', price: 210, stock: 12, category: 'food', sellerId: mehmet._id },
  { name: 'Lavanta Sabunu', description: 'El yapımı, doğal lavanta yağlı sabun.', price: 60, stock: 50, category: 'cosmetics', sellerId: mehmet._id },
  { name: 'Gül Suyu', description: 'Isparta gülünden geleneksel yöntemle 250ml.', price: 85, stock: 40, category: 'cosmetics', sellerId: mehmet._id },
  { name: 'Zeytinyağlı Sabun', description: 'Saf zeytinyağından el yapımı sabun, 3 adet.', price: 95, stock: 35, category: 'cosmetics', sellerId: ayse._id },
  { name: 'El Yapımı Seramik Kupa', description: 'Tornada şekillendirilmiş, sırlı seramik kupa.', price: 220, stock: 10, category: 'crafts', sellerId: mehmet._id },
  { name: 'Dokuma Pazar Çantası', description: 'Doğal pamuk ipinden el dokuması çanta.', price: 175, stock: 18, category: 'crafts', sellerId: mehmet._id },
]);

console.log('\nSeed tamamlandı ✔');
console.log('Hesaplar (hepsinin parolası: sifre123):');
console.log('  seller   → ayse@localshop.dev, mehmet@localshop.dev');
console.log('  customer → deniz@localshop.dev, elif@localshop.dev');
console.log('10 ürün eklendi (food / cosmetics / crafts)');

await mongoose.disconnect();
