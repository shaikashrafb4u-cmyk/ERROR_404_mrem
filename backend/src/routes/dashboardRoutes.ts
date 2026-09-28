import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;
