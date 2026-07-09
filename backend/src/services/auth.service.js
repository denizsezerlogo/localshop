// İş kuralları katmanı: HTTP'den bağımsız, yalnızca "ne yapılacağını" bilir.
// Controller'lar ince kalır, kurallar burada toplanır.
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { MSG } from '../constants/messages.js';

// JWT üretimi: payload'da yalnızca id ve role taşınır (hassas veri koymayız)
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, MSG.AUTH_EMAIL_TAKEN);

  const user = await User.create({ name, email, password, role });
  return { user, token: signToken(user) };
}

export async function login({ email, password }) {
  // password şemada select:false → login için açıkça istememiz gerekir
  const user = await User.findOne({ email }).select('+password');
  const valid = user && (await user.comparePassword(password));

  // "Kullanıcı yok" ile "parola yanlış" ayrımı bilerek yapılmaz (bilgi sızdırmama)
  if (!valid) throw new ApiError(401, MSG.AUTH_BAD_CREDENTIALS);

  return { user, token: signToken(user) };
}
