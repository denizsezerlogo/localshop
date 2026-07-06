import { body, param } from 'express-validator';

export const addItemRules = [
  body('productId').isMongoId().withMessage('Geçersiz ürün id\'si'),
  body('quantity').isInt({ min: 1, max: 999 }).withMessage('Adet 1-999 arası bir tam sayı olmalı').toInt(),
];

export const updateItemRules = [
  param('productId').isMongoId().withMessage('Geçersiz ürün id\'si'),
  body('quantity').isInt({ min: 1, max: 999 }).withMessage('Adet 1-999 arası bir tam sayı olmalı').toInt(),
];

export const productIdParamRule = [
  param('productId').isMongoId().withMessage('Geçersiz ürün id\'si'),
];
