import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Servis sağlık kontrolü
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() }, message: '' });
});

router.use('/auth', authRoutes);

export default router;
