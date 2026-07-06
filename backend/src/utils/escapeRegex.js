// Kullanıcı girdisini regex'e gömmeden önce özel karakterleri etkisizleştirir.
// Böylece arama parametresiyle regex injection / ReDoS yapılamaz (güvenlik).
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
