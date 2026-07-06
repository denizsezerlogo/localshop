// Bilinçli olarak fırlattığımız, HTTP status kodu taşıyan hata tipi.
// Kullanım: throw new ApiError(404, 'Ürün bulunamadı')
// errorHandler bu hatayı yakalayıp standart response formatında döner.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // beklenen (ele alınan) hata — programlama hatası değil
  }
}
