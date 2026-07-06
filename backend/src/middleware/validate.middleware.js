import { validationResult } from 'express-validator';

// Validator kurallarından sonra çalışır; kural ihlali varsa 400 döner.
// Böylece geçersiz veri controller/service katmanına hiç ulaşmaz.
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  res.status(400).json({
    success: false,
    data: { errors },
    message: errors[0].message,
  });
}
