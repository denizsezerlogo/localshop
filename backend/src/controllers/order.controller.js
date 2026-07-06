import * as orderService from '../services/order.service.js';
import { ok } from '../utils/response.js';

export async function create(req, res) {
  const order = await orderService.createOrderFromCart(req.user._id);
  ok(res, { order }, 'Sipariş oluşturuldu, ödeme bekleniyor', 201);
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
  ok(res, { order }, 'Sipariş durumu güncellendi');
}
