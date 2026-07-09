import * as paymentService from '../services/payment.service.js';
import { ok } from '../utils/response.js';
import { t } from '../i18n/i18n.js';

export async function pay(req, res) {
  const { orderId, cardNumber, cardHolder, expiry, cvv } = req.body;
  const { order, paymentSuccess, reasonKey } = await paymentService.payOrder(req.user._id, orderId, {
    cardNumber,
    cardHolder,
    expiry,
    cvv,
  });

  // Reddedilen ödeme bir sunucu hatası değil, beklenen bir iş sonucudur:
  // istek başarıyla işlendi (200), sonuç data.paymentSuccess alanında taşınır.
  const message = paymentSuccess
    ? t(req.locale, 'PAYMENT_SUCCESS')
    : t(req.locale, 'PAYMENT_FAILED', t(req.locale, reasonKey));
  ok(res, { paymentSuccess, order }, message);
}
