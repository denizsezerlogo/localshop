import rateLimit from 'express-rate-limit';

// Genel limit: IP başına 15 dakikada 300 istek
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin' },
});

// Auth endpointleri için daha sıkı limit (brute-force önlemi)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Çok fazla deneme yapıldı, lütfen 15 dakika sonra tekrar deneyin' },
});
