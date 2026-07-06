import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';

// Güncellemede yalnızca bu alanlara izin verilir (sellerId asla değiştirilemez)
const UPDATABLE_FIELDS = ['name', 'description', 'price', 'stock', 'category'];

function buildPagination(page, limit) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 12)); // üst sınır: tek istekte en fazla 50
  return { page: p, limit: l, skip: (p - 1) * l };
}

// Public katalog: filtre + arama + sayfalama
export async function listProducts({ category, search, page, limit }) {
  const { page: p, limit: l, skip } = buildPagination(page, limit);

  const filter = {};
  if (category) filter.category = category.toLowerCase().trim();
  if (search) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('sellerId', 'name') // müşteriye satıcının yalnızca adı gösterilir
      .sort('-createdAt')
      .skip(skip)
      .limit(l),
    Product.countDocuments(filter),
  ]);

  return { items, pagination: { total, page: p, pages: Math.ceil(total / l) || 1, limit: l } };
}

// Filtre dropdown'ı için mevcut kategoriler
export async function listCategories() {
  const categories = await Product.distinct('category');
  return categories.sort();
}

export async function getProduct(id) {
  const product = await Product.findById(id).populate('sellerId', 'name');
  if (!product) throw new ApiError(404, 'Ürün bulunamadı');
  return product;
}

export async function createProduct(sellerId, data) {
  const { name, description, price, stock, category } = data;
  return Product.create({ name, description, price, stock, category, sellerId });
}

// Sahiplik kontrolü: her seller yalnızca KENDİ ürününü değiştirebilir/silebilir
async function getOwnedProduct(sellerId, productId) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Ürün bulunamadı');
  if (product.sellerId.toString() !== sellerId.toString()) {
    throw new ApiError(403, 'Bu ürün üzerinde işlem yapma yetkiniz yok');
  }
  return product;
}

export async function updateProduct(sellerId, productId, data) {
  const product = await getOwnedProduct(sellerId, productId);

  for (const field of UPDATABLE_FIELDS) {
    if (data[field] !== undefined) product[field] = data[field];
  }

  await product.save(); // save() şema validasyonlarını çalıştırır
  return product;
}

export async function deleteProduct(sellerId, productId) {
  const product = await getOwnedProduct(sellerId, productId);
  await product.deleteOne();
}

// Seller'ın kendi ürünleri
export async function listMyProducts(sellerId, { page, limit }) {
  const { page: p, limit: l, skip } = buildPagination(page, limit);

  const [items, total] = await Promise.all([
    Product.find({ sellerId }).sort('-createdAt').skip(skip).limit(l),
    Product.countDocuments({ sellerId }),
  ]);

  return { items, pagination: { total, page: p, pages: Math.ceil(total / l) || 1, limit: l } };
}
