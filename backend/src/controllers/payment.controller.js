import * as paymentService from '../services/payment.service.js';
import { ok } from '../utils/response.js';

export async function pay(req, res) {
  const { orderId, cardNumber, cardHolder, expiry, cvv } = req.body;
  const { order, paymentSuccess, reason } = await paymentService.payOrder(req.user._id, orderId, {
    cardNumber,
    cardHolder,
    expiry,
    cvv,
  });

  // Reddedilen ödeme bir sunucu hatası değil, beklenen bir iş sonucudur:
  // istek başarıyla işlendi (200), sonuç data.paymentSuccess alanında taşınır.
  ok(res, { paymentSuccess, order }, paymentSuccess ? 'Ödeme başarılı' : `Ödeme başarısız: ${reason}`);
}
