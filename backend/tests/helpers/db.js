import mongoose from 'mongoose';

// Her test dosyası başında bağlanır ve test veritabanını sıfırlar
export async function connectTestDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await mongoose.connection.db.dropDatabase();
}

export async function disconnectTestDb() {
  await mongoose.disconnect();
}
