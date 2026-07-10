// Giriş noktası: env yükleme → doğrulama → DB bağlantısı → sunucuyu dinlemeye alma
// app.js'ten ayrı tutulur ki app testlerde sunucu açmadan import edilebilsin.
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

// Kritik env değişkenleri yoksa hiç başlamadan, anlaşılır bir hatayla dur (fail fast)
const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Eksik environment değişkenleri: ${missing.join(', ')} — .env dosyasını kontrol edin`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

await connectDB(process.env.MONGO_URI);

const server = app.listen(PORT, () => {
  console.log(`LocalShop API http://localhost:${PORT} üzerinde çalışıyor (${process.env.NODE_ENV || 'development'})`);
});

// Düzgün kapanış (graceful shutdown): sinyal geldiğinde yeni istek almayı bırak,
// devam eden istekleri tamamla, DB bağlantısını kapat, öyle çık.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\n${signal} alındı, sunucu kapatılıyor…`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  });
}
