// FakePay — simüle edilmiş ödeme ağ geçidi.
//
// Mimari karar: Ödeme sağlayıcısı ayrı bir modüle soyutlandı. Gerçek bir sağlayıcıya
// (Stripe, iyzico vb.) geçişte yalnızca bu dosya bir adaptörle değiştirilir;
// payment service ve geri kalan kod aynı kalır.
//
// Test kartları:
//   4242 4242 4242 4242 → başarılı ödeme
//   4000 0000 0000 0000 → başarısız ödeme
// Diğer tüm kartlar da reddedilir.

import { MSG } from '../constants/messages.js';

const SUCCESS_CARD = '4242424242424242';

export async function charge({ cardNumber, cardHolder, expiry, cvv, amount }) {
  // Ağ gecikmesi simülasyonu (gerçek gateway çağrısı hissi)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const normalized = String(cardNumber).replace(/[\s-]/g, '');

  if (normalized === SUCCESS_CARD) {
    return {
      success: true,
      transactionId: `FP-${globalThis.crypto.randomUUID()}`,
      amount,
    };
  }

  return { success: false, reason: MSG.PAYMENT_DECLINED };
}
