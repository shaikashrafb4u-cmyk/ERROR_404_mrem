import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  escalateTicket,
} from '../controllers/ticketController';

const router = Router();

// POST /api/tickets - Create a new ticket
router.post('/', createTicket);

// GET /api/tickets - List all tickets with filtering
router.get('/', getTickets);

// GET /api/tickets/:id - Get ticket details
router.get('/:id', getTicketById);

// PATCH /api/tickets/:id - Update status, department, priority
router.patch('/:id', updateTicket);

// POST /api/tickets/:id/escalate - Escalate ticket to human specialist
router.post('/:id/escalate', escalateTicket);

export default router;
