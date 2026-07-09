import { body, param, query } from 'express-validator';
import { vt } from '../i18n/i18n.js';

export const idRule = [param('id').isMongoId().withMessage(vt('VAL_PRODUCT_ID'))];

export const listQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage(vt('VAL_PAGE')),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage(vt('VAL_LIMIT')),
  query('category').optional().trim().isLength({ max: 60 }),
  query('search').optional().trim().isLength({ max: 100 }).withMessage(vt('VAL_SEARCH_MAX')),
];

export const createRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage(vt('VAL_PRODUCT_NAME')),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage(vt('VAL_PRODUCT_DESC')),
  body('price').isFloat({ min: 0 }).withMessage(vt('VAL_PRICE')).toFloat(),
  body('stock').isInt({ min: 0 }).withMessage(vt('VAL_STOCK')).toInt(),
  body('category').trim().isLength({ min: 2, max: 60 }).withMessage(vt('VAL_CATEGORY')),
];

// Güncellemede tüm alanlar opsiyonel (kısmi güncelleme desteklenir)
export const updateRules = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }).withMessage(vt('VAL_PRODUCT_NAME')),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage(vt('VAL_PRODUCT_DESC')),
  body('price').optional().isFloat({ min: 0 }).withMessage(vt('VAL_PRICE')).toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage(vt('VAL_STOCK')).toInt(),
  body('category').optional().trim().isLength({ min: 2, max: 60 }).withMessage(vt('VAL_CATEGORY')),
];
