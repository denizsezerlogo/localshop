import rateLimit from 'express-rate-limit';
import { MSG } from '../constants/messages.js';

// Genel limit: IP başına 15 dakikada 300 istek
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: MSG.RATE_LIMITED },
});

// Ödeme endpoint'i için sıkı limit (kart deneme saldırısı önlemi)
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: MSG.RATE_LIMITED_PAYMENT },
});

// Auth endpointleri için daha sıkı limit (brute-force önlemi)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: MSG.RATE_LIMITED_AUTH },
});
