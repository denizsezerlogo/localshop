// Controller katmanı: HTTP isteğini alır, servisi çağırır, cevabı İSTEK DİLİNDE döner.
import * as authService from '../services/auth.service.js';
import { ok } from '../utils/response.js';
import { t } from '../i18n/i18n.js';

export async function register(req, res) {
  // Yalnızca beklenen alanları alırız — body'nin tamamını modele geçirmeyiz
  const { name, email, password, role } = req.body;
  const { user, token } = await authService.register({ name, email, password, role });
  ok(res, { user, token }, t(req.locale, 'AUTH_REGISTERED'), 201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  ok(res, { user, token }, t(req.locale, 'AUTH_LOGGED_IN'));
}

export async function me(req, res) {
  // protect middleware'i req.user'ı doldurdu
  ok(res, { user: req.user });
}
