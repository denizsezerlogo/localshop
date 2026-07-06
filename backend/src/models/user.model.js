import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim zorunludur'],
      trim: true,
      minlength: [2, 'İsim en az 2 karakter olmalı'],
      maxlength: [60, 'İsim en fazla 60 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Parola zorunludur'],
      minlength: [6, 'Parola en az 6 karakter olmalı'],
      select: false, // sorgularda parola hash'i varsayılan olarak DÖNMEZ (güvenlik gereksinimi)
    },
    role: {
      type: String,
      enum: ['customer', 'seller'],
      default: 'customer',
    },
  },
  { timestamps: true } // createdAt + updatedAt otomatik
);

// Kaydetmeden önce parolayı hash'le — düz metin parola asla veritabanına yazılmaz
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Login sırasında parola karşılaştırma
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// JSON'a çevrilirken hassas/gereksiz alanları temizle (ekstra güvenlik katmanı)
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
