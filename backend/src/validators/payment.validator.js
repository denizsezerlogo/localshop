import { body } from 'express-validator';
import { vt } from '../i18n/i18n.js';

export const payRules = [
  body('orderId').isMongoId().withMessage(vt('VAL_ORDER_ID')),
  body('cardNumber')
    .customSanitizer((v) => String(v).replace(/[\s-]/g, '')) // boşluk ve tire kabul edilir
    .matches(/^\d{13,19}$/)
    .withMessage(vt('VAL_CARD_NUMBER')),
  body('cardHolder').trim().isLength({ min: 2, max: 60 }).withMessage(vt('VAL_CARD_HOLDER')),
  body('expiry')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage(vt('VAL_EXPIRY_FORMAT'))
    .custom((value) => {
      const [mm, yy] = value.split('/').map(Number);
      const endOfMonth = new Date(2000 + yy, mm, 0, 23, 59, 59); // ayın son günü
      return endOfMonth >= new Date();
    })
    .withMessage(vt('VAL_EXPIRY_PAST')),
  body('cvv').matches(/^\d{3,4}$/).withMessage(vt('VAL_CVV')),
];
