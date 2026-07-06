import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';

// Sepet item'larında müşteriye gösterilecek ürün alanları
const PRODUCT_FIELDS = 'name price stock category sellerId';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// Populate edilmiş sepeti döner; bu arada silinmiş ürünlere ait item'ları temizler
async function populatedCart(cart) {
  await cart.populate('items.productId', PRODUCT_FIELDS);

  const validItems = cart.items.filter((item) => item.productId !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems; // ürün satıcı tarafından silinmişse sepetten otomatik düşer
    await cart.save();
  }

  // Toplam her zaman server'da, güncel DB fiyatlarından hesaplanır
  const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  return { cart, total: Number(total.toFixed(2)) };
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  return populatedCart(cart);
}

export async function addItem(userId, productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Ürün bulunamadı');

  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId.toString() === productId);
  const newQuantity = (existing?.quantity || 0) + quantity;

  // Stok kontrolü: sepetteki mevcut adet + eklenmek istenen adet stoğu aşamaz
  if (newQuantity > product.stock) {
    throw new ApiError(400, `Yetersiz stok: '${product.name}' için en fazla ${product.stock} adet ekleyebilirsiniz`);
  }

  if (existing) {
    existing.quantity = newQuantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  return populatedCart(cart);
}

export async function updateItemQuantity(userId, productId, quantity) {
  const cart = await Cart.findOne({ userId });
  const item = cart?.items.find((i) => i.productId.toString() === productId);
  if (!item) throw new ApiError(404, 'Ürün sepette bulunamadı');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Ürün bulunamadı');
  if (quantity > product.stock) {
    throw new ApiError(400, `Yetersiz stok: '${product.name}' için en fazla ${product.stock} adet seçebilirsiniz`);
  }

  item.quantity = quantity;
  await cart.save();
  return populatedCart(cart);
}

export async function removeItem(userId, productId) {
  const cart = await Cart.findOne({ userId });
  const exists = cart?.items.some((i) => i.productId.toString() === productId);
  if (!exists) throw new ApiError(404, 'Ürün sepette bulunamadı');

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  await cart.save();
  return populatedCart(cart);
}
