import rateLimit from 'express-rate-limit';
import { t, DEFAULT_LOCALE } from '../i18n/i18n.js';

// Test koşularında limitler devre dışına yakın gevşetilir; aksi halde
// art arda çalışan senaryolar 429'a takılıp yanlış negatif üretir.
const isTest = process.env.NODE_ENV === 'test';

// Limit mesajları istek anında, istek dilinde üretilir
const limitedMessage = (key) => (req) => ({
  success: false,
  data: null,
  message: t(req.locale ?? DEFAULT_LOCALE, key),
});

// Genel limit: IP başına 15 dakikada 300 istek
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 100000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitedMessage('RATE_LIMITED'),
});

// Ödeme endpoint'i için sıkı limit (kart deneme saldırısı önlemi)
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 100000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitedMessage('RATE_LIMITED_PAYMENT'),
});

// Auth endpointleri için daha sıkı limit (brute-force önlemi)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 100000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: limitedMessage('RATE_LIMITED_AUTH'),
});
