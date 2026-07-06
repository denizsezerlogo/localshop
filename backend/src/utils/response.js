// Tüm endpointlerde aynı başarı formatı: { success, data, message }
// Tutarlı response yapısı hem frontend'i basitleştirir hem API'yi öngörülebilir kılar.
export function ok(res, data = null, message = '', statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message });
}
