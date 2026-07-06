import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB bağlantısı kuruldu: ${mongoose.connection.name}`);
  } catch (err) {
    // DB yoksa uygulama çalışamaz → anlaşılır mesajla kapan
    console.error('MongoDB bağlantısı kurulamadı:', err.message);
    console.error('İpucu: MongoDB çalışıyor mu? → brew services start mongodb-community');
    process.exit(1);
  }
}
