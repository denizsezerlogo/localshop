import { body, param, query } from 'express-validator';
import { vt } from '../i18n/i18n.js';

export const idRule = [param('id').isMongoId().withMessage(vt('VAL_ORDER_ID'))];

export const listQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage(vt('VAL_PAGE')),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage(vt('VAL_LIMIT')),
];

// Seller yalnızca kargo durumlarını set edebilir; ödeme durumları payment servisinden geçer
export const statusRules = [
  body('status').isIn(['SHIPPED', 'DELIVERED']).withMessage(vt('VAL_ORDER_STATUS')),
];
