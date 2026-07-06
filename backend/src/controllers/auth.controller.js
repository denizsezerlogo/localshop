// Controller katmanı: HTTP isteğini alır, servisi çağırır, cevabı döner. İş kuralı içermez.
import * as authService from '../services/auth.service.js';
import { ok } from '../utils/response.js';

export async function register(req, res) {
  // Yalnızca beklenen alanları alırız — body'nin tamamını modele geçirmeyiz
  const { name, email, password, role } = req.body;
  const { user, token } = await authService.register({ name, email, password, role });
  ok(res, { user, token }, 'Kayıt başarılı', 201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  ok(res, { user, token }, 'Giriş başarılı');
}

export async function me(req, res) {
  // protect middleware'i req.user'ı doldurdu
  ok(res, { user: req.user });
}
