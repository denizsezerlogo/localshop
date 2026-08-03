import { body } from 'express-validator';
import { vt } from '../i18n/i18n.js';

// Not: normalizeEmail() bilinçli olarak KULLANILMIYOR. İki bilinen sorunu var:
// local part'ı tamamen subaddress olan gmail adreslerinde (+ayse@gmail.com)
// boolean false döndürür ve gmail noktalarını silerek farklı adresleri tek
// hesaba çökertir. Küçük harfe çevirme yeterli ve güvenli normalizasyondur
// (model tarafında da lowercase: true ile ikinci katman mevcut).
export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage(vt('VAL_NAME_LENGTH')),
  body('email').trim().toLowerCase().isEmail().withMessage(vt('VAL_EMAIL')),
  body('password').isLength({ min: 6 }).withMessage(vt('VAL_PASSWORD_MIN')),
  body('role').optional().isString().isIn(['customer', 'seller']).withMessage(vt('VAL_ROLE')),
];

export const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage(vt('VAL_EMAIL')),
  body('password').notEmpty().withMessage(vt('VAL_PASSWORD_REQUIRED')),
];
