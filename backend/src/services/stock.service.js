// Stok rezervasyon servisi.
//
// Mimari karar: Stok, sipariş OLUŞTURULURKEN değil, ÖDEME ANINDA rezerve edilir.
// Böylece yarım bırakılan (PENDING_PAYMENT) veya reddedilen (PAYMENT_FAILED)
// siparişler stok kilitleyemez; ek bir zamanlanmış temizlik görevi gerekmez.
// Ödeme reddedilirse rezervasyon anında iade edilir.
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';

// Sipariş kalemleri için stoğu atomik olarak rezerve eder.
// Koşullu update (stock >= quantity şartıyla $inc) sayesinde aynı anda gelen
// iki ödeme aynı stoğu tüketemez. Bir kalem rezerve edilemezse önceden
// rezerve edilenler iade edilir ve anlaşılır bir hata fırlatılır.
export async function reserveStock(items) {
  const reserved = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (result.modifiedCount === 0) {
      await releaseStock(reserved);
      throw new ApiError(400, 'ORDER_STOCK_RACE', item.name);
    }
    reserved.push({ productId: item.productId, quantity: item.quantity });
  }
  return reserved;
}

// Rezerve edilmiş stoğu iade eder (ödeme reddedildiğinde)
export async function releaseStock(items) {
  for (const item of items) {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
  }
}
