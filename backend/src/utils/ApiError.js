// Bilinçli olarak fırlattığımız, HTTP status kodu taşıyan hata tipi.
// Hazır metin yerine mesaj ANAHTARI + parametre taşır; istek diline çeviri
// errorHandler'da yapılır. Kullanım: throw new ApiError(404, 'PRODUCT_NOT_FOUND')
// veya parametreli: throw new ApiError(400, 'ORDER_STOCK_LEFT', name, stock)
export class ApiError extends Error {
  constructor(statusCode, key, ...params) {
    super(key);
    this.statusCode = statusCode;
    this.key = key;
    this.params = params;
    this.isOperational = true; // beklenen (ele alınan) hata — programlama hatası değil
  }
}
