import * as productService from '../services/product.service.js';
import { ok } from '../utils/response.js';
import { t } from '../i18n/i18n.js';

export async function list(req, res) {
  const { category, search, page, limit } = req.query;
  const result = await productService.listProducts({ category, search, page, limit });
  ok(res, result);
}

export async function categories(req, res) {
  const result = await productService.listCategories();
  ok(res, { categories: result });
}

export async function detail(req, res) {
  const product = await productService.getProduct(req.params.id);
  ok(res, { product });
}

export async function create(req, res) {
  const product = await productService.createProduct(req.user._id, req.body);
  ok(res, { product }, t(req.locale, 'PRODUCT_CREATED'), 201);
}

export async function update(req, res) {
  const product = await productService.updateProduct(req.user._id, req.params.id, req.body);
  ok(res, { product }, t(req.locale, 'PRODUCT_UPDATED'));
}

export async function remove(req, res) {
  await productService.deleteProduct(req.user._id, req.params.id);
  ok(res, null, t(req.locale, 'PRODUCT_DELETED'));
}

export async function mine(req, res) {
  const { page, limit } = req.query;
  const result = await productService.listMyProducts(req.user._id, { page, limit });
  ok(res, result);
}
