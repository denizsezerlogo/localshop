import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { payRules } from '../validators/payment.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { paymentLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/pay', protect, authorize('customer'), paymentLimiter, payRules, validate, paymentController.pay);

export default router;
