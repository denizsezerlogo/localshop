import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { MSG } from '../constants/messages.js';

// Korumalı endpointler için: geçerli JWT ister, kullanıcıyı req.user'a koyar
export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, MSG.AUTH_REQUIRED);
  }

  const token = header.split(' ')[1];
  // Token geçersiz/süresi dolmuşsa jwt.verify fırlatır → errorHandler 401'e çevirir
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, MSG.AUTH_USER_GONE);

  req.user = user;
  next();
}

// Rol bazlı yetkilendirme — her zaman protect'ten SONRA kullanılır.
// Kullanım: router.post('/', protect, authorize('seller'), ...)
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, MSG.AUTH_FORBIDDEN);
    }
    next();
  };
}
