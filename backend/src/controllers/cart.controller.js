import * as cartService from '../services/cart.service.js';
import { ok } from '../utils/response.js';
import { MSG } from '../constants/messages.js';

export async function getCart(req, res) {
  const { cart, total } = await cartService.getCart(req.user._id);
  ok(res, { cart, total });
}

export async function addItem(req, res) {
  const { productId, quantity } = req.body;
  const { cart, total } = await cartService.addItem(req.user._id, productId, quantity);
  ok(res, { cart, total }, MSG.CART_ITEM_ADDED, 201);
}

export async function updateItem(req, res) {
  const { quantity } = req.body;
  const { cart, total } = await cartService.updateItemQuantity(req.user._id, req.params.productId, quantity);
  ok(res, { cart, total }, MSG.CART_ITEM_UPDATED);
}

export async function removeItem(req, res) {
  const { cart, total } = await cartService.removeItem(req.user._id, req.params.productId);
  ok(res, { cart, total }, MSG.CART_ITEM_REMOVED);
}
