import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { idRule, listQueryRules, createRules, updateRules } from '../validators/product.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// DİKKAT: sabit path'ler (/categories, /mine) dinamik /:id'den ÖNCE tanımlanmalı,
// yoksa Express "categories" kelimesini bir id sanır.
router.get('/', listQueryRules, validate, productController.list);
router.get('/categories', productController.categories);
router.get('/mine', protect, authorize('seller'), listQueryRules, validate, productController.mine);
router.get('/:id', idRule, validate, productController.detail);

// Yazma işlemleri: yalnızca seller + sahiplik kontrolü service katmanında
router.post('/', protect, authorize('seller'), createRules, validate, productController.create);
router.put('/:id', protect, authorize('seller'), idRule, updateRules, validate, productController.update);
router.delete('/:id', protect, authorize('seller'), idRule, validate, productController.remove);

export default router;
