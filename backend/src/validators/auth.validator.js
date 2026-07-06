import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('İsim 2-60 karakter olmalı'),
  body('email').trim().isEmail().withMessage('Geçerli bir email girin').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Parola en az 6 karakter olmalı'),
  body('role').optional().isIn(['customer', 'seller']).withMessage('Rol customer veya seller olabilir'),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Geçerli bir email girin').normalizeEmail(),
  body('password').notEmpty().withMessage('Parola zorunludur'),
];
