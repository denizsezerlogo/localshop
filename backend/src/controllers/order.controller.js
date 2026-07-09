import * as orderService from '../services/order.service.js';
import { ok } from '../utils/response.js';
import { t } from '../i18n/i18n.js';

export async function create(req, res) {
  // Sepet satıcıya göre bölündüğü için birden fazla sipariş dönebilir
  const orders = await orderService.createOrderFromCart(req.user._id);
  ok(res, { orders }, t(req.locale, 'ORDER_CREATED', orders.length), 201);
}

export async function listMine(req, res) {
  const { page, limit } = req.query;
  const result = await orderService.listMyOrders(req.user._id, { page, limit });
  ok(res, result);
}

export async function detail(req, res) {
  const order = await orderService.getOrder(req.user._id, req.params.id);
  ok(res, { order });
}

export async function listForSeller(req, res) {
  const { page, limit } = req.query;
  const result = await orderService.listSellerOrders(req.user._id, { page, limit });
  ok(res, result);
}

export async function updateStatus(req, res) {
  const order = await orderService.updateOrderStatus(req.user._id, req.params.id, req.body.status);
  ok(res, { order }, t(req.locale, 'ORDER_STATUS_UPDATED'));
}
