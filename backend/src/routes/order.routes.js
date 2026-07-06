import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { idRule, listQueryRules, statusRules } from '../validators/order.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect); // tüm sipariş endpointleri giriş gerektirir

// DİKKAT: /seller, dinamik /:id'den önce tanımlanmalı
router.get('/seller', authorize('seller'), listQueryRules, validate, orderController.listForSeller);

router.post('/', authorize('customer'), orderController.create);
router.get('/', authorize('customer'), listQueryRules, validate, orderController.listMine);
router.get('/:id', authorize('customer'), idRule, validate, orderController.detail);

router.put('/:id/status', authorize('seller'), idRule, statusRules, validate, orderController.updateStatus);

export default router;
