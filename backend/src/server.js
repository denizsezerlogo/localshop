// Giriş noktası: env yükleme → doğrulama → DB bağlantısı → sunucuyu dinlemeye alma
// app.js'ten ayrı tutulur ki app testlerde sunucu açmadan import edilebilsin.
import 'dotenv/config';
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

app.listen(PORT, () => {
  console.log(`LocalShop API http://localhost:${PORT} üzerinde çalışıyor (${process.env.NODE_ENV || 'development'})`);
});
