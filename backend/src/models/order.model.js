import mongoose from 'mongoose';

export const ORDER_STATUSES = ['PENDING_PAYMENT', 'PAID', 'PAYMENT_FAILED', 'SHIPPED', 'DELIVERED'];

// Sipariş kalemleri SNAPSHOT olarak tutulur: ürünün adı/fiyatı sonradan değişse
// veya ürün silinse bile sipariş kaydı olduğu gibi kalır (mimari karar).
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    // Satıcının "gelen siparişlerim" sorgusu için item bazında satıcı bilgisi
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'PENDING_PAYMENT' },
    // Ödeme sonucu: yalnızca işlem referansı tutulur — KART BİLGİSİ ASLA SAKLANMAZ
    paymentResult: {
      type: new mongoose.Schema(
        { transactionId: String, processedAt: Date },
        { _id: false }
      ),
      default: undefined,
    },
    // Eşzamanlılık kilidi: aynı siparişe iki ödeme isteği aynı anda gelirse
    // yalnızca biri kilidi atomik olarak alabilir (bkz. payment.service.js).
    // İç alan — API cevaplarında gösterilmez (toJSON'da temizlenir).
    paymentInProgress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Seller'ın kendisine gelen siparişleri sorgulaması için index
orderSchema.index({ 'items.sellerId': 1 });

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.paymentInProgress; // iç kilit alanı, istemciyi ilgilendirmez
    return ret;
  },
});

export const Order = mongoose.model('Order', orderSchema);
