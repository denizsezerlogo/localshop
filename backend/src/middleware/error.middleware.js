import { ApiError } from '../utils/ApiError.js';
import { t, DEFAULT_LOCALE } from '../i18n/i18n.js';

// Hiçbir route eşleşmezse 404 üret
export function notFound(req, res, next) {
  next(new ApiError(404, 'NOT_FOUND_ROUTE', req.method, req.originalUrl));
}

// Merkezi hata yakalayıcı: TÜM hatalar tek formatta ve istek dilinde döner.
// Express 5'te async handler'larda fırlayan hatalar otomatik olarak buraya iletilir.
export function errorHandler(err, req, res, next) {
  const locale = req.locale ?? DEFAULT_LOCALE;
  let statusCode = 500;
  let message = t(locale, 'SERVER_ERROR');

  // Bizim fırlattığımız hatalar: anahtar + parametre → istek dilinde metin
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = t(locale, err.key, ...err.params);
  }

  // Mongoose: geçersiz ObjectId (örn. GET /api/products/abc)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = t(locale, 'INVALID_ID');
  }
  // Mongoose: şema validasyon hatası (güvenlik ağı — kullanıcıya dönen asıl
  // validasyon express-validator katmanındadır ve çok dillidir)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  // MongoDB: unique alan çakışması (örn. kayıtlı email)
  if (err.code === 11000) {
    statusCode = 409;
    message = t(locale, 'DUPLICATE_RECORD');
  }
  // JWT hataları
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = t(locale, 'AUTH_INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = t(locale, 'AUTH_TOKEN_EXPIRED');
  }

  // Beklenmeyen hataları logla (test sırasında sessiz)
  if (statusCode === 500 && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    // Stack trace yalnızca development'ta döner — production'da iç detay sızdırılmaz
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
