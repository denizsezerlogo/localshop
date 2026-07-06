import { body, param, query } from 'express-validator';

export const idRule = [param('id').isMongoId().withMessage('Geçersiz sipariş id\'si')];

export const listQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page 1 veya daha büyük olmalı'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit 1-50 arası olmalı'),
];

// Seller yalnızca kargo durumlarını set edebilir; ödeme durumları payment servisinden geçer
export const statusRules = [
  body('status').isIn(['SHIPPED', 'DELIVERED']).withMessage('Durum yalnızca SHIPPED veya DELIVERED olabilir'),
];
