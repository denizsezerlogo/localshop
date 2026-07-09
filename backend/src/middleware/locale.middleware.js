import { resolveLocale } from '../i18n/i18n.js';

// Her isteğin dilini en başta çözer; sonraki tüm katmanlar req.locale kullanır
export function localeMiddleware(req, res, next) {
  req.locale = resolveLocale(req);
  next();
}
