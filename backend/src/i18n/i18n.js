// Çok dillilik çekirdeği.
//
// Mimari: Servis katmanı asla hazır metin üretmez; ApiError anahtar + parametre taşır.
// Metne çeviri en dış katmanda (errorHandler ve controller'lar) istek diline göre yapılır.
// Böylece iş kuralları dil bilgisinden tamamen bağımsız kalır.
import { tr } from '../constants/locales/tr.js';
import { en } from '../constants/locales/en.js';

const CATALOGS = { tr, en };
export const DEFAULT_LOCALE = 'tr';
export const SUPPORTED_LOCALES = Object.keys(CATALOGS);

// Accept-Language başlığından desteklenen dili seçer (varsayılan: tr)
export function resolveLocale(req) {
  const raw = (req.headers['accept-language'] || '').toLowerCase();
  for (const locale of SUPPORTED_LOCALES) {
    if (raw.startsWith(locale)) return locale;
  }
  return DEFAULT_LOCALE;
}

// Anahtarı istek diline çevirir; bilinmeyen anahtar için önce varsayılan dile,
// o da yoksa anahtarın kendisine düşer (asla boş mesaj dönmez).
export function t(locale, key, ...args) {
  const entry = CATALOGS[locale]?.[key] ?? CATALOGS[DEFAULT_LOCALE][key] ?? key;
  return typeof entry === 'function' ? entry(...args) : entry;
}

// express-validator withMessage için yardımcı: mesajı istek anında, istek diline göre üretir.
// Kullanım: body('email').isEmail().withMessage(vt('VAL_EMAIL'))
export const vt = (key) => (value, { req }) => t(req?.locale ?? DEFAULT_LOCALE, key);
