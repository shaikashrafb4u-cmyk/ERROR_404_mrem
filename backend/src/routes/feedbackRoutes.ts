import { Router } from 'express';
import { submitFeedback } from '../controllers/feedbackController';

const router = Router();

// POST /api/feedback
router.post('/', submitFeedback);

export default router;
