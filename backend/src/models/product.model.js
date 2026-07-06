import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
      minlength: [2, 'Ürün adı en az 2 karakter olmalı'],
      maxlength: [120, 'Ürün adı en fazla 120 karakter olabilir'],
    },
    description: {
      type: String,
      required: [true, 'Açıklama zorunludur'],
      trim: true,
      maxlength: [2000, 'Açıklama en fazla 2000 karakter olabilir'],
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    stock: {
      type: Number,
      required: [true, 'Stok zorunludur'],
      min: [0, 'Stok negatif olamaz'],
      validate: { validator: Number.isInteger, message: 'Stok tam sayı olmalı' },
    },
    category: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      trim: true,
      lowercase: true, // filtrelemede büyük/küçük harf sorunu yaşanmasın
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // satıcının kendi ürünlerini listelemesi sık yapılan sorgu
    },
  },
  { timestamps: true }
);

// Kategori filtrelemesi için index
productSchema.index({ category: 1 });

productSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model('Product', productSchema);
