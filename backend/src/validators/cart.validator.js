import { body, param } from 'express-validator';
import { vt } from '../i18n/i18n.js';

export const addItemRules = [
  body('productId').isMongoId().withMessage(vt('VAL_PRODUCT_ID')),
  body('quantity').isInt({ min: 1, max: 999 }).withMessage(vt('VAL_QUANTITY')).toInt(),
];

export const updateItemRules = [
  param('productId').isMongoId().withMessage(vt('VAL_PRODUCT_ID')),
  body('quantity').isInt({ min: 1, max: 999 }).withMessage(vt('VAL_QUANTITY')).toInt(),
];

export const productIdParamRule = [
  param('productId').isMongoId().withMessage(vt('VAL_PRODUCT_ID')),
];
