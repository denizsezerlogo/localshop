import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { addItemRules, updateItemRules, productIdParamRule } from '../validators/cart.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Sepet yalnızca customer rolüne açıktır (PDF'teki rol tanımları gereği)
router.use(protect, authorize('customer'));

router.get('/', cartController.getCart);
router.post('/items', addItemRules, validate, cartController.addItem);
router.put('/items/:productId', updateItemRules, validate, cartController.updateItem);
router.delete('/items/:productId', productIdParamRule, validate, cartController.removeItem);

export default router;
