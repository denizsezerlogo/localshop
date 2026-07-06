import { body } from 'express-validator';

export const payRules = [
  body('orderId').isMongoId().withMessage('Geçersiz sipariş id\'si'),
  body('cardNumber')
    .customSanitizer((v) => String(v).replace(/[\s-]/g, '')) // boşluk ve tire kabul edilir
    .matches(/^\d{13,19}$/)
    .withMessage('Kart numarası 13-19 haneli olmalı'),
  body('cardHolder').trim().isLength({ min: 2, max: 60 }).withMessage('Kart sahibi adı 2-60 karakter olmalı'),
  body('expiry')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage('Son kullanma tarihi AA/YY formatında olmalı')
    .custom((value) => {
      const [mm, yy] = value.split('/').map(Number);
      const endOfMonth = new Date(2000 + yy, mm, 0, 23, 59, 59); // ayın son günü
      if (endOfMonth < new Date()) throw new Error('Kartın süresi dolmuş');
      return true;
    }),
  body('cvv').matches(/^\d{3,4}$/).withMessage('CVV 3-4 haneli olmalı'),
];
