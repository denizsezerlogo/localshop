// Test ortamı: .env yerine burada tanımlanan değerler kullanılır.
// Testler AYRI bir veritabanında çalışır (localshop_test) — geliştirme verisine dokunmaz.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-not-for-production';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/localshop_test';
