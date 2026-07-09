// Express uygulaması: middleware zinciri + route'lar + hata yönetimi
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';
import { localeMiddleware } from './middleware/locale.middleware.js';

const app = express();

// --- Güvenlik ve temel middleware'ler ---
app.use(helmet()); // güvenlik HTTP header'ları
app.use(
  cors({
    // CORS kontrolü: yalnızca frontend origin'ine izin ver
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json({ limit: '10kb' })); // JSON body parser (aşırı büyük body'leri reddet)
app.use(localeMiddleware); // istek dili (Accept-Language) — limiter dahil tüm katmanlardan önce
app.use(generalLimiter); // rate limiting (genel)

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev')); // istek logları (test sırasında sessiz)
}

// --- API route'ları ---
app.use('/api', routes);

// --- 404 + merkezi hata yönetimi (her zaman en sonda) ---
app.use(notFound);
app.use(errorHandler);

export default app;
