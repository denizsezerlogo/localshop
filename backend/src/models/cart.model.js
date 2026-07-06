import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Adet en az 1 olmalı'],
      validate: { validator: Number.isInteger, message: 'Adet tam sayı olmalı' },
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    // Her kullanıcının TEK sepeti olur (unique)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Cart = mongoose.model('Cart', cartSchema);
