import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

// Servis sağlık kontrolü
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() }, message: '' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

export default router;
