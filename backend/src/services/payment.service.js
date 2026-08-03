import { Order } from '../models/order.model.js';
import { ApiError } from '../utils/ApiError.js';
import * as fakePay from './fakePay.service.js';
import { reserveStock, releaseStock } from './stock.service.js';

export async function payOrder(userId, orderId, card) {
  // 1) Siparişi ATOMİK olarak sahiplen: durum uygunsa ve başka bir ödeme
  //    işlemde değilse kilidi al. Aynı siparişe eşzamanlı gelen ikinci istek
  //    bu filtreyle eşleşemez ve çift tahsilat imkânsızlaşır.
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      userId,
      status: { $in: ['PENDING_PAYMENT', 'PAYMENT_FAILED'] },
      paymentInProgress: { $ne: true },
    },
    { $set: { paymentInProgress: true } },
    { new: true }
  );

  if (!order) {
    // Kilit alınamadı — nedenini ayırt edip doğru hatayı dön:
    const existing = await Order.findById(orderId);
    if (!existing) throw new ApiError(404, 'ORDER_NOT_FOUND');
    if (existing.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'PAYMENT_NOT_YOURS');
    }
    // Ödenemez durumda ya da başka bir ödeme isteği hâlâ işlemde
    throw new ApiError(400, 'PAYMENT_NOT_PAYABLE');
  }

  try {
    // 2) Stok ödeme anında atomik olarak rezerve edilir; yetersizse ödeme hiç denenmez.
    const reserved = await reserveStock(order.items);

    // 3) Tutar HER ZAMAN sipariş kaydından okunur — client'tan gelen tutara güvenilmez.
    //    Gateway beklenmedik şekilde patlarsa rezervasyon iade edilir (stok sızmaz).
    let result;
    try {
      result = await fakePay.charge({ ...card, amount: order.totalPrice });
    } catch (err) {
      await releaseStock(reserved);
      throw err;
    }

    // GÜVENLİK: Kart bilgileri bilinçli olarak veritabanına yazılmaz ve loglanmaz.
    // Siparişe yalnızca işlem referansı kaydedilir.
    if (result.success) {
      order.status = 'PAID';
      order.paymentResult = { transactionId: result.transactionId, processedAt: new Date() };
    } else {
      // Ödeme reddedildi → rezervasyon anında iade edilir, sipariş tekrar denenebilir
      await releaseStock(reserved);
      order.status = 'PAYMENT_FAILED';
    }

    order.paymentInProgress = false;
    await order.save();
    return { order, paymentSuccess: result.success, reasonKey: result.reasonKey };
  } catch (err) {
    // Her hata yolunda kilit geri bırakılır ki sipariş ödenebilir kalsın
    await Order.updateOne({ _id: order._id }, { $set: { paymentInProgress: false } }).catch(() => {});
    throw err;
  }
}
