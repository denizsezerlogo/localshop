import { body, param, query } from 'express-validator';

export const idRule = [param('id').isMongoId().withMessage('Geçersiz ürün id\'si')];

export const listQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page 1 veya daha büyük olmalı'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit 1-50 arası olmalı'),
  query('category').optional().trim().isLength({ max: 60 }),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Arama en fazla 100 karakter olabilir'),
];

export const createRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Ürün adı 2-120 karakter olmalı'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Açıklama 1-2000 karakter olmalı'),
  body('price').isFloat({ min: 0 }).withMessage('Fiyat 0 veya daha büyük bir sayı olmalı').toFloat(),
  body('stock').isInt({ min: 0 }).withMessage('Stok 0 veya daha büyük bir tam sayı olmalı').toInt(),
  body('category').trim().isLength({ min: 2, max: 60 }).withMessage('Kategori 2-60 karakter olmalı'),
];

// Güncellemede tüm alanlar opsiyonel (kısmi güncelleme desteklenir)
export const updateRules = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Ürün adı 2-120 karakter olmalı'),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Açıklama 1-2000 karakter olmalı'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Fiyat 0 veya daha büyük bir sayı olmalı').toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stok 0 veya daha büyük bir tam sayı olmalı').toInt(),
  body('category').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Kategori 2-60 karakter olmalı'),
];
