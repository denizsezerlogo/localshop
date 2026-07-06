import { ApiError } from '../utils/ApiError.js';

// Hiçbir route eşleşmezse 404 üret
export function notFound(req, res, next) {
  next(new ApiError(404, `Bulunamadı: ${req.method} ${req.originalUrl}`));
}

// Merkezi hata yakalayıcı: TÜM hatalar tek formatta döner.
// Express 5'te async handler'larda fırlayan hatalar otomatik olarak buraya iletilir.
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Sunucu hatası';

  // Mongoose: geçersiz ObjectId (örn. GET /api/products/abc)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Geçersiz id formatı';
  }
  // Mongoose: şema validasyon hatası
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  // MongoDB: unique alan çakışması (örn. kayıtlı email)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Bu kayıt zaten mevcut';
  }
  // JWT hataları
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Geçersiz token, lütfen tekrar giriş yapın';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Oturum süresi doldu, lütfen tekrar giriş yapın';
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
