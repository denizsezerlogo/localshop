import { body } from 'express-validator';
import { vt } from '../i18n/i18n.js';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage(vt('VAL_NAME_LENGTH')),
  body('email').trim().isEmail().withMessage(vt('VAL_EMAIL')).normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage(vt('VAL_PASSWORD_MIN')),
  body('role').optional().isIn(['customer', 'seller']).withMessage(vt('VAL_ROLE')),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage(vt('VAL_EMAIL')).normalizeEmail(),
  body('password').notEmpty().withMessage(vt('VAL_PASSWORD_REQUIRED')),
];
